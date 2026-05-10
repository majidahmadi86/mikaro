(function () {
  "use strict";

  var posts = [];
  var currentFilter = "all";

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function cardHTML(p) {
    return (
      '<article class="j-card reveal on" data-cat="' +
      esc(p.category) +
      '"><div class="j-cat">' +
      esc(p.category) +
      '</div><h2><a href="post.html?slug=' +
      encodeURIComponent(p.slug) +
      '">' +
      esc(p.title) +
      "</a></h2><p class=\"j-ex\">" +
      esc(p.excerpt) +
      '</p><div class="j-meta">' +
      esc(p.publishDate) +
      " · " +
      esc(p.readTime) +
      '</div><a class="j-read" href="post.html?slug=' +
      encodeURIComponent(p.slug) +
      '">Read article →</a></article>'
    );
  }

  function render(filter) {
    var grid = document.getElementById("journalGrid");
    var feat = document.getElementById("journalFeatured");
    if (!grid) return;

    var list = posts.slice().sort(function (a, b) {
      return new Date(b.publishDate) - new Date(a.publishDate);
    });

    if (filter !== "all") {
      list = list.filter(function (p) {
        return p.category === filter;
      });
    }

    grid.innerHTML = "";
    grid.classList.remove("skeleton");

    if (feat && list.length) {
      var f = list[0];
      feat.innerHTML =
        '<div class="j-feature"><div class="j-f-inner"><span class="j-cat">' +
        esc(f.category) +
        '</span><h2><a href="post.html?slug=' +
        encodeURIComponent(f.slug) +
        '">' +
        esc(f.title) +
        "</a></h2><p>" +
        esc(f.excerpt) +
        '</p><a class="btn-g" style="margin-top:1rem;display:inline-flex" href="post.html?slug=' +
        encodeURIComponent(f.slug) +
        '">Read featured</a></div></div>';
    }

    var start = feat && list.length ? 1 : 0;
    for (var i = start; i < list.length; i++) {
      grid.insertAdjacentHTML("beforeend", cardHTML(list[i]));
    }

    if (typeof gtag === "function") {
      gtag("event", "page_view", { page_title: "Journal" });
    }
  }

  function initFilters() {
    document.querySelectorAll("[data-cat-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentFilter = btn.getAttribute("data-cat-filter");
        document.querySelectorAll("[data-cat-filter]").forEach(function (b) {
          b.classList.toggle("on", b === btn);
        });
        render(currentFilter);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var skel = document.getElementById("journalGrid");
    if (skel) skel.classList.add("skeleton");

    fetch("posts.json", { cache: "no-cache" })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        posts = data;
        initFilters();
        render("all");
      })
      .catch(function () {
        var g = document.getElementById("journalGrid");
        if (g) g.innerHTML = "<p>Could not load articles.</p>";
      });
  });
})();
