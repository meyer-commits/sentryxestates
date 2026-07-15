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

  // County -> town cascading dropdown (contact.html)
  var TOWNS_BY_COUNTY = {
    "Rockland County": ["Clarkstown", "Haverstraw", "Orangetown", "Ramapo", "Stony Point"],
    "Westchester County": [
      "Bedford", "Cortlandt", "Eastchester", "Greenburgh", "Harrison", "Lewisboro",
      "Mamaroneck", "Mount Pleasant", "New Castle", "North Castle", "North Salem",
      "Ossining", "Pelham", "Pound Ridge", "Rye", "Scarsdale", "Somers", "Yorktown"
    ],
    "Orange County": [
      "Blooming Grove", "Chester", "Cornwall", "Crawford", "Deerpark", "Goshen",
      "Greenville", "Hamptonburgh", "Highlands", "Minisink", "Monroe", "Montgomery",
      "Mount Hope", "New Windsor", "Newburgh", "Palm Tree", "Tuxedo", "Wallkill",
      "Warwick", "Wawayanda", "Woodbury"
    ]
  };
  var countySelect = document.querySelector("[data-county-select]");
  var townshipField = document.querySelector("[data-township-field]");
  var townshipSelect = document.querySelector("[data-township-select]");
  if (countySelect && townshipField && townshipSelect) {
    countySelect.addEventListener("change", function () {
      var towns = TOWNS_BY_COUNTY[countySelect.value] || [];
      townshipSelect.innerHTML = "";
      var placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select your town";
      placeholder.disabled = true;
      placeholder.selected = true;
      townshipSelect.appendChild(placeholder);
      towns.forEach(function (town) {
        var opt = document.createElement("option");
        opt.value = town;
        opt.textContent = town;
        townshipSelect.appendChild(opt);
      });
      townshipField.classList.add("is-visible");
    });
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

  // Contact form — submits to the /api/contact serverless function
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      var payload = Object.fromEntries(new FormData(form).entries());

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          var success = document.querySelector("[data-form-success]");
          if (success) {
            success.classList.add("is-visible");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          form.reset();
        })
        .catch(function () {
          alert("Something went wrong sending your message. Please call or email us directly.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }

  // Footer year
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
