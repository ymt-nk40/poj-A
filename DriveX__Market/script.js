/* =========================================================
   DRIVE X — Interactivity
   - Mobile burger menu
   - Product carousel (prev/next)
   - Add to cart (count + toast)
   - Search filtering
   - Deal countdown timer
   - Sticky header shadow
   - Newsletter form
   ========================================================= */

(function () {
  "use strict";

  // ---------------------------------------------------------
  // PRODUCT DATA
  // ---------------------------------------------------------
  const PRODUCTS = [
    { id: "p1", name: "Vortex Pro Console",      category: "Console",    price: 549, oldPrice: 599, rating: 4.9, badge: "HOT",  art: "console" },
    { id: "p2", name: "Apex Wireless Controller",category: "Controller", price: 89,  oldPrice: null, rating: 4.8, badge: null,   art: "controller" },
    { id: "p3", name: "Aurora RGB Headset",      category: "Headset",    price: 159, oldPrice: 199, rating: 4.7, badge: "-20%", art: "headset" },
    { id: "p4", name: "Mech 75% Keyboard",       category: "Keyboard",   price: 129, oldPrice: null, rating: 4.9, badge: "NEW",  art: "keyboard" },
    { id: "p5", name: "Stellar Edition Game",    category: "Game",       price: 69,  oldPrice: null, rating: 4.6, badge: null,   art: "game" },
    { id: "p6", name: "Phantom Gaming Mouse",    category: "Mouse",      price: 79,  oldPrice: 99,  rating: 4.8, badge: "-20%", art: "mouse" },
    { id: "p7", name: "Eclipse Streaming Cam",   category: "Webcam",     price: 109, oldPrice: null, rating: 4.5, badge: null,   art: "cam" },
    { id: "p8", name: "Titan VR Headset",        category: "VR",         price: 399, oldPrice: 449, rating: 4.7, badge: "HOT",  art: "vr" },
  ];

  const NEW_ARRIVALS = [
    { id: "n1", name: "Nebula Console Pro",   category: "Console",    price: 649, rating: 5.0, art: "console" },
    { id: "n2", name: "Stryke Pro Pad",       category: "Controller", price: 109, rating: 4.8, art: "controller" },
    { id: "n3", name: "Echo Wireless Buds",   category: "Audio",      price: 89,  rating: 4.6, art: "headset" },
    { id: "n4", name: "Onyx Mech 65",         category: "Keyboard",   price: 149, rating: 4.9, art: "keyboard" },
    { id: "n5", name: "Reactor Mouse Pro",    category: "Mouse",      price: 99,  rating: 4.7, art: "mouse" },
    { id: "n6", name: "Spectre Curved Monitor", category: "Display",  price: 499, rating: 4.8, art: "monitor" },
    { id: "n7", name: "Chrono Stream Deck",   category: "Streaming",  price: 179, rating: 4.6, art: "cam" },
  ];

  // ---------------------------------------------------------
  // SVG ART (inline so no external assets are needed)
  // ---------------------------------------------------------
  function art(kind) {
    const palette = '<defs><linearGradient id="lg-' + Math.random().toString(36).slice(2,8) +
      '" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#020011"/><stop offset="1" stop-color="#ee4503"/></linearGradient></defs>';
    const id = "g" + Math.random().toString(36).slice(2,8);
    switch (kind) {
      case "console":
        return `<svg viewBox="0 0 200 140"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#020011"/><stop offset="1" stop-color="#1f1f1f"/></linearGradient></defs><rect x="20" y="20" rx="14" width="160" height="100" fill="url(#${id})"/><circle cx="60" cy="70" r="10" fill="#ee4503"/><rect x="90" y="60" width="60" height="20" rx="4" fill="#fff"/></svg>`;
      case "controller":
        return `<svg viewBox="0 0 200 140"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#ee4503"/><stop offset="1" stop-color="#020011"/></linearGradient></defs><rect x="10" y="40" rx="40" width="180" height="80" fill="url(#${id})"/><circle cx="60" cy="80" r="9" fill="#fff"/><circle cx="140" cy="80" r="9" fill="#fff"/></svg>`;
      case "headset":
        return `<svg viewBox="0 0 200 140"><path d="M40 90 a60 60 0 0 1 120 0" stroke="#020011" stroke-width="10" fill="none"/><rect x="28" y="80" width="22" height="42" rx="8" fill="#ee4503"/><rect x="150" y="80" width="22" height="42" rx="8" fill="#ee4503"/></svg>`;
      case "keyboard":
        return `<svg viewBox="0 0 200 140"><rect x="10" y="30" width="180" height="80" rx="10" fill="#020011"/><g fill="#ee4503"><rect x="22" y="42" width="20" height="20" rx="4"/><rect x="48" y="42" width="20" height="20" rx="4"/><rect x="74" y="42" width="20" height="20" rx="4"/><rect x="100" y="42" width="20" height="20" rx="4"/><rect x="126" y="42" width="20" height="20" rx="4"/><rect x="152" y="42" width="26" height="20" rx="4"/><rect x="22" y="68" width="156" height="22" rx="4"/></g></svg>`;
      case "game":
        return `<svg viewBox="0 0 200 140"><rect x="40" y="20" width="120" height="100" rx="6" fill="#020011"/><rect x="48" y="28" width="104" height="60" rx="4" fill="#ee4503"/><rect x="48" y="96" width="104" height="6" rx="2" fill="#fff" opacity=".7"/><rect x="48" y="106" width="60" height="6" rx="2" fill="#fff" opacity=".5"/></svg>`;
      case "mouse":
        return `<svg viewBox="0 0 200 140"><path d="M60 20 q40 -10 80 0 q20 10 20 50 q0 50 -60 50 q-60 0 -60 -50 q0 -40 20 -50 z" fill="#020011"/><line x1="100" y1="30" x2="100" y2="70" stroke="#ee4503" stroke-width="4" stroke-linecap="round"/></svg>`;
      case "cam":
        return `<svg viewBox="0 0 200 140"><rect x="30" y="30" width="120" height="80" rx="10" fill="#020011"/><circle cx="90" cy="70" r="22" fill="#ee4503"/><circle cx="90" cy="70" r="10" fill="#020011"/><rect x="160" y="60" width="20" height="20" rx="4" fill="#7c7f86"/></svg>`;
      case "vr":
        return `<svg viewBox="0 0 200 140"><rect x="20" y="40" width="160" height="70" rx="20" fill="#020011"/><circle cx="70" cy="75" r="18" fill="#ee4503"/><circle cx="130" cy="75" r="18" fill="#ee4503"/></svg>`;
      case "monitor":
        return `<svg viewBox="0 0 200 140"><rect x="20" y="20" width="160" height="90" rx="8" fill="#020011"/><rect x="30" y="30" width="140" height="70" rx="4" fill="#ee4503" opacity=".85"/><rect x="80" y="115" width="40" height="6" rx="2" fill="#020011"/></svg>`;
      default:
        return `<svg viewBox="0 0 200 140"><rect x="20" y="20" width="160" height="100" rx="14" fill="#020011"/></svg>`;
    }
  }

  function stars(rating) {
    const full = Math.round(rating);
    return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
  }

  // ---------------------------------------------------------
  // RENDER PRODUCT GRID
  // ---------------------------------------------------------
  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");

  function renderProducts(list) {
    if (!productGrid) return;
    if (!list.length) {
      productGrid.innerHTML = "";
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    productGrid.innerHTML = list.map(p => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image">
          ${p.badge ? `<span class="product-badge ${p.badge === "NEW" ? "is-new" : ""}">${p.badge}</span>` : ""}
          ${art(p.art)}
        </div>
        <span class="product-meta">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span>${p.rating.toFixed(1)}</span>
        </div>
        <div class="product-foot">
          <div>
            <span class="product-price">$${p.price}</span>
            ${p.oldPrice ? `<span class="product-old">$${p.oldPrice}</span>` : ""}
          </div>
          <button
            class="add-to-cart"
            aria-label="Add ${p.name} to cart"
            data-product-id="${p.id}"
            data-product-name="${p.name}"
            data-product-price="${p.price}">+</button>
        </div>
      </article>
    `).join("");
  }
  renderProducts(PRODUCTS);

  // ---------------------------------------------------------
  // RENDER NEW-ARRIVALS CAROUSEL
  // ---------------------------------------------------------
  const carouselTrack = document.getElementById("carouselTrack");
  function renderCarousel() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = NEW_ARRIVALS.map(p => `
      <li class="carousel-slide" data-id="${p.id}">
        <div class="product-image">
          <span class="product-badge is-new">NEW</span>
          ${art(p.art)}
        </div>
        <span class="product-meta">${p.category}</span>
        <h3 class="product-title">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span>${p.rating.toFixed(1)}</span>
        </div>
        <div class="product-foot">
          <span class="product-price">$${p.price}</span>
          <button
            class="add-to-cart"
            aria-label="Add ${p.name} to cart"
            data-product-id="${p.id}"
            data-product-name="${p.name}"
            data-product-price="${p.price}">+</button>
        </div>
      </li>
    `).join("");
  }
  renderCarousel();

  // ---------------------------------------------------------
  // CAROUSEL PREV/NEXT
  // ---------------------------------------------------------
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let carouselIndex = 0;

  function visiblePerView() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1280) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!carouselTrack) return;
    const slides = carouselTrack.querySelectorAll(".carousel-slide");
    if (!slides.length) return;
    const perView = visiblePerView();
    const maxIndex = Math.max(0, slides.length - perView);
    if (carouselIndex > maxIndex) carouselIndex = maxIndex;
    if (carouselIndex < 0) carouselIndex = 0;

    // Compute transform using slide width + gap
    const styles = getComputedStyle(carouselTrack);
    const gap = parseFloat(styles.columnGap || styles.gap || 24);
    const slideRect = slides[0].getBoundingClientRect();
    const offset = (slideRect.width + gap) * carouselIndex;
    carouselTrack.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) prevBtn.disabled = carouselIndex === 0;
    if (nextBtn) nextBtn.disabled = carouselIndex === maxIndex;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { carouselIndex--; updateCarousel(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { carouselIndex++; updateCarousel(); });

  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(updateCarousel, 120);
  });
  // Initial position once layout settles
  requestAnimationFrame(updateCarousel);
  window.addEventListener("load", updateCarousel);

  // ---------------------------------------------------------
  // CART
  // ---------------------------------------------------------
  const cartCountEl = document.getElementById("cartCount");
  const cart = [];

  function updateCartCount() {
    if (!cartCountEl) return;
    const n = cart.reduce((sum, it) => sum + it.qty, 0);
    cartCountEl.textContent = n;
    cartCountEl.style.display = n > 0 ? "inline-flex" : "none";
  }
  updateCartCount();

  function addToCart(id, name, price) {
    const existing = cart.find(it => it.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name, price, qty: 1 });
    updateCartCount();
    showToast(`Added “${name}” to cart`);
  }

  // Delegated click for any add-to-cart trigger
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-product-id]");
    if (!target) return;
    const id = target.getAttribute("data-product-id");
    const name = target.getAttribute("data-product-name") || "Product";
    const price = parseFloat(target.getAttribute("data-product-price") || "0");
    if (!id) return;
    addToCart(id, name, price);
  });

  // Cart button — show summary
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      if (!cart.length) {
        showToast("Your cart is empty");
        return;
      }
      const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
      const items = cart.reduce((s, it) => s + it.qty, 0);
      showToast(`${items} item(s) · $${total.toFixed(2)} total`);
    });
  }

  // ---------------------------------------------------------
  // TOAST
  // ---------------------------------------------------------
  const toast = document.getElementById("toast");
  let toastT;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  // ---------------------------------------------------------
  // SEARCH FILTER
  // ---------------------------------------------------------
  function filterProducts(q) {
    const term = q.trim().toLowerCase();
    if (!term) return renderProducts(PRODUCTS);
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  }

  const headerSearch = document.getElementById("headerSearch");
  const headerSearchForm = document.getElementById("headerSearchForm");
  const drawerSearch = document.getElementById("drawerSearch");
  const drawerSearchForm = document.getElementById("drawerSearchForm");

  if (headerSearch) {
    headerSearch.addEventListener("input", (e) => filterProducts(e.target.value));
  }
  if (headerSearchForm) {
    headerSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const trending = document.getElementById("trending");
      if (trending) trending.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (drawerSearch) {
    drawerSearch.addEventListener("input", (e) => {
      filterProducts(e.target.value);
      if (headerSearch) headerSearch.value = e.target.value;
    });
  }
  if (drawerSearchForm) {
    drawerSearchForm.addEventListener("submit", (e) => e.preventDefault());
  }

  // ---------------------------------------------------------
  // MOBILE DRAWER
  // ---------------------------------------------------------
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawerClose = document.getElementById("drawerClose");

  function openDrawer() {
    mobileDrawer.classList.add("is-open");
    drawerOverlay.classList.add("is-open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    mobileDrawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (burgerBtn) burgerBtn.addEventListener("click", () => {
    if (mobileDrawer.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  });
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

  document.querySelectorAll(".drawer-link").forEach(a => {
    a.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) closeDrawer();
  });

  // ---------------------------------------------------------
  // STICKY HEADER SHADOW
  // ---------------------------------------------------------
  const header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------
  // DEAL COUNTDOWN (resets daily)
  // ---------------------------------------------------------
  const tH = document.getElementById("t-h");
  const tM = document.getElementById("t-m");
  const tS = document.getElementById("t-s");
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tickTimer() {
    if (!tH) return;
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000);   diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    tH.textContent = pad(h);
    tM.textContent = pad(m);
    tS.textContent = pad(s);
  }
  tickTimer();
  setInterval(tickTimer, 1000);

  // ---------------------------------------------------------
  // NEWSLETTER
  // ---------------------------------------------------------
  const nForm = document.getElementById("newsletterForm");
  const nMsg = document.getElementById("newsletterMsg");
  if (nForm) {
    nForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = nForm.querySelector("input[type=email]");
      const v = input.value.trim();
      if (!v) return;
      nMsg.textContent = `Thanks! We’ll keep ${v} posted on every drop.`;
      input.value = "";
      showToast("Subscribed to Drive X drops");
    });
  }
})();
