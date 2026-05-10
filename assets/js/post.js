(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function setProgress() {
    var bar = document.getElementById("readProgress");
    if (!bar) return;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - window.innerHeight;
    var p = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = p + "%";
  }

  function shareWA(url, title) {
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(title + " " + url),
      "_blank"
    );
  }

  function copyLink(url) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        var t = document.getElementById("copyToast");
        if (t) {
          t.classList.add("show");
          setTimeout(function () {
            t.classList.remove("show");
          }, 2000);
        }
      });
    }
  }

  function buildTOCFromBody() {
    var body = document.querySelector(".post-body");
    var container = document.getElementById("postToc");
    if (!body || !container) return;
    var heads = body.querySelectorAll("h2, h3");
    if (!heads.length) {
      var aside = container.closest(".post-layout aside");
      if (aside) aside.style.display = "none";
      return;
    }
    var ul = document.createElement("ul");
    heads.forEach(function (h, i) {
      if (!h.id) h.id = "section-" + (i + 1);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function relatedPosts(all, current) {
    var same = all.filter(function (p) {
      return p.category === current.category && p.slug !== current.slug;
    });
    return same.slice(0, 2);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!slug) {
      document.getElementById("postRoot").innerHTML = "<p>Article not found.</p>";
      return;
    }

    window.addEventListener("scroll", setProgress, { passive: true });
    setProgress();

    fetch("posts.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (posts) {
        var post = posts.find(function (p) {
          return p.slug === slug;
        });
        if (!post) {
          document.getElementById("postRoot").innerHTML = "<p>Article not found.</p>";
          return;
        }

        document.title = post.title + " | Mikaro Studio Journal";
        var md = document.querySelector('meta[name="description"]');
        if (md) md.setAttribute("content", post.metaDescription);
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical)
          canonical.setAttribute("href", "https://mikaro.studio/post.html?slug=" + encodeURIComponent(slug));

        var root = document.getElementById("postRoot");
        root.innerHTML =
          '<header class="post-header"><span class="j-cat">' +
          esc(post.category) +
          "</span><h1>" +
          esc(post.title) +
          '</h1><p class="post-sub">' +
          esc(post.subtitle) +
          '</p><div class="post-meta">' +
          esc(post.publishDate) +
          " · " +
          esc(post.readTime) +
          " · " +
          esc(post.author) +
          "</div></header>" +
          '<div class="post-body">' +
          post.content +
          "</div>";

        buildTOCFromBody();

        var url = "https://mikaro.studio/post.html?slug=" + encodeURIComponent(slug);
        document.getElementById("shareWa")?.addEventListener("click", function (e) {
          e.preventDefault();
          shareWA(url, post.title);
        });
        document.getElementById("copyLink")?.addEventListener("click", function (e) {
          e.preventDefault();
          copyLink(url);
        });

        var rel = document.getElementById("relatedGrid");
        if (rel) {
          relatedPosts(posts, post).forEach(function (p) {
            rel.insertAdjacentHTML(
              "beforeend",
              '<article class="j-card"><h3><a href="post.html?slug=' +
                encodeURIComponent(p.slug) +
                '">' +
                esc(p.title) +
                "</a></h3><p>" +
                esc(p.excerpt.substring(0, 120)) +
                "…</p></article>"
            );
          });
        }

        if (typeof gtag === "function") {
          gtag("event", "journal_read", { slug: slug });
        }
      })
      .catch(function () {
        document.getElementById("postRoot").innerHTML = "<p>Could not load article.</p>";
      });
  });
})();
