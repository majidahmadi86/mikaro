/* TEMPORARY diagnostic proxy · calls the PageSpeed Insights API from Vercel's
 * egress instead of the studio machine, whose IP the keyless PSI quota blocks.
 * Guarded to mikaro.studio URLs only. Remove once the perf round is done.
 */
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const url = String(req.query?.url || 'https://mikaro.studio/');
  const strategy = String(req.query?.strategy || 'DESKTOP').toUpperCase() === 'MOBILE' ? 'MOBILE' : 'DESKTOP';
  if (!/^https:\/\/mikaro\.studio(\/|$)/.test(url)) {
    return res.status(400).json({ error: 'mikaro.studio URLs only' });
  }
  res.setHeader('Cache-Control', 'no-store');
  try {
    // PSI_KEY comes from the Vercel project env once Mike adds it · keyless
    // calls ride Google's shared quota pool, which is permanently exhausted
    const key = process.env.PSI_KEY ? '&key=' + process.env.PSI_KEY : '';
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + encodeURIComponent(url)
      + '&strategy=' + strategy + '&category=PERFORMANCE' + key;
    const r = await fetch(api);
    if (!r.ok) return res.status(200).json({ ok: false, status: r.status, body: (await r.text()).slice(0, 300) });
    const j = await r.json();
    const lh = j.lighthouseResult || {};
    const a = lh.audits || {};
    const pick = k => a[k] ? { score: a[k].score, value: a[k].displayValue || a[k].numericValue } : null;
    const items = (k, n, map) => (a[k]?.details?.items || []).slice(0, n).map(map);
    return res.status(200).json({
      ok: true,
      strategy,
      score: Math.round((lh.categories?.performance?.score || 0) * 100),
      metrics: {
        fcp: pick('first-contentful-paint'), lcp: pick('largest-contentful-paint'),
        tbt: pick('total-blocking-time'), cls: pick('cumulative-layout-shift'),
        si: pick('speed-index')
      },
      lcpElement: a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet || null,
      lcpPhases: a['largest-contentful-paint-element']?.details?.items?.[1]?.items || null,
      unusedJs: items('unused-javascript', 6, i => ({ url: i.url, wastedKB: Math.round((i.wastedBytes || 0) / 1024), totalKB: Math.round((i.totalBytes || 0) / 1024) })),
      unusedCss: items('unused-css-rules', 6, i => ({ url: i.url, wastedKB: Math.round((i.wastedBytes || 0) / 1024) })),
      images: items('uses-responsive-images', 8, i => ({ url: (i.url || '').split('/').pop(), wastedKB: Math.round((i.wastedBytes || 0) / 1024) })),
      modernImages: items('modern-image-formats', 8, i => ({ url: (i.url || '').split('/').pop(), wastedKB: Math.round((i.wastedBytes || 0) / 1024) })),
      renderBlocking: items('render-blocking-resources', 6, i => ({ url: i.url, ms: i.wastedMs })),
      mainThread: items('mainthread-work-breakdown', 8, i => ({ group: i.groupLabel, ms: Math.round(i.duration) })),
      bootup: items('bootup-time', 6, i => ({ url: (i.url || '').split('/').slice(-1)[0], total: Math.round(i.total || 0), script: Math.round(i.scripting || 0) })),
      preloadLcp: pick('prioritize-lcp-image'),
      fetchTime: lh.fetchTime
    });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e?.message || e) });
  }
}
