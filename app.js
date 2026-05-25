'use strict';

/* ============================================================
   CONFIG — Update EmailJS settings after signing up at emailjs.com
   ============================================================ */
const CONFIG = {
  chefEmail: 'school98072@gmail.com',

  emailjs: {
    enabled: true,
    publicKey: 'ASAdQQZsxJaXT41zK',
    serviceId: 'service_5trpflb',
    templateId: 'template_5mouirh',
  },

  storage: {
    customItems: 'pwa_ordersys_custom_v1',
    cart: 'pwa_ordersys_cart_v1',
  },

  // 免費申請 API Key：https://api.imgbb.com
  // 填入後，自定義菜品圖片會自動上傳並在郵件中可直接查看
  imgbb: {
    apiKey: 'f5075433be019a339b4895b983fb193c',
  },
};

/* ============================================================
   DEFAULT MENU
   ============================================================ */
const DEFAULT_MENU = [
  { id: 'm01', name: '宮保雞丁', emoji: '🍗', from: '#FF6B6B', to: '#FFE66D' },
  { id: 'm02', name: '麻婆豆腐', emoji: '🥘', from: '#FD79A8', to: '#E17055' },
  { id: 'm03', name: '蛋炒飯',   emoji: '🍳', from: '#FDCB6E', to: '#E17055' },
  { id: 'm04', name: '糖醋排骨', emoji: '🥩', from: '#6C5CE7', to: '#A29BFE' },
  { id: 'm05', name: '紅燒肉',   emoji: '🍖', from: '#E17055', to: '#D63031' },
  { id: 'm06', name: '清炒時蔬', emoji: '🥦', from: '#00B894', to: '#55EFC4' },
  { id: 'm07', name: '番茄炒蛋', emoji: '🍅', from: '#E17055', to: '#FDCB6E' },
  { id: 'm08', name: '水餃',     emoji: '🥟', from: '#0984E3', to: '#74B9FF' },
  { id: 'm09', name: '牛肉麵',   emoji: '🍜', from: '#E84393', to: '#E17055' },
  { id: 'm10', name: '炒米粉',   emoji: '🍝', from: '#F9CA24', to: '#F0932B' },
  { id: 'm11', name: '獅子頭',   emoji: '🍲', from: '#00CEC9', to: '#00B894' },
  { id: 'm12', name: '蔥油餅',   emoji: '🫓', from: '#A29BFE', to: '#6C5CE7' },
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  allItems: [],   // DEFAULT_MENU + custom items
  cart: [],       // { id, item, quantity, notes }
  editingCartId: null,  // cart entry ID currently being note-edited
  pendingCustomImage: null,
  pendingCustomImageUrl: null,   // imgbb hosted URL once resolved
  pendingCustomImageUpload: null, // Promise<string|null> while uploading
};

/* ============================================================
   IMAGE HOSTING (imgbb)
   ============================================================ */
