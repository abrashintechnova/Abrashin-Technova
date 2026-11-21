// Abrashin Technova landing page interactions
const intro = document.getElementById("introScreen");
const shell = document.getElementById("siteShell");

// Show the branded intro on the first visit in this tab, then reveal the page.
const introSeen = sessionStorage.getItem("atIntroSeen");
if (introSeen) {
  intro.classList.add("hide");
  shell.classList.add("is-visible");
} else {
  window.addEventListener("load", () => {
    setTimeout(() => {
      intro.classList.add("hide");
      shell.classList.add("is-visible");
      sessionStorage.setItem("atIntroSeen", "yes");
    }, 2450);
  });
}

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Reveal sections and cards as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 90}ms`;
  revealObserver.observe(element);
});

// Update active navigation link while scrolling.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => sectionObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();

// Full-screen branded loader ONLY when a header navigation item is clicked.
(() => {
  const overlay = document.getElementById("pageTransition");
  const label = document.getElementById("transitionLabel");
  const headerLinks = document.querySelectorAll(".header .nav a[href^='#']");
  const labels = {
    home: "HOME",
    about: "ABOUT",
    services: "OUR SERVICES",
    work: "OUR PROJECTS",
    contact: "CONTACT"
  };
  let navigating = false;

  headerLinks.forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href").slice(1);
      const destination = document.getElementById(id);
      if (!destination || !overlay || navigating) return;

      event.preventDefault();
      navigating = true;
      if (label) label.textContent = labels[id] || "LOADING";
      overlay.classList.add("active");

      window.setTimeout(() => {
        history.replaceState(null, "", `#${id}`);
        destination.scrollIntoView({ behavior: "instant", block: "start" });
        window.setTimeout(() => {
          overlay.classList.remove("active");
          navigating = false;
        }, 180);
      }, 850);
    });
  });
})();
