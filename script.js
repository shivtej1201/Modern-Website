// Initialize AOS
AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: true,
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Enhanced button click effect
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("click", function (e) {
    let rect = this.getBoundingClientRect();
    let ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
});

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

// Preload all images to prevent loading lag during scrolling
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const frameCount = 450; // Total number of frames
const imagePathPrefix = "./Comp/"; // Path prefix for images
const imageExtension = ".jpg"; // Image file extension

let images = [];
let totalHeight;
let scrollSpeedMultiplier = 1.1;
let currentFrameIndex = 0;
let isImagesLoaded = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to preload all images
function preloadImages() {
  // Show loading indicator (optional)
  const loadingIndicator = document.createElement("div");
  // loadingIndicator.innerText = "Loading animation...";
  // loadingIndicator.style.position = "fixed";
  // loadingIndicator.style.top = "50%";
  // loadingIndicator.style.left = "50%";
  // loadingIndicator.style.transform = "translate(-50%, -50%)";
  // loadingIndicator.style.background = "rgba(0,0,0,0.7)";
  // loadingIndicator.style.color = "white";
  // loadingIndicator.style.padding = "20px";
  // loadingIndicator.style.borderRadius = "10px";
  // loadingIndicator.style.zIndex = "9999";
  document.body.appendChild(loadingIndicator);

  const promises = [];

  for (let i = 0; i < frameCount; i++) {
    promises.push(
      new Promise((resolve) => {
        const img = new Image();
        img.src = `${imagePathPrefix}${String(i).padStart(
          5,
          "0"
        )}${imageExtension}`;
        img.onload = () => {
          images[i] = img;
          loadingIndicator.innerText = `Loading animation... ${Math.floor(
            (i / frameCount) * 100
          )}%`;
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image at index ${i}`);
          resolve(); // Resolve anyway to continue loading other images
        };
      })
    );
  }

  Promise.all(promises).then(() => {
    isImagesLoaded = true;
    loadingIndicator.remove();
    updateCanvas(); // Initial render
  });
}

// Function to update the canvas based on scroll position with better performance
function updateCanvas() {
  if (!isImagesLoaded) return;

  const scrollTop = window.scrollY;
  const scrollPercent =
    (scrollTop / (totalHeight - window.innerHeight)) * scrollSpeedMultiplier;
  const newFrameIndex = Math.min(
    Math.floor(scrollPercent * (frameCount - 1)),
    frameCount - 1
  );

  if (
    newFrameIndex >= 0 &&
    newFrameIndex < images.length &&
    images[newFrameIndex]
  ) {
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[newFrameIndex], 0, 0, canvas.width, canvas.height);
    });
    currentFrameIndex = newFrameIndex;
  }
}

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateCanvas();
});

// Add scroll event listener with debounce for better performance
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateCanvas, 5); // Small delay for performance
});

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  totalHeight = document.body.scrollHeight;
  preloadImages();
});
