document.addEventListener("DOMContentLoaded", () => {
    const lazyImages = document.querySelectorAll("img.lazy");
  
    const onIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.onload = () => img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    };
  
    const observer = new IntersectionObserver(onIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    });
  
    lazyImages.forEach(img => observer.observe(img));
  });
  