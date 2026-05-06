import { b as bodyLockStatus, a as bodyLock, c as bodyUnlock } from "./app.min.js";
import { g as getDocument, i as isObject, e as elementChildren, S as Swiper, A as A11y, N as Navigation, l as lightGallery } from "./gallery.min.js";
import "./popup.min.js";
/* empty css               */
/* empty css              */
import "./dynamic.min.js";
/* empty css                */
/* empty css                */
function Thumb({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs"
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function isVirtualEnabled() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return false;
    return thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled;
  }
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      if (thumbsParams.swiper.destroyed) {
        initialized = false;
        return false;
      }
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on("tap", onThumbClick);
    if (isVirtualEnabled()) {
      swiper.thumbs.swiper.on("virtualUpdate", () => {
        update(false, {
          autoScroll: false
        });
      });
    }
    return true;
  }
  function update(initial, p) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || isVirtualEnabled()) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach((slideEl) => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i]) {
          thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
        }
      }
    }
    if (p?.autoScroll ?? true) {
      autoScroll(initial ? 0 : void 0);
    }
  }
  function autoScroll(slideSpeed) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`);
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
        thumbsSwiper.slideTo(newThumbsIndex, slideSpeed);
      }
    }
  }
  on("beforeInit", () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
      const document2 = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === "string" ? document2.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init();
          update(true);
        } else if (thumbsElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onThumbsSwiper = (e) => {
            thumbs.swiper = e.detail[0];
            thumbsElement.removeEventListener(eventName, onThumbsSwiper);
            init();
            update(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener(eventName, onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init();
      update(true);
    }
  });
  on("slideChange update resize observerUpdate", () => {
    update();
  });
  on("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}
const GALLERY_KEY = "7EC452A9-0CFD441C-BD984C7C-17C8456E";
function createMainSlide(item) {
  return `
		<div class="photogallery__slide swiper-slide">
			<a href="${item.full}" data-gallery-item class="photogallery__item">
				<img src="${item.preview}" alt="${item.alt}">
			</a>
		</div>
	`;
}
function createThumbSlide(item) {
  return `
		<div class="photogallery__thumb-slide swiper-slide">
			<button type="button" class="photogallery__thumb" aria-label="${item.alt}">
				<img src="${item.thumb}" alt="${item.alt}">
			</button>
		</div>
	`;
}
function initPhotogallery() {
  const galleries = document.querySelectorAll("[data-fls-photogallery]");
  if (!galleries.length) return;
  galleries.forEach((gallerySection) => {
    const mainSliderElement = gallerySection.querySelector(".photogallery__main");
    const mainWrapper = gallerySection.querySelector(".photogallery__main-wrapper");
    const thumbsSliderElement = gallerySection.querySelector(".photogallery__thumbs");
    const thumbsWrapper = gallerySection.querySelector(".photogallery__thumbs-wrapper");
    const prevButton = gallerySection.querySelector(".photogallery__arrow_prev");
    const nextButton = gallerySection.querySelector(".photogallery__arrow_next");
    const filtersWrap = gallerySection.querySelector(".photogallery__filters-wrap");
    const filtersToggle = gallerySection.querySelector(".photogallery__filters-toggle");
    const filtersToggleLabel = gallerySection.querySelector(".photogallery__filters-toggle-label");
    const filterButtons = gallerySection.querySelectorAll(".photogallery__filter");
    const sourceItems = Array.from(gallerySection.querySelectorAll(".photogallery__source-item")).map((item) => ({
      category: item.dataset.category,
      full: item.dataset.full,
      preview: item.dataset.preview,
      thumb: item.dataset.thumb,
      alt: item.dataset.alt
    }));
    let mainSwiper = null;
    let thumbsSwiper = null;
    let lightbox = null;
    let galleryOwnsLock = false;
    let currentFilter = "all";
    const handleOutsideClick = (event) => {
      if (!filtersWrap?.classList.contains("_open")) return;
      if (filtersWrap.contains(event.target)) return;
      closeDropdown();
    };
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      closeDropdown();
    };
    if (!mainSliderElement || !mainWrapper || !thumbsSliderElement || !thumbsWrapper || !prevButton || !nextButton) {
      return;
    }
    mainSliderElement.addEventListener("lgAfterOpen", () => {
      if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
        galleryOwnsLock = false;
        return;
      }
      if (bodyLockStatus) {
        bodyLock(0);
        galleryOwnsLock = true;
      }
    });
    mainSliderElement.addEventListener("lgAfterClose", () => {
      if (!galleryOwnsLock) return;
      bodyUnlock(0);
      galleryOwnsLock = false;
    });
    function getFilteredItems() {
      if (currentFilter === "all") return sourceItems;
      return sourceItems.filter((item) => item.category === currentFilter);
    }
    function closeDropdown() {
      if (!filtersWrap || !filtersToggle) return;
      filtersWrap.classList.remove("_open");
      filtersToggle.setAttribute("aria-expanded", "false");
    }
    function openDropdown() {
      if (!filtersWrap || !filtersToggle) return;
      filtersWrap.classList.add("_open");
      filtersToggle.setAttribute("aria-expanded", "true");
    }
    function destroyInstances() {
      if (lightbox) {
        lightbox.destroy();
        lightbox = null;
      }
      if (mainSwiper) {
        mainSwiper.destroy(true, true);
        mainSwiper = null;
      }
      if (thumbsSwiper) {
        thumbsSwiper.destroy(true, true);
        thumbsSwiper = null;
      }
    }
    function initLightbox() {
      lightbox = lightGallery(mainSliderElement, {
        licenseKey: GALLERY_KEY,
        selector: "[data-gallery-item]",
        speed: 500,
        download: false
      });
    }
    function initSwipers() {
      thumbsSwiper = new Swiper(thumbsSliderElement, {
        modules: [Thumb, A11y],
        observer: true,
        observeParents: true,
        slidesPerView: 3.3,
        spaceBetween: 0,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        a11y: {
          enabled: false
        },
        breakpoints: {
          768: {
            slidesPerView: 4,
            spaceBetween: 0
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8
          },
          1440: {
            slidesPerView: 7,
            spaceBetween: 16
          }
        }
      });
      mainSwiper = new Swiper(mainSliderElement, {
        modules: [Navigation, Thumb, A11y],
        observer: true,
        observeParents: true,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          prevEl: prevButton,
          nextEl: nextButton
        },
        thumbs: {
          swiper: thumbsSwiper
        },
        a11y: {
          prevSlideMessage: "Previous photo",
          nextSlideMessage: "Next photo"
        }
      });
    }
    function render() {
      const items = getFilteredItems();
      destroyInstances();
      mainWrapper.innerHTML = items.map(createMainSlide).join("");
      thumbsWrapper.innerHTML = items.map(createThumbSlide).join("");
      initSwipers();
      initLightbox();
    }
    function applyFilter(nextFilter) {
      if (nextFilter === currentFilter) {
        closeDropdown();
        return;
      }
      currentFilter = nextFilter;
      filterButtons.forEach((filterButton) => {
        filterButton.classList.toggle("_active", filterButton.dataset.filter === currentFilter);
      });
      const activeControl = gallerySection.querySelector(`.photogallery__filter[data-filter="${currentFilter}"]`);
      if (filtersToggleLabel && activeControl) {
        filtersToggleLabel.textContent = activeControl.textContent?.trim() || "";
      }
      closeDropdown();
      render();
    }
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyFilter(button.dataset.filter || "all");
      });
    });
    if (filtersToggle) {
      filtersToggle.addEventListener("click", () => {
        if (filtersWrap?.classList.contains("_open")) {
          closeDropdown();
          return;
        }
        openDropdown();
      });
    }
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    render();
  });
}
window.addEventListener("load", initPhotogallery);
