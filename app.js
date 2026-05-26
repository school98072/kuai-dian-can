'use strict';

/* ============================================================
   CONFIG
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
    customItems:  'pwa_ordersys_custom_v1',
    cart:         'pwa_ordersys_cart_v1',
    dishImages:   'pwa_ordersys_dish_images_v2',  // { itemId: base64 }
    bannerImage:  'pwa_ordersys_banner_v1',
  },
  imgbb: {
    apiKey: 'f5075433be019a339b4895b983fb193c',
  },
};

/* ============================================================
   CATEGORIES
   ============================================================ */
const CATEGORIES = [
  { id: 'dish',   name: '菜品', emoji: '🍽️' },
  { id: 'soup',   name: '汤羹', emoji: '🍲' },
  { id: 'staple', name: '主食', emoji: '🍚' },
  { id: 'snack',  name: '小吃', emoji: '🥟' },
  { id: 'baking', name: '烘焙', emoji: '🥐' },
  { id: 'sauce',  name: '酱料', emoji: '🥣' },
  { id: 'custom', name: '自定义', emoji: '✨' },
];

/* ============================================================
   DEFAULT MENU
   ============================================================ */
const DEFAULT_MENU = [
  // 菜品
  { id: 'm01', name: '土豆烧鸡块', desc: '家常版，软糯入味',     category: 'dish',   from: '#E8975A', to: '#C4621D', sales: 38 },
  { id: 'm02', name: '番茄炒鸡蛋', desc: '经典家常，酸甜开胃',   category: 'dish',   from: '#FF6B6B', to: '#EE9B00', sales: 52 },
  { id: 'm03', name: '宫保鸡丁',   desc: '麻辣鲜香，下饭神器',   category: 'dish',   from: '#E63946', to: '#F4A261', sales: 45 },
  { id: 'm04', name: '鱼香肉丝',   desc: '四川家常，浓郁下饭',   category: 'dish',   from: '#9B59B6', to: '#E63946', sales: 29 },
  { id: 'm05', name: '红烧肉',     desc: '肥而不腻，软糯鲜香',   category: 'dish',   from: '#7B2D00', to: '#C1440E', sales: 61 },
  { id: 'm06', name: '清炒时蔬',   desc: '新鲜爽口，健康美味',   category: 'dish',   from: '#52B788', to: '#1B4332', sales: 24 },
  // 汤羹
  { id: 's01', name: '番茄鸡蛋汤', desc: '鲜美营养，暖胃首选',   category: 'soup',   from: '#FF6B6B', to: '#FFB347', sales: 33 },
  { id: 's02', name: '紫菜蛋花汤', desc: '清淡鲜美，营养丰富',   category: 'soup',   from: '#7209B7', to: '#F72585', sales: 18 },
  { id: 's03', name: '冬瓜排骨汤', desc: '清甜解腻，滋补养生',   category: 'soup',   from: '#4CC9F0', to: '#4361EE', sales: 22 },
  // 主食
  { id: 'r01', name: '扬州炒饭',   desc: '粒粒分明，色香味俱全', category: 'staple', from: '#F9C74F', to: '#F8961E', sales: 47 },
  { id: 'r02', name: '葱油拌面',   desc: '简单美味，面条劲道',   category: 'staple', from: '#A7795F', to: '#6B4226', sales: 35 },
  { id: 'r03', name: '番茄鸡蛋面', desc: '酸甜开胃，暖心暖胃',   category: 'staple', from: '#FF6B6B', to: '#F9C74F', sales: 41 },
  // 小吃
  { id: 'x01', name: '锅贴',       desc: '外酥里嫩，汁水丰盈',   category: 'snack',  from: '#C19A6B', to: '#8B5E3C', sales: 56 },
  { id: 'x02', name: '春卷',       desc: '金黄酥脆，馅料丰富',   category: 'snack',  from: '#95D5B2', to: '#52B788', sales: 31 },
  { id: 'x03', name: '香酥芝麻饼', desc: '香脆可口，芝麻飘香',   category: 'snack',  from: '#DDA15E', to: '#BC6C25', sales: 27 },
  // 烘焙
  { id: 'b01', name: '红豆吐司',   desc: '松软香甜，红豆馅料',   category: 'baking', from: '#E63946', to: '#FFB347', sales: 19 },
  { id: 'b02', name: '蛋黄酥',     desc: '层层酥皮，蛋黄流心',   category: 'baking', from: '#F9C74F', to: '#F3722C', sales: 43 },
  // 酱料
  { id: 'c01', name: '自制辣椒酱', desc: '香辣开胃，配啥都好',   category: 'sauce',  from: '#E63946', to: '#9D0208', sales: 15 },
  { id: 'c02', name: '葱油酱',     desc: '鲜香浓郁，拌面一绝',   category: 'sauce',  from: '#52B788', to: '#2D6A4F', sales: 12 },
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  allItems: [],
  cart: [],
  editingCartId: null,
  pendingCustomImage: null,
  pendingCustomImageUrl: null,
  pendingCustomImageUpload: null,
  dishImages: {},       // { itemId: base64 } — user-uploaded thumbnails
  dishImageUrls: {},    // { itemId: string } — imgbb URLs for email
  activeCategory: null,
  adminMode: false,
  searchQuery: '',
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
  if (!CONFIG.imgbb.apiKey) return null;
  try {
    const blob = base64ToBlob(base64Data);
    const form = new FormData();
    form.append('image', blob, 'dish.jpg');
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${CONFIG.imgbb.apiKey}`, {
      method: 'POST', body: form,
    });
    const json = await res.json();
    return json.success ? json.data.display_url : null;
  } catch { return null; }
}

/* ============================================================
   HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);

function escHtml(str) {
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

function getItemImage(item) {
  // priority: user-uploaded (in dishImages) > item.imageData
  return state.dishImages[item.id] || item.imageData || null;
}

function getItemImageUrl(item) {
  return state.dishImageUrls[item.id] || item.imageUrl || null;
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadFromStorage() {
  // Custom items
  try {
    const raw = localStorage.getItem(CONFIG.storage.customItems);
    const custom = raw ? JSON.parse(raw) : [];
    state.allItems = [...DEFAULT_MENU, ...custom];
  } catch {
    state.allItems = [...DEFAULT_MENU];
  }

  // Cart
  try {
    const raw = localStorage.getItem(CONFIG.storage.cart);
    state.cart = raw ? JSON.parse(raw) : [];
    state.cart = state.cart.filter(entry => {
      const item = state.allItems.find(m => m.id === entry.item.id);
      if (item) { entry.item = item; return true; }
      return false;
    });
  } catch { state.cart = []; }

  // Dish images
  try {
    const raw = localStorage.getItem(CONFIG.storage.dishImages);
    state.dishImages = raw ? JSON.parse(raw) : {};
  } catch { state.dishImages = {}; }

  // Banner
  try {
    const banner = localStorage.getItem(CONFIG.storage.bannerImage);
    if (banner) applyBannerImage(banner);
  } catch {}
}

function saveCustomItems() {
  const custom = state.allItems.filter(i => i.isCustom);
  localStorage.setItem(CONFIG.storage.customItems, JSON.stringify(custom));
}

function saveCart() {
  localStorage.setItem(CONFIG.storage.cart, JSON.stringify(state.cart));
}

function saveDishImages() {
  localStorage.setItem(CONFIG.storage.dishImages, JSON.stringify(state.dishImages));
}

/* ============================================================
   SIDEBAR RENDERING
   ============================================================ */
function renderSidebar() {
  const sidebar = $('catSidebar');
  sidebar.innerHTML = '';

  // Only show categories that have items
  const usedCats = CATEGORIES.filter(cat =>
    state.allItems.some(item => {
      const itemCat = item.category || (item.isCustom ? 'custom' : 'dish');
      return itemCat === cat.id;
    })
  );

  usedCats.forEach((cat, i) => {
    const el = document.createElement('div');
    el.className = `cat-item${state.activeCategory === cat.id || (!state.activeCategory && i === 0) ? ' active' : ''}`;
    el.dataset.cat = cat.id;
    el.innerHTML = `<span class="cat-emoji">${cat.emoji}</span>${cat.name}`;
    el.addEventListener('click', () => {
      const section = $(`section-${cat.id}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveCat(cat.id);
      }
    });
    sidebar.appendChild(el);
  });
}