function base64ToBlob(base64Data) {
  const [header, data] = base64Data.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(data);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function uploadToImgbb(base64Data) {
  if (!CONFIG.imgbb.apiKey) { console.warn('[imgbb] no API key'); return null; }
  try {
    const blob = base64ToBlob(base64Data);
    const form = new FormData();
    form.append('image', blob, 'dish.jpg');
    console.log('[imgbb] uploading, blob size:', blob.size);
    // Key must be in URL query param
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${CONFIG.imgbb.apiKey}`, {
      method: 'POST',
      body: form,
    });
    const json = await res.json();
    console.log('[imgbb] response:', JSON.stringify(json).substring(0, 300));
    return json.success ? json.data.display_url : null;
  } catch (err) {
    console.error('[imgbb] upload error:', err);
    return null;
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);

function esc(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function cartTotal() {
  return state.cart.reduce((s, c) => s + c.quantity, 0);
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(CONFIG.storage.customItems);
    const custom = raw ? JSON.parse(raw) : [];
    state.allItems = [...DEFAULT_MENU, ...custom];
  } catch {
    state.allItems = [...DEFAULT_MENU];
  }

  try {
    const raw = localStorage.getItem(CONFIG.storage.cart);
    state.cart = raw ? JSON.parse(raw) : [];
    // Re-hydrate item references (in case menu changed)
    state.cart = state.cart.filter(entry => {
      const item = state.allItems.find(m => m.id === entry.item.id);
      if (item) { entry.item = item; return true; }
      return false;
    });
  } catch {
    state.cart = [];
  }
}

function saveCustomItems() {
  const custom = state.allItems.filter(i => i.isCustom);
  localStorage.setItem(CONFIG.storage.customItems, JSON.stringify(custom));
}

function saveCart() {
  localStorage.setItem(CONFIG.storage.cart, JSON.stringify(state.cart));
}

/* ============================================================
   MENU RENDERING
   ============================================================ */
function renderMenu() {
  const grid = $('menuGrid');
  grid.innerHTML = '';
  state.allItems.forEach(item => {
    grid.appendChild(createCard(item));
  });
}

function createCard(item) {
  const entry = state.cart.find(c => c.item.id === item.id);
  const qty = entry ? entry.quantity : 0;

  const card = document.createElement('article');
  card.className = `menu-card${qty > 0 ? ' in-cart' : ''}`;
  card.dataset.id = item.id;

  const bgStyle = item.imageData
    ? `background-image:url('${item.imageData}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from},${item.to})`;

  card.innerHTML = `
    <div class="card-bg" style="${bgStyle}">
      ${!item.imageData ? `<span class="card-emoji" aria-hidden="true">${item.emoji || '🍽️'}</span>` : ''}
      ${qty > 0 ? `<div class="card-qty-badge" aria-label="已加入 ${qty} 份">${qty}</div>` : ''}
      ${item.isCustom ? `<div class="card-custom-badge">自定義</div>` : ''}
    </div>
    <div class="card-info">
      <span class="card-name">${esc(item.name)}</span>
      <button class="card-add-btn" aria-label="加入點餐車">
        ${qty > 0
          ? `<span class="card-in-qty" aria-hidden="true">${qty}</span>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
        }
      </button>
    </div>
  `;

  card.addEventListener('click', () => handleCardClick(item));
  return card;
}

function refreshCard(itemId) {
  const old = document.querySelector(`.menu-card[data-id="${itemId}"]`);
  if (!old) return;
  const item = state.allItems.find(i => i.id === itemId);
  if (!item) return;
  const fresh = createCard(item);
  fresh.classList.add('pop-anim');
  old.replaceWith(fresh);
  setTimeout(() => fresh.classList.remove('pop-anim'), 400);
}

/* ============================================================
   CART RENDERING
   ============================================================ */
function renderCart() {
  const body = $('drawerBody');
  const footer = $('drawerFooter');
  const total = cartTotal();

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon" aria-hidden="true">🛒</div>
        <p class="empty-title">點餐車是空的</p>
        <p class="empty-sub">快去選選看吧！</p>
      </div>`;
    footer.hidden = true;
  } else {
    body.innerHTML = state.cart.map(e => buildCartItemHTML(e)).join('');
    footer.hidden = false;
    $('totalCount').textContent = total;
    bindCartItemEvents();
  }

  updateBadges(total);
}

function buildCartItemHTML(entry) {
  const { id, item, quantity, notes } = entry;

  const thumbStyle = item.imageData
    ? `background-image:url('${item.imageData}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from || '#FF6B35'},${item.to || '#FDCB6E'})`;

  return `
    <div class="cart-item" id="ci-${id}">
      <div class="ci-thumb" style="${thumbStyle}">
        ${!item.imageData ? `<span class="ci-emoji" aria-hidden="true">${item.emoji || '🍽️'}</span>` : ''}
      </div>
      <div class="ci-body">
        <div class="ci-top">
          <span class="ci-name">${esc(item.name)}</span>
          <button class="ci-remove-btn" data-id="${id}" aria-label="移除 ${esc(item.name)}">✕</button>
        </div>
        ${notes ? `<p class="ci-note">📝 ${esc(notes)}</p>` : ''}
        <div class="ci-actions">
          <button class="ci-note-btn" data-id="${id}">
            ${notes ? '✏️ 編輯備註' : '📝 加備註'}
          </button>
          <div class="ci-qty-row" role="group" aria-label="數量">
            <button class="ci-qty-btn ci-minus" data-id="${id}" aria-label="減少數量">−</button>
            <span class="ci-qty-num" aria-live="polite">${quantity}</span>
            <button class="ci-qty-btn ci-plus" data-id="${id}" aria-label="增加數量">+</button>
          </div>
        </div>
      </div>
    </div>`;
}

function bindCartItemEvents() {
  $('drawerBody').querySelectorAll('.ci-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
  $('drawerBody').querySelectorAll('.ci-minus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
  });
  $('drawerBody').querySelectorAll('.ci-plus').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
  });
  $('drawerBody').querySelectorAll('.ci-note-btn').forEach(btn => {
    btn.addEventListener('click', () => openNoteModal(btn.dataset.id));
  });
}

