/* ============================================================
   Café Depeche — Cork City
   Interactions & animations
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Page loader ---------- */
  const loader = $("#loader");
  window.addEventListener("load", () => {
    if (loader) setTimeout(() => loader.classList.add("is-done"), 500);
  });
  // Safety net in case 'load' is slow (e.g. images blocked)
  setTimeout(() => loader && loader.classList.add("is-done"), 3500);

  /* ---------- Current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = $("#nav");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!open));
  };
  if (navToggle) {
    navToggle.addEventListener("click", () =>
      setMenu(!document.body.classList.contains("menu-open"))
    );
  }
  // Stagger index for mobile links + close on click
  $$(".mobile-menu__links a").forEach((a, i) => {
    a.style.setProperty("--i", i);
    a.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = $$("[data-reveal]");
  reveals.forEach((el) => {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      counters.forEach(runCounter);
    } else {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Parallax (rAF-throttled) ---------- */
  const parallaxEls = $$("[data-parallax]");
  if (parallaxEls.length && !prefersReduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  /* ---------- Smooth in-page anchor scrolling ---------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Testimonials carousel ---------- */
  const reviewsSection = $("#reviews");
  if (reviewsSection) {
    // Real review snippets sourced from public listings (Google / TripAdvisor).
    // Swap the `name` fields for real reviewer names whenever you have them.
    const data = [
      {
        quote:
          "Amazing breakfast. The pancakes are lovely and the 'I want it all' breakfast was class.",
        name: "Google review",
        role: "★★★★★",
        img: "assets/img/review-1.jpg",
      },
      {
        quote:
          "The food is just amazing. Everything on the plate was done perfectly — presentation, temperature and portion size were exactly what I'd want.",
        name: "TripAdvisor review",
        role: "★★★★★",
        img: "assets/img/review-2.jpg",
      },
      {
        quote:
          "Great atmosphere, with the music playing and really friendly staff. A proper Cork spot.",
        name: "Google review",
        role: "★★★★★",
        img: "assets/img/review-3.jpg",
      },
    ];

    const media = $("#reviewsMedia");
    const quoteEl = $("#reviewsQuote");
    const nameEl = $("#reviewsName");
    const roleEl = $("#reviewsRole");
    const prevBtn = $("#reviewsPrev");
    const nextBtn = $("#reviewsNext");

    // Build the stacked images once
    const imgs = data.map((d, i) => {
      const im = document.createElement("img");
      im.src = d.img;
      im.alt = "";
      im.loading = "lazy";
      im.className = "reviews__img";
      media.appendChild(im);
      return im;
    });

    let idx = 0;
    const len = data.length;
    const mod = (n) => ((n % len) + len) % len;

    const render = () => {
      imgs.forEach((im, i) => {
        im.classList.remove("is-active", "is-prev", "is-next");
        if (i === idx) im.classList.add("is-active");
        else if (i === mod(idx - 1)) im.classList.add("is-prev");
        else if (i === mod(idx + 1)) im.classList.add("is-next");
      });
      reviewsSection.classList.add("reviews--fading");
      setTimeout(() => {
        quoteEl.textContent = data[idx].quote;
        nameEl.textContent = data[idx].name;
        roleEl.textContent = data[idx].role;
        reviewsSection.classList.remove("reviews--fading");
      }, prefersReduced ? 0 : 220);
    };

    const go = (n) => { idx = mod(n); render(); restart(); };
    if (prevBtn) prevBtn.addEventListener("click", () => go(idx - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => go(idx + 1));

    // Auto-advance (paused on hover/focus, skipped for reduced motion)
    let timer = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const restart = () => {
      stop();
      if (prefersReduced) return;
      timer = setInterval(() => { idx = mod(idx + 1); render(); }, 6000);
    };
    reviewsSection.addEventListener("mouseenter", stop);
    reviewsSection.addEventListener("mouseleave", restart);
    reviewsSection.addEventListener("focusin", stop);
    reviewsSection.addEventListener("focusout", restart);

    render();
    restart();
  }

  /* ---------- Live opening status + today's row ---------- */
  const hoursList = $(".visit__hours");
  const statusEl = $("#openStatus");
  if (hoursList && statusEl) {
    // minutes-from-midnight ranges per weekday (0 = Sun … 6 = Sat); null = closed
    const sched = {
      1: [390, 960],  // Mon 6:30–16:00
      2: [390, 960],  // Tue
      3: [390, 990],  // Wed 6:30–16:30
      4: [390, 990],  // Thu
      5: [390, 1020], // Fri 6:30–17:00
    };

    // Resolve "now" in the café's timezone, wherever the visitor is
    const dublin = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Dublin" })
    );
    const day = dublin.getDay();
    const mins = dublin.getHours() * 60 + dublin.getMinutes();

    $$(".visit__hours li").forEach((li) => {
      const days = (li.getAttribute("data-days") || "")
        .split(",")
        .map(Number);
      if (days.includes(day)) li.classList.add("is-today");
    });

    const t = sched[day];
    const isOpen = !!t && mins >= t[0] && mins < t[1];
    statusEl.textContent = isOpen ? "Open now" : "Closed";
    statusEl.classList.add(isOpen ? "visit__status--open" : "visit__status--closed");
  }

  /* ---------- Gallery carousel (native scroll-snap + drag + progress) ---------- */
  const track = $("#galleryTrack");
  if (track) {
    const bar = $("#galleryBar");
    const prevBtn = $("#galleryPrev");
    const nextBtn = $("#galleryNext");

    const stepSize = () => {
      const slide = track.querySelector(".gallery__slide");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;

    const update = () => {
      const max = maxScroll();
      const ratio = max > 0 ? Math.min(Math.max(track.scrollLeft / max, 0), 1) : 0;
      const frac = track.clientWidth / track.scrollWidth; // thumb size
      if (bar) {
        bar.style.width = `${Math.max(frac * 100, 12)}%`;
        bar.style.left = `${ratio * (100 - Math.max(frac * 100, 12))}%`;
      }
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= max - 2;
    };

    const scrollByStep = (dir) => {
      track.scrollBy({ left: dir * stepSize(), behavior: prefersReduced ? "auto" : "smooth" });
    };
    if (prevBtn) prevBtn.addEventListener("click", () => scrollByStep(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollByStep(1));

    // Drag-to-scroll for mouse/trackpad (touch uses native scrolling)
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      down = true; moved = false;
      startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    const endDrag = (e) => {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    // Swallow the click that follows a drag
    track.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