function setActiveCat(catId) {
  state.activeCategory = catId;
  document.querySelectorAll('.cat-item').forEach(el => {
    el.classList.toggle('active', el.dataset.cat === catId);
  });
  // Scroll sidebar item into view
  const activeEl = document.querySelector(`.cat-item[data-cat="${catId}"]`);
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
}

/* ============================================================
   MENU RENDERING
   ============================================================ */
function renderMenu() {
  const dishMain = $('dishMain');
  const query = state.searchQuery.trim().toLowerCase();

  // Group items by category
  const groups = {};
  CATEGORIES.forEach(cat => { groups[cat.id] = []; });

  state.allItems.forEach(item => {
    if (query && !item.name.toLowerCase().includes(query) && !(item.desc || '').toLowerCase().includes(query)) return;
    const catId = item.category || (item.isCustom ? 'custom' : 'dish');
    if (!groups[catId]) groups[catId] = [];
    groups[catId].push(item);
  });

  dishMain.innerHTML = '';
  let firstCat = null;

  CATEGORIES.forEach(cat => {
    const items = groups[cat.id];
    if (!items || items.length === 0) return;
    if (!firstCat) firstCat = cat.id;

    const section = document.createElement('section');
    section.className = 'dish-section';
    section.id = `section-${cat.id}`;

    const label = document.createElement('h2');
    label.className = 'section-label';
    label.textContent = cat.name;
    section.appendChild(label);

    items.forEach(item => section.appendChild(createDishCard(item)));
    dishMain.appendChild(section);
  });

  if (!state.activeCategory && firstCat) state.activeCategory = firstCat;

  renderSidebar();
  initCategoryObserver();
}

