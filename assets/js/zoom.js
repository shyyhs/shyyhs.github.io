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

  // Links marked data-zoom-link (e.g. the award certificate) open their image in the
  // same zoom overlay as the thumbnails instead of a new tab. A temporary <img> with
  // the image's aspect ratio is laid over the link so the zoom grows out of it; it is
  // removed again once the zoom has closed. Modifier clicks keep the normal link.
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-zoom-link]");
    if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (medium_zoom.getZoomedImage()) return;

    const img = new Image();
    img.alt = link.textContent.trim();
    img.onload = () => {
      const rect = link.getBoundingClientRect();
      const h = rect.height;
      const w = (h * img.naturalWidth) / img.naturalHeight;
      Object.assign(img.style, {
        position: "absolute",
        left: rect.left + window.scrollX + (rect.width - w) / 2 + "px",
        top: rect.top + window.scrollY + "px",
        width: w + "px",
        height: h + "px",
        opacity: "0",
        zIndex: "-1",
      });
      document.body.appendChild(img);
      medium_zoom.attach(img);
      img.addEventListener(
        "medium-zoom:closed",
        () => {
          medium_zoom.detach(img);
          img.remove();
        },
        { once: true }
      );
      medium_zoom.open({ target: img });
      // medium-zoom shows a clone of the placeholder, which copies its inline
      // opacity/z-index; make the clone visible.
      const zoomed = document.querySelector("img.medium-zoom-image--opened");
      if (zoomed) {
        zoomed.style.opacity = "1";
        zoomed.style.zIndex = "";
      }
    };
    img.src = link.href;
  });
});
