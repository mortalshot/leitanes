const priceTables = document.querySelectorAll("[data-fls-pricetable]");
const mediaQuery = window.matchMedia("(min-width: 47.99875em)");
if (priceTables.length) {
  priceTables.forEach((priceTable) => {
    const navLinks = [...priceTable.querySelectorAll(".price-table__nav-link[href^='#']")];
    if (!navLinks.length) return;
    const sections = navLinks.map((link) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      return target ? { link, target } : null;
    }).filter(Boolean);
    if (!sections.length) return;
    let isBound = false;
    const setActiveLink = (activeLink) => {
      navLinks.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle("_active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };
    const updateActiveLink = () => {
      const header = document.querySelector(".header");
      const nav = priceTable.querySelector(".price-table__nav");
      const headerHeight = header ? header.offsetHeight : 0;
      const navHeight = nav ? nav.offsetHeight : 0;
      const threshold = headerHeight + navHeight + 24;
      let currentSection = sections[0];
      sections.forEach((section) => {
        const targetTop = section.target.getBoundingClientRect().top;
        if (targetTop <= threshold) {
          currentSection = section;
        }
      });
      if (currentSection) {
        setActiveLink(currentSection.link);
      }
    };
    const bindTracking = () => {
      if (isBound || !mediaQuery.matches) return;
      isBound = true;
      updateActiveLink();
      window.addEventListener("scroll", updateActiveLink, { passive: true });
      window.addEventListener("resize", updateActiveLink);
    };
    const unbindTracking = () => {
      if (!isBound) return;
      isBound = false;
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", updateActiveLink);
      navLinks.forEach((link) => {
        link.classList.remove("_active");
        link.removeAttribute("aria-current");
      });
    };
    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        bindTracking();
      } else {
        unbindTracking();
      }
    };
    handleMediaChange();
    mediaQuery.addEventListener("change", handleMediaChange);
  });
}
const navPages = document.querySelectorAll("[data-fls-navpage]");
if (navPages.length) {
  navPages.forEach((navPage) => {
    const list = navPage.querySelector(".nav-page__list");
    const links = [...navPage.querySelectorAll('.nav-page__link[href^="#"]')];
    if (!links.length || !list) return;
    const items = links.map((link) => {
      const id = link.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return null;
      return { link, target };
    }).filter(Boolean);
    if (!items.length) return;
    const setActiveLink = (activeItem) => {
      items.forEach(({ link }) => {
        const isActive = activeItem?.link === link;
        link.classList.toggle("_active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
      if (activeItem) {
        const activeListItem = activeItem.link.closest(".nav-page__item");
        if (activeListItem) {
          const itemLeft = activeListItem.offsetLeft;
          const itemWidth = activeListItem.offsetWidth;
          const listWidth = list.clientWidth;
          const targetLeft = itemLeft - (listWidth - itemWidth) / 2;
          list.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: "smooth"
          });
        }
      }
    };
    const getOffsetTop = () => {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 88;
      return headerHeight + navPage.offsetHeight + 24;
    };
    const updateActiveLink = () => {
      const triggerPoint = window.scrollY + getOffsetTop();
      let currentItem = items[0];
      items.forEach((item) => {
        if (item.target.offsetTop <= triggerPoint) {
          currentItem = item;
        }
      });
      setActiveLink(currentItem);
    };
    links.forEach((link) => {
      link.addEventListener("click", () => {
        const activeItem = items.find((item) => item.link === link);
        if (activeItem) {
          setActiveLink(activeItem);
        }
      });
    });
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    window.addEventListener("load", updateActiveLink);
  });
}