function createDishCard(item) {
  const entry = state.cart.find(c => c.item.id === item.id);
  const qty = entry ? entry.quantity : 0;
  const imageData = getItemImage(item);

  const card = document.createElement('div');
  card.className = 'dish-card pop-anim';
  card.dataset.id = item.id;

  const thumbStyle = imageData
    ? `background-image:url('${imageData}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from || '#FF6B35'},${item.to || '#FDCB6E'})`;

  const editOverlay = state.adminMode
    ? `<label class="thumb-edit-overlay" title="点击更换图片">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <span style="font-size:10px;margin-top:2px">换图片</span>
        <input type="file" accept="image/*" class="dish-img-input" data-id="${item.id}" style="display:none">
      </label>` : '';

  const deleteBtn = state.adminMode && item.isCustom
    ? `<button class="dish-delete-btn" data-id="${item.id}" title="删除菜品" aria-label="删除 ${escHtml(item.name)}">✕</button>` : '';

  card.innerHTML = `
    <div class="dish-thumb" style="${thumbStyle}">
      ${!imageData ? `<span class="dish-thumb-emoji">${item.emoji || '🍽️'}</span>` : ''}
      ${editOverlay}
    </div>
    <div class="dish-info">
      <div class="dish-name-row">
        <span class="dish-name">${escHtml(item.name)}</span>
        ${item.isCustom ? '<span class="dish-custom-tag">自定义</span>' : ''}
      </div>
      ${item.desc ? `<p class="dish-desc">${escHtml(item.desc)}</p>` : ''}
      <div class="dish-footer">
        <span class="dish-sales">月销 ${item.sales || 1}</span>
        <div class="dish-qty-ctrl">
          ${qty > 0 ? `<button class="qty-btn minus" data-id="${item.id}" aria-label="减少数量">−</button>
                       <span class="qty-num" aria-live="polite">${qty}</span>` : ''}
          <button class="qty-btn plus${qty === 0 ? ' solo' : ''}" data-id="${item.id}" aria-label="加入购物车">+</button>
        </div>
      </div>
    </div>
    ${deleteBtn}
  `;

  // Bind qty buttons
  card.querySelector('.plus').addEventListener('click', e => {
    e.stopPropagation();
    if (state.adminMode) return;
    handleAddDish(item);
  });
  const minusBtn = card.querySelector('.minus');
  if (minusBtn) minusBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (state.adminMode) return;
    handleRemoveDish(item);
  });

  // Admin: image replace
  const imgInput = card.querySelector('.dish-img-input');
  if (imgInput) imgInput.addEventListener('change', e => handleDishImageReplace(item.id, e.target.files[0]));

  // Admin: delete custom
  const delBtn = card.querySelector('.dish-delete-btn');
  if (delBtn) delBtn.addEventListener('click', e => {
    e.stopPropagation();
    deleteCustomItem(item.id);
  });

  return card;
}

