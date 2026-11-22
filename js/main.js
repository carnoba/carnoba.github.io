/* carnoba.github.io — vanilla JS */
(function () {
  "use strict";

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

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (!menu.classList.contains("open")) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
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

  // Project filters
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
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Certifications data & modal
  var certs = [
    {
      issuer: "IBM / Cognitive Class",
      title: "Python for Data Science",
      date: "Issued Feb 2026",
      credentialId: "d5606673-8add-436c-9691-3767a5a0e98a",
      verify: "https://courses.cognitiveclass.ai/",
      asset: "assets/certificates/1785609091092.jfif",
      type: "image"
    },
    {
      issuer: "MongoDB University",
      title: "Building RAG Apps Using MongoDB",
      date: "Issued Aug 2026",
      credentialId: "e98eadc3-b73e-4e9d-b3aa-f51dc5c3a162",
      verify: "https://university.mongodb.com/",
      asset: "assets/certificates/1785609322539.jfif",
      type: "image"
    },
    {
      issuer: "UniAthena / Cambridge International Qualifications, UK",
      title: "Basics in Machine Learning",
      date: "Verified credential",
      credentialId: "Available on request",
      verify: "https://uniathena.com/",
      asset: "assets/certificates/1785609539134.jfif",
      type: "image"
    },
    {
      issuer: "IBM Skills Network / Cognitive Class",
      title: "Prompt Engineering for Everyone",
      date: "Verified credential",
      credentialId: "Available on request",
      verify: "https://courses.cognitiveclass.ai/",
      asset: "assets/certificates/1785609671575.jfif",
      type: "image"
    },
    {
      issuer: "HP LIFE Foundation",
      title: "Data Science & Analytics",
      date: "Verified credential",
      credentialId: "Available on request",
      verify: "https://www.life-global.org/",
      asset: "assets/certificates/1785609872085.jfif",
      type: "image"
    },
    {
      issuer: "The Open University (OpenLearn), UK",
      title: "Introduction to Bookkeeping & Accounting",
      date: "Verified credential",
      credentialId: "B190_1",
      verify: "https://www.open.edu/openlearn/",
      asset: "assets/certificates/1785652677040.jfif",
      type: "image",
      extraAsset: "assets/certificates/accounting B190_1_statement.pdf",
      extraType: "pdf"
    },
    {
      issuer: "Bank of America / Forage",
      title: "Investment Banking Virtual Experience",
      date: "Verified credential",
      credentialId: "Available on request",
      verify: "https://www.theforage.com/",
      asset: "assets/certificates/1785653064597.jfif",
      type: "image"
    },
    {
      issuer: "AWS",
      title: "Cloud Practitioner Essentials",
      date: "Ongoing",
      credentialId: "In progress",
      verify: "https://aws.amazon.com/training/",
      asset: "assets/certificates/1785653183241.jfif",
      type: "image"
    },
    {
      issuer: "VisaBridge",
      title: "Data Science & Analytics Internship",
      date: "Feb 2026",
      credentialId: "Available on request",
      verify: "mailto:carnoba9@gmail.com",
      asset: "assets/certificates/1785653242301.jfif",
      type: "image",
      extraAsset: "assets/certificates/internship_certificate.pdf",
      extraType: "pdf"
    }
  ];

  var certGrid = document.getElementById("cert-grid");
  var modal = document.getElementById("cert-modal");
  var modalTitle = document.getElementById("modal-title");
  var modalIssuer = document.getElementById("modal-issuer");
  var modalMedia = document.getElementById("modal-media");
  var modalDetails = document.getElementById("modal-details");
  var lastFocus = null;

  function renderCerts() {
    if (!certGrid) return;
    certGrid.innerHTML = "";
    certs.forEach(function (cert, idx) {
      var card = document.createElement("article");
      card.className = "cert-card";
      card.innerHTML =
        '<p class="cert-issuer-tag">' + escapeHtml(cert.issuer.split("/")[0].split("(")[0].trim()) + '</p>' +
        '<h3>' + escapeHtml(cert.title) + '</h3>' +
        '<p class="cert-issuer">' + escapeHtml(cert.issuer) + '</p>' +
        '<p class="cert-date">' + escapeHtml(cert.date) + '</p>' +
        '<button type="button" class="btn-inspect" data-cert-index="' + idx + '">Inspect Credential</button>';
      certGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function openModal(idx) {
    var cert = certs[idx];
    if (!cert || !modal) return;
    lastFocus = document.activeElement;
    modalIssuer.textContent = cert.issuer;
    modalTitle.textContent = cert.title;

    // Media: prefer image, also show PDF link if extraAsset pdf
    var mediaHtml = "";
    if (cert.asset && cert.type === "image") {
      mediaHtml += '<img src="' + escapeHtml(cert.asset) + '" alt="' + escapeHtml(cert.title) + ' credential" loading="lazy">';
    } else if (cert.asset && cert.type === "pdf") {
      mediaHtml += '<iframe src="' + escapeHtml(cert.asset) + '" title="' + escapeHtml(cert.title) + ' credential PDF"></iframe>';
    }
    if (cert.extraAsset && cert.extraType === "pdf") {
      mediaHtml += '<p class="modal-pdf-link"><a href="' + escapeHtml(cert.extraAsset) + '" target="_blank" rel="noopener noreferrer" class="text-link">Open supporting document (PDF)</a></p>';
    }
    if (!mediaHtml) {
      mediaHtml = '<div class="modal-fallback"><p>Verified credential record</p></div>';
    }
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
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }
})();
