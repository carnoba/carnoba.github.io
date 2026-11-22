/* carnoba.github.io — vanilla JS */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    navLinks.forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  // Active nav on scroll
  var sections = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + id;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // Scroll progress hairline
  var progressBar = document.getElementById("scroll-progress-bar");
  function updateProgress() {
    if (!progressBar) return;
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop || 0;
    var height = doc.scrollHeight - window.innerHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  if (progressBar) {
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  // Cursor spotlight on cards
  var spotlightSelector = ".project-card, .cert-card, .glance-card";
  function bindSpotlight(el) {
    el.addEventListener("pointermove", function (e) {
      if (prefersReduced) return;
      var rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", (e.clientX - rect.left) + "px");
      el.style.setProperty("--mouse-y", (e.clientY - rect.top) + "px");
    });
    el.addEventListener("pointerleave", function () {
      el.style.removeProperty("--mouse-x");
      el.style.removeProperty("--mouse-y");
    });
  }
  document.querySelectorAll(spotlightSelector).forEach(bindSpotlight);

  // Editorial reveal on scroll (fail-safe: content visible by default)
  var revealTargets = [];
  function addRevealTargets(selector, staggerGroup) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      if (el.closest(".hero")) return; // hero stays immediately visible
      el.classList.add("reveal-target");
      if (staggerGroup) el.style.setProperty("--reveal-delay", (i % 6) * 60 + "ms");
      revealTargets.push(el);
    });
  }
  addRevealTargets(".bio-rail, .bio-chapter, .section-head, .exp-item, .research-item, .skill-group, .info-card, .contact-layout > div, .contact-link");
  addRevealTargets(".project-card, .cert-card", true);

  function revealAll() {
    revealTargets.forEach(function (el) { el.classList.add("revealed"); });
  }

  if (!prefersReduced && "IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
    // fail-safe: never keep hidden
    setTimeout(revealAll, 1800);
  } else {
    revealAll();
  }

  // Project filters with smooth transition
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card[data-category]");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      projectCards.forEach(function (card) {
        var cats = (card.getAttribute("data-category") || "").split(/\s+/);
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        if (show) {
          card.classList.remove("is-hidden");
          card.classList.add("is-filtering-in");
          requestAnimationFrame(function () {
            card.classList.add("is-filtered-visible");
            setTimeout(function () {
              card.classList.remove("is-filtering-in", "is-filtered-visible");
            }, 320);
          });
        } else {
          card.classList.add("is-hidden");
          card.classList.remove("is-filtering-in", "is-filtered-visible");
        }
      });
    });
  });

  // Certifications data & modal
  var certs = [
    { issuer: "IBM / Cognitive Class", title: "Python for Data Science", date: "Issued Feb 2026", credentialId: "d5606673-8add-436c-9691-3767a5a0e98a", verify: "https://courses.cognitiveclass.ai/", asset: "assets/certificates/1785609091092.jfif", type: "image" },
    { issuer: "MongoDB University", title: "Building RAG Apps Using MongoDB", date: "Issued Aug 2026", credentialId: "e98eadc3-b73e-4e9d-b3aa-f51dc5c3a162", verify: "https://university.mongodb.com/", asset: "assets/certificates/1785609322539.jfif", type: "image" },
    { issuer: "UniAthena / Cambridge International Qualifications, UK", title: "Basics in Machine Learning", date: "Verified credential", credentialId: "Available on request", verify: "https://uniathena.com/", asset: "assets/certificates/1785609539134.jfif", type: "image" },
    { issuer: "IBM Skills Network / Cognitive Class", title: "Prompt Engineering for Everyone", date: "Verified credential", credentialId: "Available on request", verify: "https://courses.cognitiveclass.ai/", asset: "assets/certificates/1785609671575.jfif", type: "image" },
    { issuer: "HP LIFE Foundation", title: "Data Science & Analytics", date: "Verified credential", credentialId: "Available on request", verify: "https://www.life-global.org/", asset: "assets/certificates/1785609872085.jfif", type: "image" },
    { issuer: "The Open University (OpenLearn), UK", title: "Introduction to Bookkeeping & Accounting", date: "Verified credential", credentialId: "B190_1", verify: "https://www.open.edu/openlearn/", asset: "assets/certificates/1785652677040.jfif", type: "image", extraAsset: "assets/certificates/accounting B190_1_statement.pdf", extraType: "pdf" },
    { issuer: "Bank of America / Forage", title: "Investment Banking Virtual Experience", date: "Verified credential", credentialId: "Available on request", verify: "https://www.theforage.com/", asset: "assets/certificates/1785653064597.jfif", type: "image" },
    { issuer: "VisaBridge", title: "Data Science & Analytics Internship", date: "Feb 2026", credentialId: "Available on request", verify: "mailto:carnoba9@gmail.com", asset: "assets/certificates/1785653242301.jfif", type: "image", extraAsset: "assets/certificates/internship_certificate.pdf", extraType: "pdf" }
  ];

  var certGrid = document.getElementById("cert-grid");
  var modal = document.getElementById("cert-modal");
  var modalTitle = document.getElementById("modal-title");
  var modalIssuer = document.getElementById("modal-issuer");
  var modalMedia = document.getElementById("modal-media");
  var modalDetails = document.getElementById("modal-details");
  var lastFocus = null;

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function renderCerts() {
    if (!certGrid) return;
    certGrid.innerHTML = "";
    certs.forEach(function (cert, idx) {
      var card = document.createElement("article");
      card.className = "cert-card reveal-target";
      card.style.setProperty("--reveal-delay", (idx % 6) * 60 + "ms");
      card.innerHTML =
        '<p class="cert-issuer-tag">' + escapeHtml(cert.issuer.split("/")[0].split("(")[0].trim()) + '</p>' +
        '<h3>' + escapeHtml(cert.title) + '</h3>' +
        '<p class="cert-issuer">' + escapeHtml(cert.issuer) + '</p>' +
        '<p class="cert-date">' + escapeHtml(cert.date) + '</p>' +
        '<button type="button" class="btn-inspect" data-cert-index="' + idx + '">Inspect Credential</button>';
      certGrid.appendChild(card);
      bindSpotlight(card);
      revealTargets.push(card);
      if (document.documentElement.classList.contains("reveal-ready")) {
        // observe newly created cards
        if (window.__certObserver) window.__certObserver.observe(card);
        else card.classList.add("revealed");
      } else {
        card.classList.add("revealed");
      }
    });
  }

  // Set up cert observer for dynamically rendered cards
  if (!prefersReduced && "IntersectionObserver" in window) {
    window.__certObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("revealed"); window.__certObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }

  function openModal(idx) {
    var cert = certs[idx];
    if (!cert || !modal) return;
    lastFocus = document.activeElement;
    modalIssuer.textContent = cert.issuer;
    modalTitle.textContent = cert.title;
    var mediaHtml = "";
    if (cert.asset && cert.type === "image") {
      mediaHtml += '<img src="' + escapeHtml(cert.asset) + '" alt="' + escapeHtml(cert.title) + ' credential" loading="lazy">';
    } else if (cert.asset && cert.type === "pdf") {
      mediaHtml += '<iframe src="' + escapeHtml(cert.asset) + '" title="' + escapeHtml(cert.title) + ' credential PDF"></iframe>';
    }
    if (cert.extraAsset && cert.extraType === "pdf") {
      mediaHtml += '<p class="modal-pdf-link"><a href="' + escapeHtml(cert.extraAsset) + '" target="_blank" rel="noopener noreferrer" class="text-link">Open supporting document (PDF)</a></p>';
    }
    if (!mediaHtml) mediaHtml = '<div class="modal-fallback"><p>Verified credential record</p></div>';
    modalMedia.innerHTML = mediaHtml;
    var verifyHtml = cert.verify.indexOf("mailto:") === 0
      ? '<a href="' + escapeHtml(cert.verify) + '" class="text-link">Request verification</a>'
      : '<a href="' + escapeHtml(cert.verify) + '" target="_blank" rel="noopener noreferrer" class="text-link">Verify source</a>';
    modalDetails.innerHTML =
      '<div class="modal-detail"><dt>Issuer</dt><dd>' + escapeHtml(cert.issuer) + '</dd></div>' +
      '<div class="modal-detail"><dt>Issue date</dt><dd>' + escapeHtml(cert.date) + '</dd></div>' +
      '<div class="modal-detail"><dt>Credential ID</dt><dd class="mono">' + escapeHtml(cert.credentialId) + '</dd></div>' +
      '<div class="modal-detail"><dt>Verification</dt><dd>' + verifyHtml + '</dd></div>';
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  if (certGrid) {
    renderCerts();
    certGrid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cert-index]");
      if (!btn) return;
      openModal(parseInt(btn.getAttribute("data-cert-index"), 10));
    });
  }

  if (modal) {
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-modal-close]")) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  }
})();


