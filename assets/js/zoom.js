// Initialize medium zoom.
$(document).ready(function () {
  medium_zoom = mediumZoom("[data-zoomable]", {
    background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee", // + 'ee' for trasparency.
    scrollOffset: Infinity, // Never close the zoomed image on scroll.
  });

  // Block page scrolling while an image is zoomed, so the image stays in place.
  const blockScroll = (e) => {
    if (medium_zoom.getZoomedImage()) e.preventDefault();
  };
  window.addEventListener("wheel", blockScroll, { passive: false });
  window.addEventListener("touchmove", blockScroll, { passive: false });
});
