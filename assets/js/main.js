(function () {
  "use strict";

  var WA = "https://wa.me/66951967330";
  var LINE = "https://line.me/ti/p/~mike_aj";

  function fireGtag() {
    if (typeof window.gtagReal === "function") {
      window.gtagReal.apply(null, arguments);
    }
  }

  /* Theme */
  function applyTheme(theme) {
    if (theme === "light") document.body.classList.add("light-mode");
    else document.body.classList.remove("light-mode");
    try {
      localStorage.setItem("mikaro-theme", theme);
    } catch (e) {}
    var btn = document.getElementById("themeToggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    fireGtag("event", "theme_toggle", { theme: theme });
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem("mikaro-theme");
    } catch (e) {}
    if (saved === "light" || saved === "dark") applyTheme(saved);
    else applyTheme("dark");

    var tg = document.getElementById("themeToggle");
    if (tg) {
      tg.addEventListener("click", function () {
        var next = document.body.classList.contains("light-mode") ? "dark" : "light";
        applyTheme(next);
      });
    }
  }

  /* Urgency bar */
  function initUrgencyBar() {
    var bar = document.getElementById("urgencyBar");
    if (!bar) return;
    try {
      if (sessionStorage.getItem("mikaro_urgency_dismiss") === "1") {
        bar.classList.add("dismissed");
        return;
      }
    } catch (e) {}
    document.body.classList.add("has-urgency");
    requestAnimationFrame(function () {
      bar.classList.add("show");
    });
    var link = bar.querySelector(".urgency-wa");
    if (link) {
      link.addEventListener("click", function () {
        fireGtag("event", "urgency_bar_click");
      });
    }
    var dismiss = bar.querySelector(".urgency-dismiss");
    if (dismiss) {
      dismiss.addEventListener("click", function () {
        bar.classList.remove("show");
        bar.classList.add("dismissed");
        document.body.classList.remove("has-urgency");
        try {
          sessionStorage.setItem("mikaro_urgency_dismiss", "1");
        } catch (e) {}
      });
    }
  }

  /* Cookie consent + GA */
  function initCookieBanner() {
    var banner = document.getElementById("cookieBanner");
    if (!banner) return;
    var consent = null;
    try {
      consent = localStorage.getItem("mikaro_consent");
    } catch (e) {}
    if (!consent) banner.classList.add("show");

    banner.querySelector('[data-cookie="accept"]')?.addEventListener("click", function () {
      try {
        localStorage.setItem("mikaro_consent", "yes");
      } catch (e) {}
      banner.classList.remove("show");
      if (typeof window.gtagReal === "function") {
        window.gtagReal("config", "GA_MEASUREMENT_ID");
      }
    });
    banner.querySelector('[data-cookie="decline"]')?.addEventListener("click", function () {
      try {
        localStorage.setItem("mikaro_consent", "no");
      } catch (e) {}
      banner.classList.remove("show");
    });
  }

  /* Nav scroll */
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    function tick() {
      var y = window.scrollY || 0;
      if (y > 60) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    tick();
    window.addEventListener("scroll", tick, { passive: true });
  }

  /* Section spy */
  function initSectionSpy() {
    var ids = ["hero", "services", "process", "about", "portfolio", "proof", "testimonials", "journal-cta", "faq", "contact"];
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!links.length) return;

    var sections = ids
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        var href = a.getAttribute("href");
        if (href === "#" + id) {
          a.classList.add("active");
        } else {
          a.classList.remove("active");
        }
      });
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* Reveal */
  function initReveal() {
    var ro = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add("on");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.1 + "s";
      ro.observe(el);
    });
  }

  /* Mobile menu */
  window.openMobMenu = function () {
    var ov = document.getElementById("mobOverlay");
    var hbg = document.getElementById("hbg");
    if (!ov || !hbg) return;
    ov.scrollTop = 0;
    ov.classList.add("open");
    hbg.classList.add("open");
    document.body.classList.add("nav-open");
    document.querySelectorAll(".float-btn, .chat-bubble, .chat-panel").forEach(function (el) {
      el.style.visibility = "hidden";
    });
    fireGtag("event", "navigation_open", { type: "mobile" });
  };

  window.closeMobMenu = function () {
    var ov = document.getElementById("mobOverlay");
    var hbg = document.getElementById("hbg");
    if (ov) ov.classList.remove("open");
    if (hbg) hbg.classList.remove("open");
    document.body.classList.remove("nav-open");
    document.querySelectorAll(".float-btn, .chat-bubble, .chat-panel").forEach(function (el) {
      el.style.visibility = "";
    });
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.closeMobMenu();
  });

  document.getElementById("mobOverlay")?.addEventListener("click", function (e) {
    if (e.target === e.currentTarget) window.closeMobMenu();
  });

  document.getElementById("mobOverlayClose")?.addEventListener("click", function () {
    window.closeMobMenu();
  });

  /* Design portfolio tabs */
  window.showDesignTab = function (tab, btn) {
    var logos = document.getElementById("dtab-logos");
    var webs = document.getElementById("dtab-webs");
    if (logos)
      logos.style.display = tab === "logos" ? "grid" : "none";
    if (webs) webs.style.display = tab === "webs" ? "grid" : "none";
    document.querySelectorAll(".d-tab").forEach(function (b) {
      b.classList.remove("on");
    });
    if (btn) btn.classList.add("on");
  };

  /* FAQ */
  window.toggleFaq = function (el) {
    var open = el.classList.contains("open");
    document.querySelectorAll(".faq-i").forEach(function (f) {
      f.classList.remove("open");
    });
    if (!open) el.classList.add("open");
  };

  /* Contact form */
  var origBtnHTML = "";

  function showFgErr(id, msg) {
    var input = document.getElementById(id);
    if (input) {
      input.classList.add("err");
      input.classList.remove("ok");
    }
    var err = document.getElementById(id + "-err");
    if (err) {
      var span = err.querySelector("span");
      if (span) span.textContent = msg;
      err.classList.add("show");
    }
    return false;
  }

  function clearFgErr(id) {
    var input = document.getElementById(id);
    if (input) input.classList.remove("err");
    var err = document.getElementById(id + "-err");
    if (err) err.classList.remove("show");
  }

  function setFgOk(id) {
    var input = document.getElementById(id);
    if (input) {
      input.classList.remove("err");
      input.classList.add("ok");
    }
    var err = document.getElementById(id + "-err");
    if (err) err.classList.remove("show");
  }

  function showFormErr(msg) {
    var el = document.getElementById("formErrMsg");
    var txt = document.getElementById("formErrTxt");
    if (txt) txt.textContent = msg;
    if (el) {
      el.classList.add("show", "err-msg");
      setTimeout(function () {
        el.classList.remove("show");
      }, 5000);
    }
  }

  function initContactForm() {
    var ts = document.getElementById("form_ts");
    if (ts) ts.value = Date.now();

    ["fn", "fe", "fm"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        if (id === "fn" && el.value.trim().length >= 2) setFgOk(id);
        if (id === "fe" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) setFgOk(id);
      });
      el.addEventListener("blur", function () {
        if (id === "fn" && el.value.trim().length > 0 && el.value.trim().length < 2)
          showFgErr("fn", "Name must be at least 2 characters");
        if (id === "fe" && el.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value))
          showFgErr("fe", "Enter a valid email address");
      });
    });
  }

  window.handleSubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var hp = document.getElementById("hp_website");
    if (hp && hp.value) {
      var btn = form.querySelector(".c-submit");
      var oh = btn.innerHTML;
      btn.innerHTML = "✓ Sent!";
      btn.style.background = "#22c55e";
      setTimeout(function () {
        btn.innerHTML = oh;
        btn.style.background = "";
        form.reset();
      }, 2500);
      return;
    }

    var elapsed = (Date.now() - parseInt(document.getElementById("form_ts").value, 10)) / 1000;
    if (elapsed < 3) {
      showFormErr("Please take a moment to fill out all fields carefully.");
      return;
    }

    var n = document.getElementById("fn").value.trim();
    var em = document.getElementById("fe").value.trim();
    var sEl = document.getElementById("fs");
    var s = sEl && sEl.value ? sEl.value : "Not specified";
    var m = document.getElementById("fm").value.trim() || "No details provided";

    var valid = true;
    clearFgErr("fn");
    if (n.length < 2) {
      showFgErr("fn", "Please enter your full name");
      valid = false;
    } else setFgOk("fn");

    clearFgErr("fe");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(em)) {
      showFgErr("fe", em ? "Please enter a valid email address" : "Email is required");
      valid = false;
    } else setFgOk("fe");

    if (!valid) {
      showFormErr("Please complete the required fields before sending.");
      return;
    }

    fireGtag("event", "form_submit", { service: s });

    var txt =
      "Hi! I found Mikaro Studio's website and I'm interested in your services.\n\nName: " +
      n +
      "\nEmail: " +
      em +
      "\nService: " +
      s +
      "\n\nMessage: " +
      m;
    window.open(WA + "?text=" + encodeURIComponent(txt), "_blank");

    var btn = form.querySelector(".c-submit");
    origBtnHTML = btn.innerHTML;
    btn.innerHTML = "Opening WhatsApp…";
    btn.style.background = "#22c55e";
    setTimeout(function () {
      btn.innerHTML = origBtnHTML;
      btn.style.background = "";
      form.reset();
      ["fn", "fe", "fm", "fs"].forEach(function (id) {
        var inp = document.getElementById(id);
        if (inp) inp.classList.remove("ok", "err");
      });
      document.getElementById("form_ts").value = Date.now();
    }, 3500);
  };

  /* Animated counters */
  function initCounters() {
    var proof = document.getElementById("proof");
    if (!proof) return;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.disconnect();
          proof.querySelectorAll("[data-count-to]").forEach(function (el) {
            var end = parseFloat(el.getAttribute("data-count-to"));
            var dec = el.getAttribute("data-decimals") === "1";
            var start = performance.now();
            function frame(now) {
              var p = Math.min(1, (now - start) / 1500);
              var eased = easeOutCubic(p);
              var v = dec ? Math.round(eased * end * 10) / 10 : Math.round(eased * end);
              el.textContent = v;
              if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          });
        });
      },
      { threshold: 0.35 }
    );
    io.observe(proof);
  }

  /* Cost estimator */
  var EST = {
    logo: {
      Basic: "5,000–8,000 THB",
      Standard: "8,000–15,000 THB",
      Premium: "15,000–25,000 THB",
    },
    website: {
      "Landing Page": "12,000–20,000 THB",
      "Business Site": "20,000–45,000 THB",
      "E-commerce": "45,000–90,000 THB",
    },
    brand: {
      Starter: "20,000–35,000 THB",
      Professional: "35,000–70,000 THB",
      Enterprise: "70,000–150,000 THB",
    },
    marketing: {
      Basic: "8,000–15,000 THB/mo",
      Standard: "15,000–30,000 THB/mo",
      Premium: "30,000+ THB/mo",
    },
    ai: {
      Basic: "15,000 THB",
      Standard: "25,000 THB",
      Premium: "45,000 THB",
    },
    english: {
      Basic: "3,000 THB/mo",
      Standard: "6,000 THB/mo",
      Premium: "10,000 THB/mo",
    },
  };

  function initEstimator() {
    if (!document.getElementById("estTierRow")) return;
    var svc = "logo";
    var tier = "Basic";

    var pillsSvc = document.querySelectorAll('[data-est-service]');
    var tierRow = document.getElementById("estTierRow");
    var priceEl = document.getElementById("estPrice");
    var noteEl = document.querySelector(".est-note");

    function labelsForService() {
      if (svc === "logo") return ["Basic", "Standard", "Premium"];
      if (svc === "website") return ["Landing Page", "Business Site", "E-commerce"];
      if (svc === "brand") return ["Starter", "Professional", "Enterprise"];
      return ["Basic", "Standard", "Premium"];
    }

    function renderTiers() {
      if (!tierRow) return;
      var labs = labelsForService();
      tier = labs[0];
      tierRow.innerHTML = "";
      labs.forEach(function (lab, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "pill-btn" + (i === 0 ? " active" : "");
        b.setAttribute("data-tier", lab);
        b.textContent = lab;
        b.addEventListener("click", function () {
          tierRow.querySelectorAll(".pill-btn").forEach(function (x) {
            x.classList.remove("active");
          });
          b.classList.add("active");
          tier = lab;
          updatePrice();
        });
        tierRow.appendChild(b);
      });
      updatePrice();
    }

    function updatePrice() {
      var map = EST[svc];
      if (!map || !priceEl) return;
      priceEl.textContent = map[tier] || "—";
    }

    pillsSvc.forEach(function (p) {
      p.addEventListener("click", function () {
        pillsSvc.forEach(function (x) {
          x.classList.remove("active");
        });
        p.classList.add("active");
        svc = p.getAttribute("data-est-service");
        renderTiers();
      });
    });

    renderTiers();

    var estBtn = document.getElementById("estWaBtn");
    if (estBtn) {
      estBtn.addEventListener("click", function () {
        var svcLabel =
          {
            logo: "Logo Design",
            website: "Website",
            brand: "Brand Package",
            marketing: "Marketing",
            ai: "AI Workshop",
            english: "English",
          }[svc] || svc;
        var msg =
          "Hi Mike, I used your estimator. I need " +
          svcLabel +
          " (" +
          tier +
          "). Can you confirm pricing?";
        window.open(WA + "?text=" + encodeURIComponent(msg), "_blank");
        fireGtag("event", "whatsapp_click", { location: "estimator" });
      });
    }
  }

  /* Journal CTA cards */
  function initJournalCta() {
    var mount = document.getElementById("journal-cta-cards");
    if (!mount) return;

    fetch("journal/posts.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (posts) {
        var list = posts.slice().sort(function (a, b) {
          return new Date(b.publishDate) - new Date(a.publishDate);
        });
        var three = list.slice(0, 3);
        mount.innerHTML = "";
        three.forEach(function (post) {
          var card = document.createElement("article");
          card.className = "journal-mini-card reveal";
          card.innerHTML =
            "<h3>" +
            escapeHtml(post.title) +
            "</h3><p>" +
            escapeHtml(post.excerpt) +
            '</p><a class="journal-readmore" href="post.html?slug=' +
            encodeURIComponent(post.slug) +
            '">Read article →</a>';
          mount.appendChild(card);
        });
        document.querySelectorAll("#journal-cta-cards .reveal").forEach(function (el) {
          el.classList.add("on");
        });
      })
      .catch(function () {
        mount.innerHTML = "<p style=\"color:rgba(255,255,255,.45)\">Journal loading soon.</p>";
      });
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  /* Chatbot Maya — rule-based tree (no API) */
  var chatOpen = false;
  var chatHistory = [];
  var leadData = {};
  var userMsgCount = 0;
  var mayaPhase = "idle";

  var INTRO_QUICK = [
    "Logo Design",
    "Website",
    "Full Package",
    "Marketing",
    "AI Workshop",
    "English",
    "Something Else",
  ];

  function silentLeadPost() {
    var url = window.MIKARO_SHEETS_URL;
    if (!url || url.indexOf("YOUR_") === 0) return;
    try {
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: leadData.name || "",
          service: leadData.service || "",
          timeline: leadData.timeline || "",
          timestamp: new Date().toISOString(),
        }),
      }).catch(function () {});
    } catch (e) {}
  }

  window.toggleChat = function () {
    chatOpen = !chatOpen;
    var p = document.getElementById("chatPanel");
    if (!p) return;
    p.classList.toggle("open", chatOpen);
    fireGtag("event", chatOpen ? "chatbot_open" : "chatbot_close");
    if (chatOpen && chatHistory.length === 0) {
      mayaPhase = "intro";
      leadData = {};
      setTimeout(function () {
        addMsg("bot", "Hi! I'm Maya 👋 What can I help you with today?");
        setQuickReplies(INTRO_QUICK);
      }, 280);
    }
  };

  function setQuickReplies(labels) {
    var qr = document.getElementById("quickReplies");
    if (!qr) return;
    qr.innerHTML = "";
    if (!labels || !labels.length) {
      qr.style.display = "none";
      return;
    }
    qr.style.display = "flex";
    labels.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "qbtn";
      b.textContent = q;
      b.addEventListener("click", function () {
        var inp = document.getElementById("chatInput");
        if (inp) inp.value = q;
        sendChat();
      });
      qr.appendChild(b);
    });
  }

  function showContactButtons(prefillText) {
    var qr = document.getElementById("quickReplies");
    if (!qr) return;
    qr.innerHTML = "";
    qr.style.display = "flex";
    var waUrl = WA + "?text=" + encodeURIComponent(prefillText || "");
    var b1 = document.createElement("button");
    b1.type = "button";
    b1.className = "qbtn";
    b1.textContent = "Message Mike on WhatsApp →";
    b1.setAttribute("data-open-wa", waUrl);
    qr.appendChild(b1);
    var b2 = document.createElement("button");
    b2.type = "button";
    b2.className = "qbtn";
    b2.textContent = "Or message on LINE →";
    b2.setAttribute("data-open-line", "1");
    qr.appendChild(b2);
  }

  function buildWaPrefill() {
    var parts = ["Hi Mike 👋"];
    var svc = leadData.service;
    if (svc === "Logo Design") {
      parts.push("I'm interested in logo design (via Maya on your site).");
      if (leadData.businessType) parts.push("Business type: " + leadData.businessType + ".");
      parts.push("You mention 48-hour delivery with 3 concepts — I'd like an exact quote.");
    } else if (svc === "Website") {
      parts.push("I'm interested in a conversion-focused website (Maya chat).");
      if (leadData.websiteStage) parts.push("Where I'm at: " + leadData.websiteStage + ".");
      parts.push("I'd like an accurate quote when you have a moment.");
    } else if (svc === "Full Package") {
      parts.push("I'm interested in the full package — logo + website + social kit within ~2 weeks.");
      if (leadData.packageTimeline) parts.push("Timeline: " + leadData.packageTimeline + ".");
      if (leadData.packageTimeline === "This week") parts.push("Maya noted limited slots this week — hoping to lock one.");
      parts.push("Can we line up scope and pricing?");
    } else if (svc === "Digital Marketing" || svc === "AI Workshop" || svc === "English for Business") {
      parts.push("I'm interested in " + svc + " (Maya chat).");
      if (leadData.mainGoal) parts.push("Main goal: " + leadData.mainGoal + ".");
      parts.push("I'd like to book a personalised session with you.");
    } else if (svc === "Custom / Other") {
      parts.push("Custom project inquiry via Maya chat:");
      if (leadData.customNote) parts.push(leadData.customNote);
      parts.push("Happy to discuss scope — what's the best next step?");
    } else {
      parts.push("I'd like to discuss a project with Mikaro Studio.");
    }
    return parts.join("\n");
  }

  function normChoice(s) {
    return (s || "").trim().toLowerCase();
  }

  function routeIntro(text) {
    var t = normChoice(text);
    if (text === "Logo Design" || (t.indexOf("logo") >= 0 && t.indexOf("website") < 0)) {
      leadData.service = "Logo Design";
      leadData.timeline = "";
      addMsg(
        "bot",
        "Great choice! Logo delivered in 48 hours, 3 concepts.\n\nWhat's your business type?"
      );
      mayaPhase = "logo_type";
      setQuickReplies(["Startup", "Small Business", "Corporate", "Personal Brand"]);
      silentLeadPost();
      return;
    }
    if (text === "Website" || t.indexOf("website") >= 0 || t === "web") {
      leadData.service = "Website";
      addMsg("bot", "A conversion-focused site, live in 5 days.\n\nWhat stage are you at?");
      mayaPhase = "website_stage";
      setQuickReplies(["I have no site yet", "I need a redesign", "I need something custom"]);
      silentLeadPost();
      return;
    }
    if (
      text === "Full Package" ||
      (t.indexOf("full") >= 0 && (t.indexOf("pack") >= 0 || t.indexOf("brand") >= 0))
    ) {
      leadData.service = "Full Package";
      addMsg(
        "bot",
        "Logo + website + social kit in 2 weeks — best value.\n\nHow soon do you need it?"
      );
      mayaPhase = "package_when";
      setQuickReplies(["This week", "This month", "Just planning"]);
      silentLeadPost();
      return;
    }
    if (text === "Marketing" || t.indexOf("market") >= 0) {
      leadData.service = "Digital Marketing";
      addMsg("bot", "Mike runs personalised sessions for each.\n\nWhat's your main goal?");
      mayaPhase = "bundle_goal";
      setQuickReplies(["More clients", "Better online presence", "Team training", "Personal growth"]);
      silentLeadPost();
      return;
    }
    if (text === "AI Workshop" || t.indexOf("ai") >= 0 || t.indexOf("workshop") >= 0) {
      leadData.service = "AI Workshop";
      addMsg("bot", "Mike runs personalised sessions for each.\n\nWhat's your main goal?");
      mayaPhase = "bundle_goal";
      setQuickReplies(["More clients", "Better online presence", "Team training", "Personal growth"]);
      silentLeadPost();
      return;
    }
    if (text === "English" || t.indexOf("english") >= 0) {
      leadData.service = "English for Business";
      addMsg("bot", "Mike runs personalised sessions for each.\n\nWhat's your main goal?");
      mayaPhase = "bundle_goal";
      setQuickReplies(["More clients", "Better online presence", "Team training", "Personal growth"]);
      silentLeadPost();
      return;
    }
    if (text === "Something Else" || t.indexOf("something else") >= 0 || t === "other") {
      leadData.service = "Custom / Other";
      addMsg(
        "bot",
        "No problem — Mike handles custom scopes too.\n\nDescribe what you need in a message."
      );
      mayaPhase = "else_wait_desc";
      var qr = document.getElementById("quickReplies");
      if (qr) qr.style.display = "none";
      silentLeadPost();
      return;
    }
    addMsg(
      "bot",
      "Pick an option below or say logo, website, full package, marketing, AI workshop, English, or something else."
    );
    setQuickReplies(INTRO_QUICK);
  }

  function addMsg(role, text) {
    var msgs = document.getElementById("chatMsgs");
    if (!msgs) return;
    var d = document.createElement("div");
    d.className = "msg " + role;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  window.sendChat = function () {
    var inp = document.getElementById("chatInput");
    var text = inp && inp.value.trim();
    if (!text) return;
    inp.value = "";
    var qr = document.getElementById("quickReplies");
    if (qr) qr.style.display = "none";
    addMsg("user", text);
    chatHistory.push({ role: "user", content: text });
    userMsgCount++;
    fireGtag("event", "chatbot_engaged");

    if (/[a-z]{2,}\s+[a-z]{2,}/i.test(text) && text.length < 80) leadData.name = text;

    if (mayaPhase === "intro") {
      routeIntro(text);
      return;
    }

    if (mayaPhase === "logo_type") {
      leadData.businessType = text;
      addMsg("bot", "Perfect. Mike can give you an exact quote in 2 minutes.");
      showContactButtons(buildWaPrefill());
      mayaPhase = "done";
      leadData.timeline = "";
      silentLeadPost();
      return;
    }

    if (mayaPhase === "website_stage") {
      leadData.websiteStage = text;
      addMsg("bot", "Understood. Let's get you an accurate quote.");
      showContactButtons(buildWaPrefill());
      mayaPhase = "done";
      silentLeadPost();
      return;
    }

    if (mayaPhase === "package_when") {
      leadData.packageTimeline = text;
      leadData.timeline = text;
      var pkgMsg =
        text === "This week"
          ? "Mike has limited slots — message now to lock yours."
          : "Great — let's line up scope and get you an accurate quote.";
      addMsg("bot", pkgMsg);
      showContactButtons(buildWaPrefill());
      mayaPhase = "done";
      silentLeadPost();
      return;
    }

    if (mayaPhase === "bundle_goal") {
      leadData.mainGoal = text;
      addMsg("bot", "Let me connect you with Mike directly.");
      showContactButtons(buildWaPrefill());
      mayaPhase = "done";
      silentLeadPost();
      return;
    }

    if (mayaPhase === "else_wait_desc") {
      leadData.customNote = text;
      leadData.service = "Custom / Other";
      addMsg("bot", "Thanks — tap below to message Mike with that context.");
      showContactButtons(buildWaPrefill());
      mayaPhase = "done";
      silentLeadPost();
      return;
    }

    if (mayaPhase === "done") {
      addMsg("bot", "Use WhatsApp or LINE below — Mike usually replies within 2 hours.");
      showContactButtons(buildWaPrefill());
      return;
    }

    routeIntro(text);
  };

  window.sendQuick = function (text) {
    var inp = document.getElementById("chatInput");
    if (inp) inp.value = text;
    sendChat();
  };

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains("qbtn")) {
      var waHref = t.getAttribute("data-open-wa");
      if (waHref) {
        window.open(waHref, "_blank");
        fireGtag("event", "whatsapp_click", { location: "chat_quick" });
        return;
      }
      if (t.getAttribute("data-open-line")) {
        window.open(LINE, "_blank");
        return;
      }
    }
  });

  /* Service card tracking */
  document.querySelectorAll("[data-service-card]").forEach(function (a) {
    a.addEventListener("click", function () {
      fireGtag("event", "service_card_click", { service: a.getAttribute("data-service-card") });
      fireGtag("event", "whatsapp_click", { location: "service_card" });
    });
  });

  /* Init */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initUrgencyBar();
    initCookieBanner();
    initNavScroll();
    initSectionSpy();
    initReveal();
    initContactForm();
    initCounters();
    initEstimator();
    initJournalCta();

    var chatHead = document.querySelector(".chat-head-info span");
    if (chatHead)
      chatHead.innerHTML =
        '<span class="status-dot"></span>Maya · AI consultant';

    document.querySelector('[href="' + WA + '"]')?.addEventListener(
      "click",
      function () {
        fireGtag("event", "whatsapp_click", { location: "generic" });
      },
      true
    );
  });
})();