function refreshDish(itemId) {
  const old = document.querySelector(`.dish-card[data-id="${itemId}"]`);
  if (!old) return;
  const item = state.allItems.find(i => i.id === itemId);
  if (!item) return;
  const fresh = createDishCard(item);
  old.replaceWith(fresh);
}

/* ============================================================
   CATEGORY OBSERVER
   ============================================================ */
function initCategoryObserver() {
  if (window._catObserver) window._catObserver.disconnect();

  window._catObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const catId = entry.target.id.replace('section-', '');
        setActiveCat(catId);
      }
    });
  }, { root: $('dishMain'), rootMargin: '-5% 0px -75% 0px' });

  document.querySelectorAll('.dish-section').forEach(s => window._catObserver.observe(s));
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
        <div class="empty-icon">🛒</div>
        <p class="empty-title">购物车是空的</p>
        <p class="empty-sub">快去选选看吧！</p>
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
  const imageData = getItemImage(item);
  const thumbStyle = imageData
    ? `background-image:url('${imageData}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from || '#FF6B35'},${item.to || '#FDCB6E'})`;

  return `
    <div class="cart-item" id="ci-${id}">
      <div class="ci-thumb" style="${thumbStyle}">
        ${!imageData ? `<span class="ci-emoji">${item.emoji || '🍽️'}</span>` : ''}
      </div>
      <div class="ci-body">
        <div class="ci-top">
          <span class="ci-name">${escHtml(item.name)}</span>
          <button class="ci-remove-btn" data-id="${id}" aria-label="移除 ${escHtml(item.name)}">✕</button>
        </div>
        ${notes ? `<p class="ci-note">📝 ${escHtml(notes)}</p>` : ''}
        <div class="ci-actions">
          <button class="ci-note-btn" data-id="${id}">${notes ? '✏️ 编辑备注' : '📝 加备注'}</button>
          <div class="ci-qty-row" role="group">
            <button class="ci-qty-btn ci-minus" data-id="${id}" aria-label="减少">−</button>
            <span class="ci-qty-num" aria-live="polite">${quantity}</span>
            <button class="ci-qty-btn ci-plus" data-id="${id}" aria-label="增加">+</button>
          </div>
        </div>
      </div>
    </div>`;
}

function bindCartItemEvents() {
  $('drawerBody').querySelectorAll('.ci-remove-btn').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.id)));
  $('drawerBody').querySelectorAll('.ci-minus').forEach(b => b.addEventListener('click', () => updateQuantity(b.dataset.id, -1)));
  $('drawerBody').querySelectorAll('.ci-plus').forEach(b => b.addEventListener('click', () => updateQuantity(b.dataset.id, 1)));
  $('drawerBody').querySelectorAll('.ci-note-btn').forEach(b => b.addEventListener('click', () => openNoteModal(b.dataset.id)));
}

function updateBadges(total) {
  const hBadge = $('cartHeaderBadge');
  const navBadge = $('navBadge');
  if (total > 0) {
    hBadge.textContent = total; hBadge.hidden = false;
    navBadge.textContent = total; navBadge.hidden = false;
  } else {
    hBadge.hidden = true;
    navBadge.hidden = true;
  }
}

/* ============================================================
   CART OPERATIONS
   ============================================================ */
