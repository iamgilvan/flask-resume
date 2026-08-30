(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const languageSwitch = document.querySelector("[data-language-switch]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("#primary-navigation");
  const header = document.querySelector("[data-site-header]");
  const revealElements = document.querySelectorAll("[data-reveal]");
  const navigationLinks = document.querySelectorAll(".site-nav a");
  const sections = document.querySelectorAll("main section[id]");

  const sunIcon = "☼";
  const moonIcon = "◐";

  function themeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");

    return theme === "dark" || theme === "light" ? theme : null;
  }

  function initialTheme() {
    const urlTheme = themeFromUrl();

    if (urlTheme) {
      return urlTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function updateThemeButton(theme) {
    if (!themeToggle) {
      return;
    }

    const isDark = theme === "dark";
    const label = isDark
      ? themeToggle.dataset.labelLight
      : themeToggle.dataset.labelDark;

    themeToggle.setAttribute("aria-label", label);
    themeToggle.innerHTML = `
      <span class="theme-toggle-icon" aria-hidden="true">
        ${isDark ? sunIcon : moonIcon}
      </span>
    `;
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    updateThemeButton(theme);
  }

  function updateUrlTheme(theme) {
    const url = new URL(window.location.href);
    url.searchParams.set("theme", theme);
    window.history.replaceState({}, "", url);
  }

  setTheme(initialTheme());

  themeToggle?.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    updateUrlTheme(nextTheme);
  });

  languageSwitch?.addEventListener("click", (event) => {
    event.preventDefault();

    const currentTheme = root.getAttribute("data-theme");
    const destination = new URL(languageSwitch.href, window.location.origin);

    destination.searchParams.set("theme", currentTheme);
    window.location.assign(destination.toString());
  });

  function closeMenu() {
    if (!navigation || !menuToggle) {
      return;
    }

    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    if (!navigation) {
      return;
    }

    const isOpen = navigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  function updateHeader() {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          navigationLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("is-active", isCurrent);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
})();