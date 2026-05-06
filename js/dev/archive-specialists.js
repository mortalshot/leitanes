import "./app.min.js";
import "./popup.min.js";
/* empty css                */
/* empty css                */
const specialistsGrids = document.querySelectorAll("[data-fls-specialistsgrid]");
const FILTER_ANIMATION_DURATION = 250;
if (specialistsGrids.length) {
  specialistsGrids.forEach((grid) => {
    const filters = [...grid.querySelectorAll("[data-specialists-filter]")];
    const items = [...grid.querySelectorAll("[data-specialist-category]")];
    if (!filters.length || !items.length) return;
    const setActiveFilter = (activeFilter) => {
      filters.forEach((filter) => {
        const isActive = filter === activeFilter;
        filter.classList.toggle("is-active", isActive);
        filter.classList.toggle("btn_fill-grey", isActive);
        filter.classList.toggle("btn_border-grey", !isActive);
        filter.setAttribute("aria-pressed", String(isActive));
      });
    };
    const filterItems = (value) => {
      items.forEach((item) => {
        const categories = (item.dataset.specialistCategory || "").split(" ").filter(Boolean);
        const shouldShow = value === "all" || categories.includes(value);
        clearTimeout(item.filterAnimationTimeout);
        if (shouldShow) {
          item.hidden = false;
          item.classList.add("is-filter-hidden");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.classList.remove("is-filter-hidden");
            });
          });
          return;
        }
        item.classList.add("is-filter-hidden");
        item.filterAnimationTimeout = setTimeout(() => {
          item.hidden = true;
        }, FILTER_ANIMATION_DURATION);
      });
    };
    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const value = filter.dataset.specialistsFilter || "all";
        setActiveFilter(filter);
        filterItems(value);
      });
    });
  });
}