function handleAddDish(item) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (existing) {
    existing.quantity++;
    saveCart();
  } else {
    state.cart.push({ id: uid(), item, quantity: 1, notes: '' });
    saveCart();
  }
  refreshDish(item.id);
  renderCart();
  showToast(`${item.name} +1 ✓`, 'success');
}

function handleRemoveDish(item) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (!existing) return;
  existing.quantity--;
  if (existing.quantity <= 0) {
    state.cart = state.cart.filter(c => c.item.id !== item.id);
  }
  saveCart();
  refreshDish(item.id);
  renderCart();
}

function addToCart(item, notes) {
  state.cart.push({ id: uid(), item, quantity: 1, notes });
  saveCart();
  refreshDish(item.id);
  renderCart();
}

function removeFromCart(cartId) {
  const entry = state.cart.find(c => c.id === cartId);
  state.cart = state.cart.filter(c => c.id !== cartId);
  saveCart();
  if (entry) refreshDish(entry.item.id);
  renderCart();
}

function updateQuantity(cartId, delta) {
  const entry = state.cart.find(c => c.id === cartId);
  if (!entry) return;
  entry.quantity = Math.max(0, entry.quantity + delta);
  if (entry.quantity === 0) { removeFromCart(cartId); return; }
  saveCart();
  renderCart();
  refreshDish(entry.item.id);
}

function clearCart() {
  const ids = state.cart.map(c => c.item.id);
  state.cart = [];
  saveCart();
  ids.forEach(id => refreshDish(id));
  renderCart();
}

/* ============================================================
   DISH IMAGE REPLACEMENT (admin mode)
   ============================================================ */