function updateBadges(total) {
  const headerBadge = $('cartHeaderBadge');
  const fab = $('cartFab');
  const fabBadge = $('fabBadge');

  if (total > 0) {
    headerBadge.textContent = total;
    headerBadge.hidden = false;
    headerBadge.classList.add('pop');
    setTimeout(() => headerBadge.classList.remove('pop'), 350);
    fab.hidden = false;
    fabBadge.textContent = total;
  } else {
    headerBadge.hidden = true;
    fab.hidden = true;
  }
}

/* ============================================================
   CART OPERATIONS
   ============================================================ */
function handleCardClick(item) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (existing) {
    existing.quantity++;
    saveCart();
    refreshCard(item.id);
    renderCart();
    showToast(`${item.name} +1 ✓`, 'success');
  } else {
    addToCart(item, '');
    showToast(`已加入「${item.name}」`, 'success');
  }
}

function addToCart(item, notes) {
  state.cart.push({ id: uid(), item, quantity: 1, notes });
  saveCart();
  refreshCard(item.id);
  renderCart();
}

function removeFromCart(cartId) {
  const entry = state.cart.find(c => c.id === cartId);
  state.cart = state.cart.filter(c => c.id !== cartId);
  saveCart();
  if (entry) refreshCard(entry.item.id);
  renderCart();
}

function updateQuantity(cartId, delta) {
  const entry = state.cart.find(c => c.id === cartId);
  if (!entry) return;
  entry.quantity = Math.max(0, entry.quantity + delta);
  if (entry.quantity === 0) {
    removeFromCart(cartId);
    return;
  }
  saveCart();
  renderCart();
  refreshCard(entry.item.id);
}

function clearCart() {
  const affectedIds = state.cart.map(c => c.item.id);
  state.cart = [];
  saveCart();
  affectedIds.forEach(id => refreshCard(id));
  renderCart();
}

/* ============================================================
   DRAWER
   ============================================================ */
