/* =====================================================================
   carnoba.github.io — Vanilla JavaScript (framework-free, lightweight)
   ===================================================================== */

(function () {
  "use strict";

  // --- Footer year ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile nav toggle ---
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open);
    });

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- IntersectionObserver reveal animations ---
  const observerOptions = {
    threshold: 0.10,
    rootMargin: "0px 0px -60px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        entry.target.style.opacity = "1";
        entry.target.style.transform = "none";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach((el) => observer.observe(el));

  // --- Safe fallback: force-show any reveal still stuck after a short timeout ---
  // Guarantees zero blank areas even if IntersectionObserver never fires
  // (e.g., above-the-fold elements on load, or observer not supported).
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach((el) => {
      if (!el.classList.contains("show")) {
        el.classList.add("show");
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
  }, 700);

  // If IntersectionObserver is not supported, show everything immediately.
  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => {
      el.classList.add("show");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // --- Project category filtering ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      // Update active button
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Filter cards with a tiny fade for smoothness
      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category.includes(filter);
        card.style.display = matches ? "flex" : "none";
        // Re-observe newly visible cards for reveal animation
        if (matches) observer.observe(card);
      });
    });
  });

  // --- Certificate assets gallery (from /assets/certificates/*.jfif) ---
  const assetGrid = document.getElementById("asset-grid");
  const certFiles = [
    "1785609091092.jfif", "1785609322539.jfif", "1785609539134.jfif",
    "1785609671575.jfif", "1785609872085.jfif", "1785652677040.jfif",
    "1785653064597.jfif", "1785653183241.jfif", "1785653242301.jfif"
  ];
  if (assetGrid) {
    certFiles.forEach((file, i) => {
      const img = document.createElement("img");
      img.src = `assets/certificates/${file}`;
      img.alt = `Certificate ${i + 1}`;
      img.loading = "lazy";
      img.onerror = () => { img.style.display = "none"; };
      assetGrid.appendChild(img);
    });
  }

})();