function handleDishImageReplace(itemId, file) {
  if (!file || !file.type.startsWith('image/')) return;
  showToast('图片上传中…', 'info');

  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 480;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
      else        { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const base64 = canvas.toDataURL('image/jpeg', 0.78);

      // Store locally
      state.dishImages[itemId] = base64;
      saveDishImages();
      refreshDish(itemId);
      showToast('图片已更新 ✓', 'success');

      // Upload to imgbb for email
      uploadToImgbb(base64).then(url => {
        if (url) state.dishImageUrls[itemId] = url;
      });
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   CUSTOM ITEM DELETION (admin mode)
   ============================================================ */
function deleteCustomItem(itemId) {
  // Remove from cart first
  const wasInCart = state.cart.some(c => c.item.id === itemId);
  state.cart = state.cart.filter(c => c.item.id !== itemId);
  if (wasInCart) saveCart();

  // Remove from allItems
  state.allItems = state.allItems.filter(i => i.id !== itemId);
  saveCustomItems();

  // Remove stored image
  delete state.dishImages[itemId];
  saveDishImages();

  renderMenu();
  renderCart();
  showToast('菜品已删除', 'info');
}

/* ============================================================
   ADMIN MODE
   ============================================================ */
function toggleAdminMode() {
  state.adminMode = !state.adminMode;
  const app = $('app');
  const btn = $('adminToggleBtn');
  const bannerBtn = $('bannerEditBtn');

  if (state.adminMode) {
    app.classList.add('admin-mode');
    btn.classList.add('active');
    bannerBtn.hidden = false;
    showToast('已进入管理模式', 'info');
  } else {
    app.classList.remove('admin-mode');
    btn.classList.remove('active');
    bannerBtn.hidden = true;
    showToast('已退出管理模式', 'info');
  }
  renderMenu(); // re-render to show/hide edit overlays
}

/* ============================================================
   BANNER IMAGE
   ============================================================ */
function applyBannerImage(base64) {
  $('headerBanner').style.backgroundImage = `url('${base64}')`;
  $('headerBanner').style.backgroundSize = 'cover';
  $('headerBanner').style.backgroundPosition = 'center';
}

function handleBannerSelect(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const base64 = evt.target.result;
    localStorage.setItem(CONFIG.storage.bannerImage, base64);
    applyBannerImage(base64);
    showToast('封面已更新 ✓', 'success');
  };
  reader.readAsDataURL(file);
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
  $('customName').value = '';
  $('customDesc').value = '';
  $('customNote').value = '';
  $('customCategory').value = 'dish';
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
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      state.pendingCustomImage = canvas.toDataURL('image/jpeg', 0.78);
      $('imgPreview').src = state.pendingCustomImage;
      $('imgPreview').hidden = false;
      $('uploadHint').hidden = true;
      state.pendingCustomImageUrl = null;
      state.pendingCustomImageUpload = uploadToImgbb(state.pendingCustomImage).then(url => {
        state.pendingCustomImageUrl = url;
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
    showToast('请输入菜品名称', 'error');
    $('customName').focus();
    return;
  }

  if (state.pendingCustomImageUpload) {
    showToast('图片上传中，请稍候…', 'info');
    await state.pendingCustomImageUpload;
  }

  const GRADIENTS = [
    ['#6C5CE7','#A29BFE'], ['#00CEC9','#81ECEC'],
    ['#E84393','#E17055'], ['#0984E3','#74B9FF'], ['#00B894','#55EFC4'],
  ];
  const g = GRADIENTS[state.allItems.filter(i => i.isCustom).length % GRADIENTS.length];
  const catId = $('customCategory').value || 'dish';
  const desc  = $('customDesc').value.trim();
  const notes = $('customNote').value.trim();

  const item = {
    id: 'custom-' + uid(),
    name,
    desc: desc || '',
    emoji: '🍽️',
    from: g[0], to: g[1],
    category: catId,
    sales: 0,
    imageData: state.pendingCustomImage || null,
    imageUrl:  state.pendingCustomImageUrl || null,
    isCustom: true,
  };

  state.allItems.push(item);
  saveCustomItems();
  renderMenu();
  addToCart(item, notes);
  closeCustomModal();
  showToast(`已加入「${name}」到菜单`, 'success');
}

/* ============================================================
   NOTE MODAL
   ============================================================ */
function openNoteModal(cartId) {
  const entry = state.cart.find(c => c.id === cartId);
  if (!entry) return;
  state.editingCartId = cartId;
  $('noteModalTitle').textContent = `备注 — ${entry.item.name}`;
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
  if (entry) { entry.notes = $('noteInput').value.trim(); saveCart(); renderCart(); }
  closeNoteModal();
}

/* ============================================================
   CONFIRM MODAL
   ============================================================ */
function openConfirmModal() {
  $('confirmSub').textContent = `共 ${cartTotal()} 道菜，订单将传送给厨师`;
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
  if (state.cart.length === 0) { showToast('购物车是空的！', 'error'); return; }
  closeConfirmModal();

  const btn = $('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> 传送中...`;

  const timestamp = new Date().toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  const e = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Upload any missing imgbb URLs at order time
  await Promise.all(state.cart.map(async entry => {
    const imgData = getItemImage(entry.item);
    const imgUrl  = getItemImageUrl(entry.item);
    if (imgData && !imgUrl) {
      const url = await uploadToImgbb(imgData);
      if (url) state.dishImageUrls[entry.item.id] = url;
    }
  }));

  const htmlLines = state.cart.map(entry => {
    let html = `<p style="margin:6px 0">• <strong>${e(entry.item.name)}</strong> × ${entry.quantity}`;
    if (entry.notes) html += `（备注：${e(entry.notes)}）`;
    html += '</p>';
    const imgUrl = getItemImageUrl(entry.item);
    if (imgUrl) {
      html += `<p style="margin:4px 0 12px 0"><img src="${imgUrl}" alt="${e(entry.item.name)}" style="max-width:200px;border-radius:8px;display:block"></p>`;
    }
    return html;
  });

  const orderBody = `
<p><strong>【订单时间】</strong>${e(timestamp)}</p>
<p><strong>【点餐内容】</strong></p>
${htmlLines.join('')}
<p>共 ${cartTotal()} 道菜</p>`.trim();

  try {
    if (CONFIG.emailjs.enabled) {
      emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        to_email: CONFIG.chefEmail, order_time: timestamp, order_content: orderBody,
      });
    } else {
      const sub = encodeURIComponent(`【快点餐】新订单 - ${timestamp}`);
      window.open(`mailto:${CONFIG.chefEmail}?subject=${sub}&body=${encodeURIComponent(orderBody)}`, '_blank');
    }
    clearCart();
    closeDrawer();
    showToast('🎉 下单成功！厨师已收到订单', 'success');
  } catch (err) {
    console.error('[Order] Failed:', err);
    showToast('传送失败，请重试', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      立即下单`;
  }
}

/* ============================================================
   SEARCH
   ============================================================ */
function toggleSearch() {
  const bar = $('searchBar');
  const isHidden = bar.hidden;
  bar.hidden = !isHidden;
  $('searchToggleBtn').classList.toggle('active', !isHidden ? false : true);
  if (!isHidden) {
    // closing search
    state.searchQuery = '';
    $('searchInput').value = '';
    renderMenu();
  } else {
    setTimeout(() => $('searchInput').focus(), 100);
  }
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
   SWIPE TO CLOSE DRAWER
   ============================================================ */
function initDrawerSwipe() {
  const drawer = $('cartDrawer');
  let startY = 0;
  drawer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  drawer.addEventListener('touchend',   e => {
    if (e.changedTouches[0].clientY - startY > 80) closeDrawer();
  }, { passive: true });
}

/* ============================================================
   PWA INSTALL PROMPT
   ============================================================ */
function initInstallPrompt() {
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferred = e; $('installBar').hidden = false;
  });
  $('installBtn').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null; $('installBar').hidden = true;
    if (outcome === 'accepted') showToast('快点餐已安装 🎉', 'success');
  });
  $('installDismiss').addEventListener('click', () => { $('installBar').hidden = true; });
  window.addEventListener('appinstalled', () => { $('installBar').hidden = true; });
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
            showToast('应用已更新，请重新整理', 'info');
          }
        });
      });
    }).catch(err => console.warn('[SW]', err));
}

/* ============================================================
   EVENT BINDINGS
   ============================================================ */
function bindEvents() {
  // Cart
  $('cartBtn').addEventListener('click', openDrawer);
  $('closeDrawerBtn').addEventListener('click', closeDrawer);

  // Bottom nav: order tab opens cart
  $('navOrderBtn').addEventListener('click', openDrawer);

  // Overlay: close all
  $('overlay').addEventListener('click', () => {
    if ($('cartDrawer').classList.contains('open'))   closeDrawer();
    if ($('customModal').classList.contains('open'))  closeCustomModal();
    if ($('noteModal').classList.contains('open'))    closeNoteModal();
    if ($('confirmModal').classList.contains('open')) closeConfirmModal();
  });

  // Admin
  $('adminToggleBtn').addEventListener('click', toggleAdminMode);

  // Banner image upload
  $('bannerInput').addEventListener('change', e => handleBannerSelect(e.target.files[0]));

  // Custom item modal
  $('openCustomBtn').addEventListener('click', openCustomModal);
  $('closeCustomBtn').addEventListener('click', closeCustomModal);
  $('addCustomItemBtn').addEventListener('click', addCustomItem);
  $('customName').addEventListener('keydown', e => { if (e.key === 'Enter') addCustomItem(); });

  // Image upload in custom modal
  const zone = $('uploadZone');
  $('imgInput').addEventListener('change', e => handleImageSelect(e.target.files[0]));
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    handleImageSelect(e.dataTransfer.files[0]);
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

  // Search
  $('searchToggleBtn').addEventListener('click', toggleSearch);
  $('searchInput').addEventListener('input', e => {
    state.searchQuery = e.target.value;
    renderMenu();
  });
  $('searchClear').addEventListener('click', () => {
    $('searchInput').value = '';
    state.searchQuery = '';
    renderMenu();
    $('searchInput').focus();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('cartDrawer').classList.contains('open'))   closeDrawer();
    else if ($('customModal').classList.contains('open'))  closeCustomModal();
    else if ($('noteModal').classList.contains('open'))    closeNoteModal();
    else if ($('confirmModal').classList.contains('open')) closeConfirmModal();
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

  if (CONFIG.emailjs.enabled && CONFIG.emailjs.publicKey === 'YOUR_PUBLIC_KEY') {
    CONFIG.emailjs.enabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
