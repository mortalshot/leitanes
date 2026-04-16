import { l as lightGallery } from "./gallery.min.js";
import { b as bodyLockStatus, a as bodyLock, c as bodyUnlock } from "./app.min.js";
const KEY = "7EC452A9-0CFD441C-BD984C7C-17C8456E";
let galleryOwnsLock = false;
function initGallery() {
  const galleries = document.querySelectorAll("[data-fls-gallery]");
  if (!galleries.length) return;
  galleries.forEach((gallery) => {
    lightGallery(gallery, {
      licenseKey: KEY,
      selector: "[data-gallery-item]",
      speed: 500,
      download: false
    });
    gallery.addEventListener("lgAfterOpen", () => {
      if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
        galleryOwnsLock = false;
        return;
      }
      if (bodyLockStatus) {
        bodyLock(0);
        galleryOwnsLock = true;
      }
    });
    gallery.addEventListener("lgAfterClose", () => {
      if (!galleryOwnsLock) return;
      bodyUnlock(0);
      galleryOwnsLock = false;
    });
  });
}
window.addEventListener("load", initGallery);
