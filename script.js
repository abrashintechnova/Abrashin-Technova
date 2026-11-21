
// ==========================================
// ABRASHIN TECHNOVA - WEBSITE INTERACTIONS
// ==========================================

const intro = document.getElementById("introScreen");
const shell = document.getElementById("siteShell");

// ==========================================
// 1. INTRO LOADING - EVERY PAGE REFRESH
// ==========================================

// Always show intro whenever the website loads or refreshes.
if (intro && shell) {
    intro.classList.remove("hide");
    shell.classList.remove("is-visible");
    const showWebsite = () => {
        setTimeout(() => {

            intro.classList.add("hide");
            shell.classList.add("is-visible");

        }, 1200); // 1.2 seconds

    };
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            showWebsite,
            { once: true }
        );
    } else {
        showWebsite();
    }
}

// ==========================================
// 2. MOBILE MENU
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });

    });
}


// ==========================================
// 3. SCROLL REVEAL ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.13
        }
    );

    revealElements.forEach((element, index) => {

        element.style.transitionDelay =
            `${(index % 3) * 90}ms`;

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {
        element.classList.add("is-visible");
    });

}


// ==========================================
// 4. ACTIVE NAVIGATION ON SCROLL
// ==========================================

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            `#${entry.target.id}`
                        );

                    });

                }

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

}


// ==========================================
// 5. DYNAMIC COPYRIGHT YEAR
// ==========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ==========================================
// 6. HEADER NAVIGATION LOADING ANIMATION
// ==========================================

(() => {

    const overlay = document.getElementById("pageTransition");
    const label = document.getElementById("transitionLabel");

    const headerLinks = document.querySelectorAll(
        ".header .nav a[href^='#']"
    );

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

            // Set loading title
            if (label) {
                label.textContent = labels[id] || "LOADING";
            }

            // Show full-screen loading animation
            overlay.classList.add("active");

            // Navigate after loading animation
            setTimeout(() => {

                history.replaceState(null, "", `#${id}`);

                destination.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                // Hide loading overlay
                setTimeout(() => {

                    overlay.classList.remove("active");
                    navigating = false;

                }, 650);

            }, 850);

        });

    });

})();
