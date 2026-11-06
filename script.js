/* ==========================================================================
   NÉRIA Jewelry Studio — script.js (portada + ficha de producto + carrito)
   Compartido por index.html y producto.html.
   Índice: 1 Configuración · 2 Datos · 3 Utilidades · 4 Imágenes faltantes
           5 Carrito (datos) · 6 Pedido por WhatsApp · 7 Tarjetas de producto
           8 Carrito (interfaz) · 9 Menú móvil · 10 Búsqueda · 11 Contacto
           12 Ficha de producto · 13 Revelado al scroll · 14 Inicio
   ========================================================================== */
(() => {
  'use strict';

  /* 1. CONFIGURACIÓN ------------------------------------------------------ */
  // Número de WhatsApp en formato internacional (ej. "56912345678"; el + se ignora).
  // Vacío = modo demostración: no se abre ningún chat y se ofrece copiar el resumen.
  const WHATSAPP_NUMBER = '+56930217437';
  const WHATSAPP_DIGITS = WHATSAPP_NUMBER.replace(/\D/g, ''); // wa.me exige solo dígitos
  const STORE_NAME = 'NÉRIA Jewelry Studio';
  const CART_STORAGE_KEY = 'neria_cart';
  const MAX_QTY = 10; // máximo por pieza (las piezas únicas siempre son 1)
  const FEATURED_IDS = ['collar-solsticio', 'aros-luna', 'anillo-eterna', 'pulsera-aurora'];

  /* 2. DATOS ---------------------------------------------------------------
     Catálogo de demostración (12 piezas). Precios en CLP, ilustrativos; las
     descripciones y características también son ficticias.
     status: 'available' | 'unique' | 'soldout'
     Fotos provisionales: REEMPLAZAR por fotografías propias o con licencia
     antes de publicar. fit:'contain' = foto de estudio sobre fondo claro.   */
  const PRODUCTS = [
    // FOTOS PENDIENTES DE AUTORIZACIÓN: ninguna foto de assets/ tiene licencia verificada para uso comercial.
    // Con marca/origen identificable en el nombre del archivo: anillo.jpg (Bvlgari), aros.jpg (Sotheby's)
    // y hero.jpg (crédito de fotógrafa externa). Reemplazar todas por fotos propias o con licencia antes de publicar.
    // Descripciones ilustrativas: no afirman materiales, certificaciones ni medidas reales.
    // lift = factor de brillo para igualar fondos que no son blanco puro (255/fondo).
    { id: 'collar-solsticio', name: 'Collar Solsticio', category: 'collares', price: 89000, status: 'available', image: 'collar.jpg', size: [640, 718], alt: 'Collar plateado con piedras brillantes y un colgante en forma de pera',
      desc: 'Collar de línea limpia con un colgante central en forma de pera. Pensado para destacar sin recargar.',
      specs: [['Acabado', 'Plateado'], ['Detalle', 'Colgante en forma de pera'], ['Uso', 'Ocasiones especiales']] },
    { id: 'collar-helios', name: 'Collar Helios', category: 'collares', price: 95000, status: 'available', image: 'helioscollar.jpg', size: [736, 920], alt: 'Collar plateado de tres cadenas superpuestas con un colgante ovalado y un medallón',
      desc: 'Tres cadenas superpuestas con un colgante ovalado y un medallón, para usar en capas.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Cadenas superpuestas'], ['Detalle', 'Colgante ovalado y medallón']] },
    { id: 'collar-alba', name: 'Collar Alba', category: 'collares', price: 79000, status: 'available', image: 'collar.alba.jpg', size: [736, 1030], lift: 1.016, alt: 'Collar de cadena fina plateada con un pequeño dije y una piedra lila en forma de corazón',
      desc: 'Cadena fina con un pequeño dije y una piedra en forma de corazón, para el uso diario.',
      specs: [['Acabado', 'Plateado'], ['Detalle', 'Dije con piedra lila'], ['Estilo', 'Minimalista']] },
    { id: 'aros-luna', name: 'Aros Luna', category: 'aros', price: 65000, status: 'available', image: 'aros.jpg', size: [736, 736], alt: 'Aros colgantes plateados con piedras brillantes y una gota en forma de pera',
      desc: 'Aros colgantes con una gota en forma de pera, de movimiento liviano.',
      specs: [['Acabado', 'Plateado'], ['Detalle', 'Piedras brillantes y gota en forma de pera'], ['Uso', 'Ocasiones especiales']] },
    { id: 'aros-orbe', name: 'Aros Orbe', category: 'aros', price: 58000, status: 'available', image: 'aros.orbe.jpg', size: [736, 774], alt: 'Par de aros de botón plateados con una piedra redonda brillante',
      desc: 'Aros de botón con una piedra redonda de gran brillo, ligeros y fáciles de combinar.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Botón con piedra redonda'], ['Uso', 'Diario']] },
    { id: 'aros-marea', name: 'Aros Marea', category: 'aros', price: 72000, status: 'soldout', image: 'aros.marea.jpg', size: [736, 736], alt: 'Aros colgantes plateados con una piedra azul en forma de gota rodeada de piedras pequeñas',
      desc: 'Aros colgantes con una piedra azul en forma de gota, rodeada de pequeñas piedras brillantes.',
      specs: [['Acabado', 'Plateado'], ['Detalle', 'Piedra azul en forma de gota'], ['Uso', 'Ocasiones especiales']] },
    { id: 'anillo-eterna', name: 'Anillo Eterna', category: 'anillos', price: 120000, status: 'unique', image: 'anillo.jpg', size: [736, 832], lift: 1.058, alt: 'Anillo plateado de diseño envolvente con piedras brillantes',
      desc: 'Anillo de diseño envolvente con piedras brillantes. Pieza única de la colección: existe una sola unidad.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Envolvente'], ['Detalle', 'Piedras brillantes']] },
    { id: 'anillo-velo', name: 'Anillo Velo', category: 'anillos', price: 68000, status: 'available', image: 'anillo.velo.jpg', size: [800, 800], alt: 'Anillo solitario plateado con una piedra central brillante',
      desc: 'Anillo solitario de línea limpia con una piedra central, fácil de combinar.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Solitario'], ['Detalle', 'Piedra central']] },
    { id: 'anillo-cima', name: 'Anillo Cima', category: 'anillos', price: 85000, status: 'available', image: 'cimaanillo.jpg', size: [736, 951], alt: 'Anillo solitario plateado con una piedra central y brazos cruzados con piedras pequeñas',
      desc: 'Anillo solitario con una piedra central y brazos cruzados con pequeñas piedras brillantes.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Solitario'], ['Detalle', 'Piedra central y brazos cruzados']] },
    { id: 'pulsera-aurora', name: 'Pulsera Aurora', category: 'pulseras', price: 75000, status: 'available', image: 'pulsera aurora.jpg', size: [736, 736], alt: 'Brazalete dorado abierto con dos piedras de color y una línea de piedras pequeñas',
      desc: 'Brazalete abierto que se enrolla en la muñeca, con dos piedras de color y una línea de piedras pequeñas.',
      specs: [['Acabado', 'Dorado'], ['Detalle', 'Dos piedras de color'], ['Ajuste', 'Abierto']] },
    { id: 'pulsera-hilo', name: 'Pulsera Hilo', category: 'pulseras', price: 54000, status: 'unique', image: 'pulsera.hilo.jpg', size: [736, 736], alt: 'Brazalete abierto plateado de textura trenzada',
      desc: 'Brazalete abierto de textura trenzada y líneas simples. Pieza única: existe una sola unidad.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Trenzado'], ['Ajuste', 'Abierto']] },
    { id: 'pulsera-brisa', name: 'Pulsera Brisa', category: 'pulseras', price: 82000, status: 'available', image: 'pulsera brisa.jpg', size: [736, 920], alt: 'Pulsera de cadena fina plateada con un motivo central de piedras brillantes y un pequeño dije',
      desc: 'Cadena fina con un motivo central de piedras brillantes y un pequeño dije en la extensión.',
      specs: [['Acabado', 'Plateado'], ['Estilo', 'Cadena fina'], ['Detalle', 'Motivo central y dije']] },
  ];

  const STATUS_LABEL = { available: 'Disponible', unique: 'Pieza única', soldout: 'Agotado' };
  const CATEGORY_LABEL = { collares: 'Collares', aros: 'Aros', anillos: 'Anillos', pulseras: 'Pulseras' };

  /* 3. UTILIDADES --------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const formatCLP = (n) => '$' + new Intl.NumberFormat('es-CL').format(n);
  const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const productURL = (id) => `producto.html?id=${encodeURIComponent(id)}`;
  const maxQtyFor = (p) => (p.status === 'unique' ? 1 : MAX_QTY);

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  // Abre/cierra una capa con transición, bloquea scroll y devuelve el foco.
  // El estado vive en `opened` (las clases CSS cambian un frame después) y onToggle
  // permite sincronizar atributos como aria-expanded.
  function createLayer({ el, openClass = 'is-open', overlay = null, focusTarget = null, onToggle = null }) {
    let lastFocus = null;
    let opened = false;
    let closeTimer = null;
    const isOpen = () => opened;

    function open() {
      if (opened) return;
      opened = true;
      clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      el.hidden = false;
      if (overlay) overlay.hidden = false;
      // doble frame para que la transición CSS se dispare
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!opened) return;
        el.classList.add(openClass);
        if (overlay) overlay.classList.add(openClass);
      }));
      document.body.classList.add('is-locked');
      setTimeout(() => {
        if (opened) (focusTarget ? $(focusTarget, el) : el.querySelector('button, input, a'))?.focus();
      }, 60);
      if (onToggle) onToggle(true);
    }

    function close({ restoreFocus = true } = {}) {
      if (!opened) return;
      opened = false;
      el.classList.remove(openClass);
      if (overlay) overlay.classList.remove(openClass);
      document.body.classList.remove('is-locked');
      const done = () => {
        el.hidden = true;
        if (overlay) overlay.hidden = true;
      };
      clearTimeout(closeTimer);
      if (reduceMotion) done(); else closeTimer = setTimeout(done, 450);
      if (restoreFocus) lastFocus?.focus?.();
      if (onToggle) onToggle(false);
    }

    // Escape cierra la capa aunque el foco no esté dentro de ella
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && opened) close();
    });

    // Atrapa el foco dentro de la capa mientras está abierta
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const items = $$('button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])', el).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    return { open, close, isOpen };
  }

  /* 4. IMÁGENES FALTANTES --------------------------------------------------
     Si un archivo de assets/ no existe, el marco muestra un marcador
     que indica exactamente qué archivo colocar.                            */
  function markMissing(img) {
    const frame = img.closest('.img-frame');
    if (!frame) return;
    frame.classList.add('is-missing');
    frame.dataset.file = (img.getAttribute('src') || '').split('/').pop();
  }
  function watchImages(root = document) {
    $$('img', root).forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markMissing(img);
    });
  }
  document.addEventListener('error', (e) => {
    if (e.target instanceof HTMLImageElement) markMissing(e.target);
  }, true);

  /* 5. CARRITO (datos) -----------------------------------------------------
     Se guarda solo [{ id, qty }] en localStorage; nombre y precio se leen
     siempre del catálogo. Las piezas únicas admiten 1 unidad y las agotadas
     no pueden agregarse.                                                    */
  const Cart = {
    items: [],

    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        this.items = (Array.isArray(raw) ? raw : [])
          .map((it) => ({ id: String(it.id), qty: Math.floor(Number(it.qty)) }))
          .filter((it) => { const p = byId(it.id); return p && p.status !== 'soldout' && it.qty > 0; })
          .map((it) => ({ id: it.id, qty: Math.min(it.qty, maxQtyFor(byId(it.id))) }));
      } catch { this.items = []; }
    },

    save() {
      try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items)); } catch { /* almacenamiento no disponible */ }
    },

    add(id, qty = 1) {
      const p = byId(id);
      if (!p) return { ok: false, message: 'No encontramos esa pieza.' };
      if (p.status === 'soldout') return { ok: false, message: `${p.name} está agotado.` };
      const max = maxQtyFor(p);
      const existing = this.items.find((it) => it.id === id);
      const current = existing ? existing.qty : 0;
      if (current >= max) {
        return { ok: false, message: p.status === 'unique' ? 'Es una pieza única: ya está en tu carrito.' : `Máximo ${MAX_QTY} unidades por pieza.` };
      }
      const next = Math.min(current + qty, max);
      if (existing) existing.qty = next; else this.items.push({ id, qty: next });
      this.save();
      return { ok: true, message: `${p.name} agregado al carrito.` };
    },

    setQty(id, qty) {
      const p = byId(id);
      const it = this.items.find((i) => i.id === id);
      if (!p || !it) return;
      if (qty <= 0) { this.remove(id); return; }
      it.qty = Math.min(qty, maxQtyFor(p));
      this.save();
    },

    remove(id) {
      this.items = this.items.filter((it) => it.id !== id);
      this.save();
    },

    lines() {
      return this.items.map((it) => ({ product: byId(it.id), qty: it.qty })).filter((l) => l.product);
    },
    count() { return this.items.reduce((s, it) => s + it.qty, 0); },
    subtotal() { return this.lines().reduce((s, l) => s + l.product.price * l.qty, 0); },
  };

  /* 6. PEDIDO POR WHATSAPP ------------------------------------------------- */
  function buildOrderMessage(lines) {
    const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const rows = lines.map((l) => `• ${l.product.name} — ${l.qty} × ${formatCLP(l.product.price)} = ${formatCLP(l.product.price * l.qty)}`);
    return [
      `Hola, quiero hacer un pedido en ${STORE_NAME}:`,
      '',
      ...rows,
      '',
      `Total: ${formatCLP(total)}`,
      '',
      '¿Me pueden confirmar la disponibilidad? Gracias.',
    ].join('\n');
  }

  // Con número configurado abre WhatsApp. Sin número devuelve false (modo demostración).
  function openWhatsApp(message) {
    if (!WHATSAPP_DIGITS) return false;
    window.open(`https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    return true;
  }

  const DEMO_NOTICE = 'Modo demostración: el número de WhatsApp aún no está configurado.';

  /* 7. TARJETAS DE PRODUCTO ----------------------------------------------- */
  const BAG_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>';

  function imageHTML(p, { lazy = true } = {}) {
    const [w, h] = p.size || [600, 660];
    return `<img${p.lift ? ` class="lift-bg" style="--lift:${p.lift}"` : ''} src="assets/${encodeURI(p.image)}" alt="${p.alt || p.name}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''}>`;
  }
  const frameClass = () => 'img-frame fit-contain'; // fotos de catálogo: completas, sin recorte

  function productCardHTML(p, { reveal = true } = {}) {
    const dotClass = p.status === 'unique' ? 'unique' : p.status === 'soldout' ? 'soldout' : '';
    const addBtn = p.status === 'soldout'
      ? ''
      : `<button class="add-btn" type="button" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">${BAG_ICON}</button>`;
    return `
      <li${reveal ? ' class="reveal"' : ''}>
        <article class="product-card" data-id="${p.id}">
          <a class="product-media" href="${productURL(p.id)}" tabindex="-1" aria-hidden="true">
            <div class="${frameClass(p)}">${imageHTML(p)}</div>
          </a>
          <div class="product-info">
            <h3 class="product-name"><a href="${productURL(p.id)}">${p.name}</a></h3>
            <p class="product-price">${formatCLP(p.price)}</p>
            <div class="product-foot">
              <p class="product-status"><span class="dot ${dotClass}" aria-hidden="true"></span>${STATUS_LABEL[p.status]}</p>
              ${addBtn}
            </div>
          </div>
        </article>
      </li>`;
  }

  function renderFeatured() {
    const grid = $('[data-featured]');
    if (!grid) return;
    const items = FEATURED_IDS.map(byId).filter(Boolean);
    grid.innerHTML = items.map(productCardHTML).join('');
    watchImages(grid);
    observeReveal(grid);
  }

  // Cualquier botón [data-add="id"] agrega la pieza al carrito (tarjetas y ficha).
  function addToCart(id, qty = 1) {
    const result = Cart.add(id, qty);
    showToast(result.message);
    if (result.ok) { refreshCart(); bumpBadge(); }
    return result.ok;
  }

  const CHECK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const feedbackTimers = new WeakMap();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const added = addToCart(btn.dataset.add, 1);
    // Confirmación discreta en el propio ícono de la tarjeta
    if (added && btn.classList.contains('add-btn')) {
      btn.innerHTML = CHECK_ICON;
      btn.classList.add('is-added');
      clearTimeout(feedbackTimers.get(btn));
      feedbackTimers.set(btn, setTimeout(() => { btn.innerHTML = BAG_ICON; btn.classList.remove('is-added'); }, 1400));
    }
  });

  /* 8. CARRITO (interfaz) -------------------------------------------------- */
  let cartLayer = null;

  function updateBadge() {
    const count = Cart.count();
    $$('[data-cart-count]').forEach((b) => { b.textContent = count; b.hidden = count === 0; });
    $$('[data-open-cart]').forEach((b) => b.setAttribute('aria-label', `Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`));
  }

  function bumpBadge() {
    if (reduceMotion) return;
    $$('[data-cart-count]').forEach((b) => {
      b.classList.remove('bump');
      void b.offsetWidth; // reinicia la animación
      b.classList.add('bump');
    });
  }

  const TRASH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l.8 12h8.4L17 7M10 11v5M14 11v5"/></svg>';

  function cartItemHTML({ product: p, qty }) {
    const max = maxQtyFor(p);
    return `
      <li class="cart-item" data-id="${p.id}">
        <a class="cart-thumb ${frameClass(p)}" href="${productURL(p.id)}" tabindex="-1" aria-hidden="true">${imageHTML(p)}</a>
        <div class="cart-item-info">
          <a class="cart-item-name" href="${productURL(p.id)}">${p.name}</a>
          <p class="cart-item-price">${formatCLP(p.price)}</p>
          <div class="qty qty-sm" role="group" aria-label="Cantidad de ${p.name}">
            <button type="button" data-cart-dec aria-label="Disminuir cantidad de ${p.name}">−</button>
            <output aria-live="polite">${qty}</output>
            <button type="button" data-cart-inc aria-label="Aumentar cantidad de ${p.name}"${qty >= max ? ' disabled' : ''}>+</button>
          </div>
          ${p.status === 'unique' ? '<p class="cart-item-note">Pieza única</p>' : ''}
        </div>
        <button class="icon-btn cart-remove" type="button" data-cart-remove aria-label="Eliminar ${p.name} del carrito">${TRASH_ICON}</button>
      </li>`;
  }

  function renderCart() {
    const body = $('[data-cart-body]');
    const foot = $('[data-cart-foot]');
    if (!body || !foot) return;
    const lines = Cart.lines();
    if (!lines.length) {
      body.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
      foot.hidden = true;
      return;
    }
    body.innerHTML = `<ul class="cart-list">${lines.map(cartItemHTML).join('')}</ul>`;
    watchImages(body);
    foot.hidden = false;
    $('[data-cart-subtotal]', foot).textContent = formatCLP(Cart.subtotal());
    const demo = !WHATSAPP_DIGITS;
    $('[data-cart-note]', foot).hidden = !demo;
    $('[data-copy-order]', foot).hidden = !demo;
  }

  function refreshCart() { renderCart(); updateBadge(); }

  function initCart() {
    const drawer = $('#carrito');
    const overlay = $('[data-overlay]');
    Cart.load();
    refreshCart();
    if (!drawer || !overlay) return;
    cartLayer = createLayer({ el: drawer, overlay, focusTarget: '[data-close-cart]' });

    $$('[data-open-cart]').forEach((b) => b.addEventListener('click', cartLayer.open));
    $('[data-close-cart]', drawer).addEventListener('click', cartLayer.close);
    overlay.addEventListener('click', cartLayer.close);

    // Controles de cada línea (delegación). Se devuelve el foco al mismo control tras redibujar.
    drawer.addEventListener('click', (e) => {
      const row = e.target.closest('.cart-item');
      if (!row) return;
      const id = row.dataset.id;
      const it = Cart.items.find((i) => i.id === id);
      if (!it) return;
      let focusSel = null;
      if (e.target.closest('[data-cart-inc]')) { Cart.setQty(id, it.qty + 1); focusSel = '[data-cart-inc]'; }
      else if (e.target.closest('[data-cart-dec]')) { Cart.setQty(id, it.qty - 1); focusSel = '[data-cart-dec]'; }
      else if (e.target.closest('[data-cart-remove]')) { Cart.remove(id); }
      else return;
      refreshCart();
      if (focusSel) {
        const next = $(`.cart-item[data-id="${id}"] ${focusSel}`, drawer) || $(`.cart-item[data-id="${id}"] [data-cart-dec]`, drawer);
        next?.focus();
      } else {
        ($('.cart-remove', drawer) || $('[data-close-cart]', drawer)).focus();
      }
    });

    $('[data-checkout]', drawer).addEventListener('click', () => {
      const lines = Cart.lines();
      if (!lines.length) return;
      if (!openWhatsApp(buildOrderMessage(lines))) showToast(DEMO_NOTICE);
    });

    $('[data-copy-order]', drawer).addEventListener('click', async () => {
      const lines = Cart.lines();
      if (!lines.length) return;
      const ok = await copyText(buildOrderMessage(lines));
      showToast(ok ? 'Resumen del pedido copiado.' : 'No se pudo copiar el resumen.');
    });

    // Mantiene sincronizadas otras pestañas abiertas
    window.addEventListener('storage', (e) => {
      if (e.key === CART_STORAGE_KEY) { Cart.load(); refreshCart(); }
    });
  }

  /* 9. MENÚ MÓVIL --------------------------------------------------------- */
  function initMobileMenu() {
    const menu = $('#menu-movil');
    const toggle = $('.menu-toggle');
    if (!menu || !toggle) return;
    const layer = createLayer({
      el: menu,
      onToggle: (open) => toggle.setAttribute('aria-expanded', String(open)),
    });

    toggle.addEventListener('click', () => (layer.isOpen() ? layer.close() : layer.open()));
    $('[data-close-menu]', menu).addEventListener('click', () => layer.close());
    // Al elegir un enlace el foco lo decide la navegación, no el botón del menú
    $$('a', menu).forEach((a) => a.addEventListener('click', () => layer.close({ restoreFocus: false })));
    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) layer.close({ restoreFocus: false }); });
  }

  /* 10. BÚSQUEDA -----------------------------------------------------------
     Busca por nombre en el catálogo; cada resultado abre su ficha.         */
  function initSearch() {
    const panel = $('#busqueda');
    const input = $('#search-input');
    const list = $('#search-results');
    const status = $('#search-status');
    if (!panel || !input) return;
    const layer = createLayer({ el: panel, focusTarget: '#search-input' });

    $$('[data-open-search]').forEach((b) => b.addEventListener('click', layer.open));
    $('[data-close-search]', panel).addEventListener('click', layer.close);

    function run() {
      const q = normalize(input.value.trim());
      list.innerHTML = '';
      if (!q) { status.textContent = ''; return; }
      const found = PRODUCTS.filter((p) => normalize(p.name).includes(q));
      status.textContent = found.length
        ? `${found.length} ${found.length === 1 ? 'resultado' : 'resultados'}`
        : 'No encontramos piezas con ese nombre.';
      list.innerHTML = found.map((p) => `
        <li>
          <a class="search-item" href="${productURL(p.id)}">
            <span>${p.name}<span class="meta">${CATEGORY_LABEL[p.category]} · ${STATUS_LABEL[p.status]}</span></span>
            <span class="price">${formatCLP(p.price)}</span>
          </a>
        </li>`).join('');
    }
    input.addEventListener('input', run);
  }

  /* 11. CONTACTO ---------------------------------------------------------- */
  function initContact() {
    const btn = $('[data-contact]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!WHATSAPP_DIGITS) { showToast(DEMO_NOTICE); return; }
      window.open(`https://wa.me/${WHATSAPP_DIGITS}`, '_blank', 'noopener');
    });
  }

  /* 12. FICHA DE PRODUCTO ---------------------------------------------------
     producto.html?id=<id-del-producto>. Las URLs por parámetro funcionan en
     GitHub Pages porque la página es siempre la misma.                      */
  function relatedProducts(current, n = 4) {
    const same = PRODUCTS.filter((p) => p.id !== current.id && p.category === current.category);
    const others = PRODUCTS.filter((p) => p.id !== current.id && p.category !== current.category);
    return [...same, ...others].slice(0, n);
  }

  function renderNotFound(root) {
    document.title = `Pieza no encontrada — ${STORE_NAME}`;
    root.innerHTML = `
      <div class="not-found">
        <h1>No encontramos esa pieza</h1>
        <p>Puede que el enlace esté incompleto o que la pieza ya no esté en la colección.</p>
        <a class="btn btn-dark" href="tienda.html"><span>Ver la tienda</span></a>
      </div>`;
  }

  function renderProduct(root, p) {
    document.title = `${p.name} — ${STORE_NAME}`;
    $('meta[name="description"]')?.setAttribute('content', `${p.name}: ${p.desc}`);

    const soldOut = p.status === 'soldout';
    const max = maxQtyFor(p);
    const dotClass = p.status === 'unique' ? 'unique' : soldOut ? 'soldout' : '';
    const statusText = p.status === 'unique' ? 'Pieza única · existe una sola unidad' : STATUS_LABEL[p.status];

    const actions = soldOut
      ? `<button class="btn btn-dark btn-block" type="button" disabled><span>Agotado</span></button>`
      : `
        <div class="pdp-buy">
          <div class="qty" role="group" aria-label="Cantidad">
            <button type="button" data-qty-dec aria-label="Disminuir cantidad" disabled>−</button>
            <output aria-live="polite" data-qty-out>1</output>
            <button type="button" data-qty-inc aria-label="Aumentar cantidad"${max <= 1 ? ' disabled' : ''}>+</button>
          </div>
          <button class="btn btn-dark btn-grow" type="button" data-pdp-add>${BAG_ICON}<span>Agregar al carrito</span></button>
        </div>
        <button class="btn btn-line btn-block" type="button" data-pdp-wa>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.2 18.8z"/><path d="M9.2 8.8c.3 2.4 2.7 4.8 5.1 5.1l1-1.2-1.8-.9-.8.6c-.9-.4-1.6-1.1-2-2l.6-.8-.9-1.8z"/></svg>
          <span>Pedir por WhatsApp</span>
        </button>
        <div class="pdp-demo" data-pdp-demo hidden>
          <p>${DEMO_NOTICE}</p>
          <button class="btn btn-line" type="button" data-pdp-copy>Copiar resumen del pedido</button>
        </div>`;

    const related = relatedProducts(p);

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Migas de pan">
        <ol>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="tienda.html?categoria=${p.category}">${CATEGORY_LABEL[p.category]}</a></li>
          <li aria-current="page">${p.name}</li>
        </ol>
      </nav>

      <div class="pdp">
        <div class="pdp-gallery">
          <div class="${frameClass(p)} pdp-main">${imageHTML(p, { lazy: false })}</div>
        </div>

        <div class="pdp-info">
          <p class="eyebrow">${CATEGORY_LABEL[p.category]}</p>
          <h1>${p.name}</h1>
          <p class="pdp-price">${formatCLP(p.price)}</p>
          <p class="pdp-desc">${p.desc}</p>
          <dl class="specs">
            ${p.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
          </dl>
          <p class="pdp-status"><span class="dot ${dotClass}" aria-hidden="true"></span>${statusText}</p>
          ${actions}
        </div>
      </div>

      <section class="related" aria-labelledby="rel-title">
        <header class="section-head">
          <h2 id="rel-title">También te puede interesar</h2>
          <a class="link-arrow" href="tienda.html">Ver todos
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
          </a>
        </header>
        <ul class="product-grid">${related.map(productCardHTML).join('')}</ul>
      </section>`;

    watchImages(root);
    observeReveal(root);

    if (soldOut) return;

    // Cantidad
    let qty = 1;
    const out = $('[data-qty-out]', root);
    const dec = $('[data-qty-dec]', root);
    const inc = $('[data-qty-inc]', root);
    const setQty = (n) => {
      qty = Math.max(1, Math.min(n, max));
      out.textContent = qty;
      dec.disabled = qty <= 1;
      inc.disabled = qty >= max;
    };
    dec.addEventListener('click', () => setQty(qty - 1));
    inc.addEventListener('click', () => setQty(qty + 1));

    // Agregar al carrito
    $('[data-pdp-add]', root).addEventListener('click', () => addToCart(p.id, qty));

    // Pedido directo por WhatsApp (solo esta pieza)
    const demo = $('[data-pdp-demo]', root);
    const singleMessage = () => buildOrderMessage([{ product: p, qty }]);
    $('[data-pdp-wa]', root).addEventListener('click', () => {
      if (!openWhatsApp(singleMessage())) { demo.hidden = false; showToast(DEMO_NOTICE); }
    });
    $('[data-pdp-copy]', root).addEventListener('click', async () => {
      const ok = await copyText(singleMessage());
      showToast(ok ? 'Resumen del pedido copiado.' : 'No se pudo copiar el resumen.');
    });
  }

  function initProductPage() {
    const root = $('#product-root');
    if (!root) return;
    const id = new URLSearchParams(window.location.search).get('id');
    const p = id ? byId(id) : null;
    if (!p) { renderNotFound(root); return; }
    renderProduct(root, p);
  }

  /* 12b. TIENDA ------------------------------------------------------------
     tienda.html[?categoria=collares&precio=60-80&orden=precio-asc&q=luna]
     Los filtros trabajan sobre PRODUCTS y el estado se refleja en la URL
     (compartible y compatible con GitHub Pages: la página es siempre la misma). */
  const PRICE_BANDS = [
    { id: 'all', label: 'Todos los precios', test: () => true },
    { id: 'hasta-60', label: 'Hasta $60.000', test: (n) => n <= 60000 },
    { id: '60-80', label: '$60.000 – $80.000', test: (n) => n > 60000 && n <= 80000 },
    { id: '80-100', label: '$80.000 – $100.000', test: (n) => n > 80000 && n <= 100000 },
    { id: 'mas-100', label: 'Más de $100.000', test: (n) => n > 100000 },
  ];
  const SORTS = [
    { id: 'default', label: 'Destacados' },
    { id: 'precio-asc', label: 'Precio: menor a mayor' },
    { id: 'precio-desc', label: 'Precio: mayor a menor' },
  ];

  function initShop() {
    const root = $('#shop-root');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    const state = {
      cat: cat && Object.prototype.hasOwnProperty.call(CATEGORY_LABEL, cat) ? cat : 'todos',
      price: PRICE_BANDS.some((b) => b.id === params.get('precio')) ? params.get('precio') : 'all',
      sort: SORTS.some((o) => o.id === params.get('orden')) ? params.get('orden') : 'default',
      q: (params.get('q') || '').slice(0, 60),
    };

    root.innerHTML = `
      <header class="shop-head">
        <p class="eyebrow">Tienda</p>
        <h1 id="shop-title"></h1>
      </header>

      <div class="shop-filters">
        <div class="chips" role="group" aria-label="Categoría">
          ${['todos', ...Object.keys(CATEGORY_LABEL)].map((k) =>
            `<button class="chip" type="button" data-cat="${k}" aria-pressed="false">${k === 'todos' ? 'Todo' : CATEGORY_LABEL[k]}</button>`).join('')}
        </div>
        <div class="shop-controls">
          <div class="field">
            <label for="shop-q">Buscar por nombre</label>
            <input id="shop-q" type="search" placeholder="Ej. Luna" autocomplete="off" maxlength="60">
          </div>
          <div class="field">
            <label for="shop-price">Precio</label>
            <select id="shop-price">${PRICE_BANDS.map((b) => `<option value="${b.id}">${b.label}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label for="shop-sort">Ordenar por</label>
            <select id="shop-sort">${SORTS.map((o) => `<option value="${o.id}">${o.label}</option>`).join('')}</select>
          </div>
        </div>
        <p class="shop-count" id="shop-count" role="status" aria-live="polite"></p>
      </div>

      <ul class="product-grid shop-grid" id="shop-grid"></ul>

      <div class="shop-empty" id="shop-empty" hidden>
        <p>No encontramos piezas con esos filtros.</p>
        <button class="btn btn-line" type="button" id="shop-reset">Limpiar filtros</button>
      </div>`;

    const grid = $('#shop-grid', root);
    const empty = $('#shop-empty', root);
    const count = $('#shop-count', root);
    const title = $('#shop-title', root);
    const qInput = $('#shop-q', root);
    const priceSel = $('#shop-price', root);
    const sortSel = $('#shop-sort', root);
    const chips = $$('.chip', root);

    function syncURL() {
      const next = new URLSearchParams();
      if (state.cat !== 'todos') next.set('categoria', state.cat);
      if (state.price !== 'all') next.set('precio', state.price);
      if (state.sort !== 'default') next.set('orden', state.sort);
      if (state.q.trim()) next.set('q', state.q.trim());
      const qs = next.toString();
      try { history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : '')); } catch { /* p. ej. file:// */ }
    }

    function update() {
      const band = PRICE_BANDS.find((b) => b.id === state.price);
      const q = normalize(state.q.trim());
      let list = PRODUCTS.filter((p) =>
        (state.cat === 'todos' || p.category === state.cat) && band.test(p.price) && (!q || normalize(p.name).includes(q)));
      if (state.sort === 'precio-asc') list = [...list].sort((a, b) => a.price - b.price);
      if (state.sort === 'precio-desc') list = [...list].sort((a, b) => b.price - a.price);

      grid.innerHTML = list.map((p) => productCardHTML(p, { reveal: false })).join('');
      watchImages(grid);
      grid.hidden = list.length === 0;
      empty.hidden = list.length > 0;
      count.textContent = list.length === 1 ? '1 pieza' : `${list.length} piezas`;

      const heading = state.cat === 'todos' ? 'Toda la colección' : CATEGORY_LABEL[state.cat];
      title.textContent = heading;
      document.title = `${heading} — Tienda — ${STORE_NAME}`;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)));
      syncURL();
    }

    qInput.value = state.q;
    priceSel.value = state.price;
    sortSel.value = state.sort;

    chips.forEach((c) => c.addEventListener('click', () => { state.cat = c.dataset.cat; update(); }));
    qInput.addEventListener('input', () => { state.q = qInput.value; update(); });
    priceSel.addEventListener('change', () => { state.price = priceSel.value; update(); });
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; update(); });
    $('#shop-reset', root).addEventListener('click', () => {
      Object.assign(state, { cat: 'todos', price: 'all', sort: 'default', q: '' });
      qInput.value = ''; priceSel.value = 'all'; sortSel.value = 'default';
      update();
      qInput.focus();
    });

    update();
  }

  /* 13. REVELADO AL SCROLL ------------------------------------------------ */
  let revealObserver = null;
  function observeReveal(root = document) {
    const targets = $$('.reveal:not(.is-visible)', root);
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    targets.forEach((t) => revealObserver.observe(t));
  }

  /* 14. INICIO ------------------------------------------------------------ */
  function init() {
    renderFeatured();
    initProductPage();
    initShop();
    watchImages();
    initMobileMenu();
    initSearch();
    initCart();
    initContact();
    observeReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();