// Project image lightbox
document.querySelectorAll('[data-lightbox-src]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var src = btn.getAttribute('data-lightbox-src');
    var alt = btn.getAttribute('data-lightbox-alt') || 'Project screenshot';
    if (!modal) return;
    lastFocus = document.activeElement;
    modalIssuer.textContent = 'Project preview';
    modalTitle.textContent = alt;
    modalMedia.innerHTML = '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '" loading="lazy">';
    modalDetails.innerHTML = '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  });
});

// Hero staggered reveal
(function(){
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var targets = hero.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-lead, .hero-actions, .hero-socials, .glance-card');
  targets.forEach(function(el, i){
    el.classList.add('hero-anim');
    el.style.setProperty('--d', (i * 90) + 'ms');
  });
  document.documentElement.classList.add('hero-loaded');
  // failsafe
  setTimeout(function(){ targets.forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; }); }, 1400);
})();

// Animated key metrics count-up
(function(){
  var items = document.querySelectorAll('.count-up[data-target]');
  if (!items.length) return;
  function formatNum(val, el){
    var decimals = parseInt(el.getAttribute('data-decimals')||'0',10);
    var suffix = el.getAttribute('data-suffix')||'';
    var comma = el.getAttribute('data-format') === 'comma';
    var n = decimals ? val.toFixed(decimals) : Math.round(val).toString();
    if (comma) n = Math.round(val).toLocaleString('en-US');
    return n + suffix;
  }
  function animate(el){
    if (el.__counted) return; el.__counted = true;
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix')||'';
    var decimals = parseInt(el.getAttribute('data-decimals')||'0',10);
    var comma = el.getAttribute('data-format') === 'comma';
    var duration = 1200;
    var start = performance.now();
    function tick(now){
      var p = Math.min((now-start)/duration, 1);
      var ease = 1 - Math.pow(1-p, 3);
      var val = target * ease;
      el.textContent = formatNum(val, el);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(target, el);
    }
    requestAnimationFrame(tick);
  }
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(function(el){ el.textContent = formatNum(parseFloat(el.getAttribute('data-target')), el); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animate(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  items.forEach(function(el){ obs.observe(el); });
})();