function openDrawer() {
  renderCart();
  $('cartDrawer').classList.add('open');
  $('overlay').classList.add('active');
  $('cartDrawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  $('cartDrawer').classList.remove('open');
  $('overlay').classList.remove('active');
  $('cartDrawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ============================================================
   CUSTOM ITEM MODAL
   ============================================================ */
function openCustomModal() {
  // Reset form
  $('customName').value = '';
  $('customNote').value = '';
  $('imgPreview').hidden = true;
  $('uploadHint').hidden = false;
  $('imgInput').value = '';
  $('uploadZone').classList.remove('dragover');
  state.pendingCustomImage = null;
  state.pendingCustomImageUrl = null;
  state.pendingCustomImageUpload = null;

  $('customModal').classList.add('open');
  $('overlay').classList.add('active');
  $('customModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('customName').focus(), 400);
}

function closeCustomModal() {
  $('customModal').classList.remove('open');
  $('overlay').classList.remove('active');
  $('customModal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleImageSelect(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 480;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      state.pendingCustomImage = canvas.toDataURL('image/jpeg', 0.78);
      $('imgPreview').src = state.pendingCustomImage;
      $('imgPreview').hidden = false;
      $('uploadHint').hidden = true;
      // Start imgbb upload; store Promise so addCustomItem can await it
      state.pendingCustomImageUrl = null;
      state.pendingCustomImageUpload = uploadToImgbb(state.pendingCustomImage).then(url => {
        state.pendingCustomImageUrl = url;
        console.log('[imgbb] upload result:', url);
        return url;
      });
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

async function addCustomItem() {
  const name = $('customName').value.trim();
  if (!name) {
    showToast('請輸入菜品名稱', 'error');
    $('customName').focus();
    return;
  }

  // If imgbb upload is still running, wait for it (Promise resolves with URL or null)
  if (state.pendingCustomImageUpload) {
    showToast('圖片上傳中，請稍候…', 'info');
    await state.pendingCustomImageUpload;
  }

  const CUSTOM_GRADIENTS = [
    ['#6C5CE7', '#A29BFE'],
    ['#00CEC9', '#81ECEC'],
    ['#E84393', '#E17055'],
    ['#0984E3', '#74B9FF'],
    ['#00B894', '#55EFC4'],
  ];
  const g = CUSTOM_GRADIENTS[state.allItems.filter(i => i.isCustom).length % CUSTOM_GRADIENTS.length];

  const item = {
    id: 'custom-' + uid(),
    name,
    emoji: '🍽️',
    from: g[0],
    to: g[1],
    imageData: state.pendingCustomImage || null,
    imageUrl: state.pendingCustomImageUrl || null,
    isCustom: true,
  };

  const notes = $('customNote').value.trim();
  state.allItems.push(item);
  saveCustomItems();

  // Re-render menu then add to cart
  renderMenu();
  addToCart(item, notes);

  closeCustomModal();
  showToast(`已加入「${name}」到點餐車`, 'success');
}

/* ============================================================
   NOTE MODAL
   ============================================================ */
function openNoteModal(cartId) {
  const entry = state.cart.find(c => c.id === cartId);
  if (!entry) return;

  state.editingCartId = cartId;
  $('noteModalTitle').textContent = `備註 — ${entry.item.name}`;
  $('noteInput').value = entry.notes || '';

  $('noteModal').classList.add('open');
  $('overlay').classList.add('active');
  $('noteModal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('noteInput').focus(), 400);
}

function closeNoteModal() {
  $('noteModal').classList.remove('open');
  $('overlay').classList.remove('active');
  $('noteModal').setAttribute('aria-hidden', 'true');
  state.editingCartId = null;
  document.body.style.overflow = '';
}

function saveNote() {
  if (!state.editingCartId) return;
  const entry = state.cart.find(c => c.id === state.editingCartId);
  if (entry) {
    entry.notes = $('noteInput').value.trim();
    saveCart();
    renderCart();
  }
  closeNoteModal();
}

/* ============================================================
   ORDER CONFIRM MODAL
   ============================================================ */
function openConfirmModal() {
  const total = cartTotal();
  $('confirmSub').textContent = `共 ${total} 道菜，訂單將傳送給廚師`;
  $('confirmModal').classList.add('open');
  $('overlay').classList.add('active');
  $('confirmModal').setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
  $('confirmModal').classList.remove('open');
  closeDrawer();
  $('confirmModal').setAttribute('aria-hidden', 'true');
}

/* ============================================================
   ORDER PLACEMENT
   ============================================================ */
async function placeOrder() {
  if (state.cart.length === 0) {
    showToast('點餐車是空的！', 'error');
    return;
  }

  closeConfirmModal();

  const btn = $('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> 傳送中...`;

  const now = new Date();
  const timestamp = now.toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // For items that have imageData but no imageUrl (e.g. added before imgbb upload completed),
  // upload now so the email can include the image.
  await Promise.all(state.cart.map(async e => {
    if (e.item.imageData && !e.item.imageUrl) {
      console.log('[order] uploading missing imageUrl for:', e.item.name);
      const url = await uploadToImgbb(e.item.imageData);
      if (url) {
        e.item.imageUrl = url;
        // Persist back to allItems so localStorage stays in sync
        const stored = state.allItems.find(i => i.id === e.item.id);
        if (stored) stored.imageUrl = url;
        saveCustomItems();
      }
      console.log('[order] imageUrl result:', e.item.name, url);
    }
  }));

  const htmlLines = state.cart.map(e => {
    let html = `<p style="margin:6px 0">• <strong>${esc(e.item.name)}</strong> × ${e.quantity}`;
    if (e.notes) html += `（備註：${esc(e.notes)}）`;
    html += '</p>';
    if (e.item.imageUrl) {
      html += `<p style="margin:4px 0 12px 0"><img src="${e.item.imageUrl}" alt="${esc(e.item.name)}" style="max-width:200px;border-radius:8px;display:block"></p>`;
    }
    return html;
  });

  const orderBody = `
<p><strong>【訂單時間】</strong>${esc(timestamp)}</p>
<p><strong>【點餐內容】</strong></p>
${htmlLines.join('')}
<p>共 ${cartTotal()} 道菜</p>
`.trim();

  try {
    if (CONFIG.emailjs.enabled) {
      await sendViaEmailJS(timestamp, orderBody);
    } else {
      sendViaMailto(timestamp, orderBody);
    }

    clearCart();
    closeDrawer();
    showToast('🎉 下單成功！廚師已收到訂單', 'success');
  } catch (err) {
    console.error('[Order] Failed:', err);
    showToast('傳送失敗，請重試', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      立即下單`;
  }
}

async function sendViaEmailJS(timestamp, orderBody) {
  // Initialize EmailJS with public key
  emailjs.init({ publicKey: CONFIG.emailjs.publicKey });

  await emailjs.send(
    CONFIG.emailjs.serviceId,
    CONFIG.emailjs.templateId,
    {
      to_email:      CONFIG.chefEmail,
      order_time:    timestamp,
      order_content: orderBody,
    }
  );
}

function sendViaMailto(timestamp, orderBody) {
  const subject = encodeURIComponent(`【快點餐】新訂單 - ${timestamp}`);
  const body = encodeURIComponent(orderBody);
  window.open(`mailto:${CONFIG.chefEmail}?subject=${subject}&body=${body}`, '_blank');
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type = 'info') {
  const container = $('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2400);
}

/* ============================================================
   DRAG-TO-CLOSE DRAWER
   ============================================================ */
function initDrawerSwipe() {
  const drawer = $('cartDrawer');
  let startY = 0;
  let dragging = false;

  drawer.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    dragging = true;
  }, { passive: true });

  drawer.addEventListener('touchend', e => {
    if (!dragging) return;
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 80) closeDrawer();
    dragging = false;
  }, { passive: true });
}

/* ============================================================
   PWA INSTALL PROMPT
   ============================================================ */
function initInstallPrompt() {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    $('installBar').hidden = false;
  });

  $('installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('installBar').hidden = true;
    if (outcome === 'accepted') showToast('快點餐已安裝 🎉', 'success');
  });

  $('installDismiss').addEventListener('click', () => {
    $('installBar').hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    $('installBar').hidden = true;
    showToast('快點餐已加入主畫面 ✓', 'success');
  });
}

/* ============================================================
   SERVICE WORKER
   ============================================================ */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js', { scope: './' })
    .then(reg => {
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showToast('應用程式已更新，請重新整理', 'info');
          }
        });
      });
    })
    .catch(err => console.warn('[SW] Registration failed:', err));
}

/* ============================================================
   EVENT BINDINGS
   ============================================================ */
function bindEvents() {
  // Cart open
  $('cartBtn').addEventListener('click', openDrawer);
  $('cartFab').addEventListener('click', openDrawer);

  // Cart close
  $('closeDrawerBtn').addEventListener('click', closeDrawer);

  // Overlay (closes whatever is open)
  $('overlay').addEventListener('click', () => {
    if ($('cartDrawer').classList.contains('open'))    closeDrawer();
    if ($('customModal').classList.contains('open'))   closeCustomModal();
    if ($('noteModal').classList.contains('open'))     closeNoteModal();
    if ($('confirmModal').classList.contains('open'))  closeConfirmModal();
  });

  // Custom item modal
  $('openCustomBtn').addEventListener('click', openCustomModal);
  $('closeCustomBtn').addEventListener('click', closeCustomModal);

  // Image upload
  const zone = $('uploadZone');
  $('imgInput').addEventListener('change', e => handleImageSelect(e.target.files[0]));
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    handleImageSelect(e.dataTransfer.files[0]);
  });

  // Add custom item
  $('addCustomItemBtn').addEventListener('click', addCustomItem);
  $('customName').addEventListener('keydown', e => {
    if (e.key === 'Enter') addCustomItem();
  });

  // Note modal
  $('closeNoteBtn').addEventListener('click', closeNoteModal);
  $('confirmNoteBtn').addEventListener('click', saveNote);
  $('noteInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); }
  });

  // Order
  $('placeOrderBtn').addEventListener('click', openConfirmModal);
  $('cancelOrderBtn').addEventListener('click', closeConfirmModal);
  $('confirmOrderBtn').addEventListener('click', placeOrder);

  // Keyboard: close on Escape
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('cartDrawer').classList.contains('open'))    closeDrawer();
    else if ($('customModal').classList.contains('open'))   closeCustomModal();
    else if ($('noteModal').classList.contains('open'))     closeNoteModal();
    else if ($('confirmModal').classList.contains('open'))  closeConfirmModal();
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  loadFromStorage();
  renderMenu();
  renderCart();
  bindEvents();
  initDrawerSwipe();
  initInstallPrompt();
  registerServiceWorker();

  // Validate EmailJS config on startup (dev helper)
  if (CONFIG.emailjs.enabled && CONFIG.emailjs.publicKey === 'YOUR_PUBLIC_KEY') {
    console.warn('[快點餐] EmailJS enabled but keys not configured. Falling back to mailto.');
    CONFIG.emailjs.enabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
