// =========================================================
// ABRASHIN TECHNOVA — CINEMATIC HYBRID EXPERIENCE
// Interactive intro • motion graphics • section transitions
// =========================================================

(() => {
  "use strict";

  const intro = document.getElementById("introScreen");
  const shell = document.getElementById("siteShell");
  const enterButton = document.getElementById("enterExperience");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------------------------------
  // 1. CINEMATIC INTRO + LOGO ENTRY
  // -------------------------------
  if (intro && shell) {
    document.body.classList.add("intro-active");
    shell.classList.remove("is-visible");

    // Intro typography sequence
    const question = intro.querySelector(".intro-question");
    const title = intro.querySelector(".intro-title");
    const message = intro.querySelector(".intro-message");
    const logoButton = intro.querySelector(".intro-logo-button");
    const footer = intro.querySelector(".intro-footer");

    if (window.gsap && !reducedMotion) {
      gsap.set([question, title, message, logoButton, footer], {
        opacity: 0, y: 24
      });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(question, { opacity: 1, y: 0, duration: 0.7, delay: 0.25 })
        .to(title, { opacity: 1, y: 0, duration: 0.9 }, "-=0.25")
        .to(message, { opacity: 1, y: 0, duration: 0.7 }, "-=0.35")
        .to(logoButton, { opacity: 1, y: 0, duration: 0.8 }, "-=0.15")
        .to(footer, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    } else {
      [question, title, message, logoButton, footer].forEach(el => {
        if (el) el.classList.add("intro-ready");
      });
    }

    const enterWebsite = () => {
      if (intro.classList.contains("leaving")) return;
      intro.classList.add("leaving");
      if (enterButton) enterButton.disabled = true;

      const revealSite = () => {
        intro.classList.add("hide");
        shell.classList.add("is-visible");
        document.body.classList.remove("intro-active");
        document.body.classList.add("experience-entered");
        window.scrollTo({ top: 0, behavior: "instant" });
        document.dispatchEvent(new CustomEvent("at:entered"));
      };

      if (window.gsap && !reducedMotion) {
        gsap.timeline({ onComplete: revealSite })
          .to(logoButton, { scale: 1.22, duration: 0.35, ease: "power2.in" })
          .to(intro.querySelector(".intro-content"), {
            scale: 1.08, opacity: 0, filter: "blur(12px)", duration: 0.55, ease: "power2.in"
          }, "-=0.12")
          .to(intro, { opacity: 0, duration: 0.45 }, "-=0.25");
      } else {
        window.setTimeout(revealSite, 350);
      }
    };

    if (enterButton) enterButton.addEventListener("click", enterWebsite);
  }

  // -------------------------------
  // 2. PARTICLE FIELD (CANVAS)
  // -------------------------------
  const canvas = document.getElementById("introParticles");
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(105, Math.floor((width * height) / 12500));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.35,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.55 + 0.18,
        gold: Math.random() > 0.72
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(231, 158, 75, ${p.alpha})`
          : `rgba(220, 185, 226, ${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });
  }

  // -------------------------------
  // 3. MOBILE MENU
  // -------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // -------------------------------
  // 4. REVEAL ELEMENTS ON SCROLL
  // -------------------------------
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  // -------------------------------
  // 5. ACTIVE NAVIGATION ON SCROLL
  // -------------------------------
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // -------------------------------
  // 6. CINEMATIC SECTION TRANSITIONS
  // -------------------------------
  const overlay = document.getElementById("pageTransition");
  const transitionLabel = document.getElementById("transitionLabel");
  const labels = {
    home: "BACK TO THE BEGINNING",
    about: "GET TO KNOW US",
    services: "WHAT WE CREATE",
    work: "MADE TO BE SEEN",
    contact: "LET'S CREATE TOGETHER"
  };
  let navigating = false;

  document.querySelectorAll(".header .nav a[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href").slice(1);
      const destination = document.getElementById(id);
      if (!destination || !overlay || navigating || reducedMotion) return;

      event.preventDefault();
      navigating = true;
      if (transitionLabel) transitionLabel.textContent = labels[id] || "LOADING";
      overlay.classList.remove("transition-out");
      overlay.classList.add("active");

      window.setTimeout(() => {
        history.replaceState(null, "", `#${id}`);
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          overlay.classList.add("transition-out");
          window.setTimeout(() => {
            overlay.classList.remove("active", "transition-out");
            navigating = false;
          }, 380);
        }, 520);
      }, 520);
    });
  });

  // -------------------------------
  // 7. SMALL INTERACTIONS + YEAR
  // -------------------------------
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Subtle pointer tilt for the hero brand card (desktop only)
  const heroCard = document.querySelector(".hero-logo-card");
  const heroArt = document.querySelector(".hero-art");
  if (heroCard && heroArt && window.matchMedia("(pointer:fine)").matches && !reducedMotion) {
    heroArt.addEventListener("pointermove", event => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) rotate(-3deg)`;
    });
    heroArt.addEventListener("pointerleave", () => {
      heroCard.style.transform = "";
    });
  }
})();
