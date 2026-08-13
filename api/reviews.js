/* Google Business Profile reviews for the homepage and /work sliders.
 *
 * Vercel project environment variables (never committed):
 *   GOOGLE_PLACES_API_KEY   a Places API (New) key, restricted to Place Details
 *   GOOGLE_PLACE_ID         the Place ID for the Mikaro Studio listing
 *
 * Google returns at most five reviews, so the page merges these with a curated
 * set that lives in the markup. Cached for 24h at the edge and in module memory.
 * Fails open: any missing key, quota error or network fault returns an empty
 * list with 200, and the page keeps rendering its curated cards.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const cache = new Map(); // lang -> { at, data }

function shape(v) {
  const text = (v?.originalText?.text || v?.text?.text || '').trim();
  const name = v?.authorAttribution?.displayName?.trim() || '';
  if (!text || !name) return null;
  return {
    stars: Math.max(1, Math.min(5, Math.round(Number(v.rating) || 5))),
    text,
    name,
    when: v?.relativePublishTimeDescription || '',
    url: v?.googleMapsUri || v?.authorAttribution?.uri || '',
    source: 'google'
  };
}

export default async function handler(req, res) {
  const lang = String(req.query?.lang || 'en').slice(0, 5) === 'th' ? 'th' : 'en';
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (!key || !place) {
    return res.status(200).json({ reviews: [], source: 'none', reason: 'not configured' });
  }

  const hit = cache.get(lang);
  if (hit && Date.now() - hit.at < DAY_MS) return res.status(200).json(hit.data);

  try {
    const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(place)
      + '?languageCode=' + lang;
    const r = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews'
      }
    });
    if (!r.ok) throw new Error('places responded ' + r.status);
    const j = await r.json();
    const data = {
      reviews: (j.reviews || []).map(shape).filter(Boolean),
      rating: typeof j.rating === 'number' ? j.rating : null,
      count: typeof j.userRatingCount === 'number' ? j.userRatingCount : null,
      placeUrl: j.googleMapsUri || '',
      source: 'google'
    };
    cache.set(lang, { at: Date.now(), data });
    return res.status(200).json(data);
  } catch (err) {
    // stale data beats no data, and no data beats an error page
    if (hit) return res.status(200).json(hit.data);
    return res.status(200).json({ reviews: [], source: 'none', reason: String(err?.message || err) });
  }
}
