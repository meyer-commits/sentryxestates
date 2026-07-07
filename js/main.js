// SentryxEstates — shared front-end behavior

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // Mobile nav toggle
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight active nav link
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav] a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("is-active");
    }
  });

  // Scroll reveal — staggered by position within each sibling group
  var revealEls = document.querySelectorAll("[data-reveal]");
  var siblingCounts = new Map();
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    var i = siblingCounts.get(parent) || 0;
    el.style.setProperty("--reveal-i", Math.min(i, 6));
    siblingCounts.set(parent, i + 1);
  });

  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Header shrink/glow on scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var lastKnownScroll = 0;
    var scrollTicking = false;
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", lastKnownScroll > 12);
      scrollTicking = false;
    };
    window.addEventListener("scroll", function () {
      lastKnownScroll = window.scrollY;
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeader);
        scrollTicking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  if (!prefersReducedMotion) {
    // Cursor-reactive spotlight glow on hero sections
    if (hasFinePointer) {
      document.querySelectorAll(".hero, .page-hero").forEach(function (section) {
        section.addEventListener("mousemove", function (e) {
          var rect = section.getBoundingClientRect();
          section.style.setProperty("--mx", (e.clientX - rect.left) + "px");
          section.style.setProperty("--my", (e.clientY - rect.top) + "px");
        });
      });

      // Magnetic buttons
      document.querySelectorAll(".btn").forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
          var rect = btn.getBoundingClientRect();
          var x = (e.clientX - rect.left - rect.width / 2) * 0.25;
          var y = (e.clientY - rect.top - rect.height / 2) * 0.35;
          btn.style.transform = "translate(" + x + "px, " + y + "px)";
        });
        btn.addEventListener("mouseleave", function () {
          btn.style.transform = "";
        });
      });
    }

    // Subtle parallax on the hero skyline
    var skyline = document.querySelector(".hero__skyline");
    if (skyline) {
      var parallaxTicking = false;
      var updateParallax = function () {
        var offset = Math.min(window.scrollY * 0.15, 60);
        skyline.style.transform = "translateY(" + offset + "px)";
        parallaxTicking = false;
      };
      window.addEventListener("scroll", function () {
        if (!parallaxTicking) {
          window.requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      }, { passive: true });
    }
  }

  // Portfolio filter (portfolio.html)
  var filterBar = document.querySelector("[data-filter-bar]");
  var cards = document.querySelectorAll("[data-property]");
  if (filterBar && cards.length) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var type = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var match = type === "all" || card.getAttribute("data-property") === type;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Contact form (client-side only — wire to a backend/Formspree endpoint before going live)
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.querySelector("[data-form-success]");
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  // Footer year
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
