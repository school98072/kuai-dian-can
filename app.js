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
    cart:        'pwa_ordersys_cart_v1',
    dishImages:  'pwa_ordersys_dish_images_v2',
    bannerImage: 'pwa_ordersys_banner_v1',
    history:     'pwa_ordersys_history_v1',
  },
  imgbb: { apiKey: 'f5075433be019a339b4895b983fb193c' },
};

/* ============================================================
   GITHUB  (token obfuscated — XOR + base64)
   ============================================================ */
const GITHUB = {
  owner: 'school98072',
  repo:  'kuai-dian-can',
  branch:'main',
  _k: 'xljz_sfc_2026_priv',
  _e: 'HwUeEioRORM+Rm8DBx4hMSdDNy1aKT0iERoHa3QFcDVJLTgSNgoNEG8BEgo5BkRwZg4BKD5CSV8NAGkAERVpWmdWTmwKMyMVMB9SShw7KicReAN8dW03PCsOSzQh',
  _t() {
    const d = atob(this._e), k = this._k;
    return Array.from(d, (c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))
    ).join('');
  },
};

/* ============================================================
   CATEGORIES
   ============================================================ */
const CATEGORIES = [
  { id: 'dish',   name: '菜品',  emoji: '🍽️' },
  { id: 'soup',   name: '汤羹',  emoji: '🍲' },
  { id: 'staple', name: '主食',  emoji: '🍚' },
  { id: 'snack',  name: '小吃',  emoji: '🥟' },
  { id: 'baking', name: '烘焙',  emoji: '🥐' },
  { id: 'sauce',  name: '酱料',  emoji: '🥣' },
  { id: 'custom', name: '自定义',emoji: '✨' },
];

/* ============================================================
   FALLBACK MENU (used if GitHub fetch fails)
   ============================================================ */
const FALLBACK_MENU = [
  { id:'m01', name:'土豆烧鸡块', desc:'家常版，软糯入味',     category:'dish',   from:'#E8975A', to:'#C4621D', sales:0 },
  { id:'m02', name:'番茄炒鸡蛋', desc:'经典家常，酸甜开胃',   category:'dish',   from:'#FF6B6B', to:'#EE9B00', sales:0 },
  { id:'m03', name:'宫保鸡丁',   desc:'麻辣鲜香，下饭神器',   category:'dish',   from:'#E63946', to:'#F4A261', sales:0 },
  { id:'m04', name:'鱼香肉丝',   desc:'四川家常，浓郁下饭',   category:'dish',   from:'#9B59B6', to:'#E63946', sales:0 },
  { id:'m05', name:'红烧肉',     desc:'肥而不腻，软糯鲜香',   category:'dish',   from:'#7B2D00', to:'#C1440E', sales:0 },
  { id:'m06', name:'清炒时蔬',   desc:'新鲜爽口，健康美味',   category:'dish',   from:'#52B788', to:'#1B4332', sales:0 },
  { id:'s01', name:'番茄鸡蛋汤', desc:'鲜美营养，暖胃首选',   category:'soup',   from:'#FF6B6B', to:'#FFB347', sales:0 },
  { id:'s02', name:'紫菜蛋花汤', desc:'清淡鲜美，营养丰富',   category:'soup',   from:'#7209B7', to:'#F72585', sales:0 },
  { id:'s03', name:'冬瓜排骨汤', desc:'清甜解腻，滋补养生',   category:'soup',   from:'#4CC9F0', to:'#4361EE', sales:0 },
  { id:'r01', name:'扬州炒饭',   desc:'粒粒分明，色香味俱全', category:'staple', from:'#F9C74F', to:'#F8961E', sales:0 },
  { id:'r02', name:'葱油拌面',   desc:'简单美味，面条劲道',   category:'staple', from:'#A7795F', to:'#6B4226', sales:0 },
  { id:'r03', name:'番茄鸡蛋面', desc:'酸甜开胃，暖心暖胃',   category:'staple', from:'#FF6B6B', to:'#F9C74F', sales:0 },
  { id:'x01', name:'锅贴',       desc:'外酥里嫩，汁水丰盈',   category:'snack',  from:'#C19A6B', to:'#8B5E3C', sales:0 },
  { id:'x02', name:'春卷',       desc:'金黄酥脆，馅料丰富',   category:'snack',  from:'#95D5B2', to:'#52B788', sales:0 },
  { id:'x03', name:'香酥芝麻饼', desc:'香脆可口，芝麻飘香',   category:'snack',  from:'#DDA15E', to:'#BC6C25', sales:0 },
  { id:'b01', name:'红豆吐司',   desc:'松软香甜，红豆馅料',   category:'baking', from:'#E63946', to:'#FFB347', sales:0 },
  { id:'b02', name:'蛋黄酥',     desc:'层层酥皮，蛋黄流心',   category:'baking', from:'#F9C74F', to:'#F3722C', sales:0 },
  { id:'c01', name:'自制辣椒酱', desc:'香辣开胃，配啥都好',   category:'sauce',  from:'#E63946', to:'#9D0208', sales:0 },
  { id:'c02', name:'葱油酱',     desc:'鲜香浓郁，拌面一绝',   category:'sauce',  from:'#52B788', to:'#2D6A4F', sales:0 },
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
  dishImages: {},
  dishImageUrls: {},
  activeCategory: null,
  adminMode: false,
  searchQuery: '',
  activePage: 'kitchen',
  lists: { shoppingList: [], fridgeInventory: [] },
  activeListTab: 'shopping',
  orders: [],          // GitHub-synced order history
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
   GITHUB API
   ============================================================ */
async function githubGetFile(path) {
  try {
    // Always fetch fresh SHA — never use browser-cached API response
    const url = `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${path}?ref=${GITHUB.branch}&_=${Date.now()}`;
    const r = await fetch(url, {
      cache: 'no-store',
      headers: { Authorization: `token ${GITHUB._t()}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

async function githubPutFile(path, jsonData, sha, message) {
  const url = `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${path}`;
  const body = {
    message: message || `update ${path}`,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(jsonData, null, 2)))),
    branch: GITHUB.branch,
  };
  if (sha) body.sha = sha;
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB._t()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function fetchMenuFromGitHub() {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB.owner}/${GITHUB.repo}/${GITHUB.branch}/menu.json?t=${Date.now()}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('network error');
    const data = await r.json();
    return Array.isArray(data.items) ? data.items : null;
  } catch (e) {
    console.warn('[GitHub] fetchMenu failed:', e);
    return null;
  }
}

async function fetchListsFromGitHub() {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB.owner}/${GITHUB.repo}/${GITHUB.branch}/lists.json?t=${Date.now()}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('network error');
    return r.json();
  } catch (e) {
    console.warn('[GitHub] fetchLists failed:', e);
    return null;
  }
}

async function pushMenuToGitHub() {
  showToast('发布中…', 'info');
  try {
    const file = await githubGetFile('menu.json');
    const sha  = file ? file.sha : undefined;
    const menuData = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      items: state.allItems.map(({ imageData, ...rest }) => rest), // strip base64
    };
    const result = await githubPutFile('menu.json', menuData, sha, 'update menu');
    if (result && result.content) {
      showToast('菜单已发布 ✓', 'success');
      return true;
    }
    throw new Error(JSON.stringify(result));
  } catch (e) {
    console.error('[GitHub] pushMenu failed:', e);
    showToast('发布失败，请重试', 'error');
    return false;
  }
}

async function pushListsToGitHub() {
  try {
    const file = await githubGetFile('lists.json');
    const sha  = file ? file.sha : undefined;
    const listsData = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      shoppingList:   state.lists.shoppingList,
      fridgeInventory: state.lists.fridgeInventory,
    };
    const result = await githubPutFile('lists.json', listsData, sha, 'update lists');
    return !!(result && result.content);
  } catch (e) {
    console.error('[GitHub] pushLists failed:', e);
    showToast('清单同步失败', 'error');
    return false;
  }
}

async function fetchOrdersFromGitHub() {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB.owner}/${GITHUB.repo}/${GITHUB.branch}/orders.json?t=${Date.now()}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('network error');
    const data = await r.json();
    return Array.isArray(data.orders) ? data.orders : null;
  } catch (e) {
    console.warn('[GitHub] fetchOrders failed:', e);
    return null;
  }
}

async function pushOrderToGitHub(newOrder) {
  try {
    // Fetch latest orders from GitHub first (handles concurrent orders from 2 phones)
    const remoteData = await fetchOrdersFromGitHub();
    const merged = remoteData ? remoteData : state.orders.slice();
    // Prepend new order (newest first)
    merged.unshift(newOrder);
    // Get SHA for PUT
    const file = await githubGetFile('orders.json');
    const sha  = file ? file.sha : undefined;
    const ordersData = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      orders: merged,
    };
    const result = await githubPutFile('orders.json', ordersData, sha, 'add order');
    if (result && result.content) {
      state.orders = merged;
      renderMenu(); // refresh 月销 counts
      if (state.activePage === 'profile') renderProfilePage();
      return true;
    }
    throw new Error(JSON.stringify(result));
  } catch (e) {
    console.error('[GitHub] pushOrder failed:', e);
    showToast('订单记录同步失败，本地已保存', 'warning');
    return false;
  }
}

// 月销 — total units of itemId ordered in the current calendar month
function getItemSales(itemId) {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let total = 0;
  state.orders.forEach(o => {
    if (!o.timestamp || !o.timestamp.startsWith(yearMonth)) return;
    (o.items || []).forEach(it => {
      if (it.id === itemId) total += (it.quantity || 1);
    });
  });
  return total;
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

function getDisplayImage(item) {
  // local base64 (this device) OR remote URL (other device's upload stored in GitHub)
  return state.dishImages[item.id] || item.imageUrl || item.imageData || null;
}

function getItemImageUrl(item) {
  return state.dishImageUrls[item.id] || item.imageUrl || null;
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadFromStorage() {
  // Cart
  try {
    const raw = localStorage.getItem(CONFIG.storage.cart);
    state.cart = raw ? JSON.parse(raw) : [];
  } catch { state.cart = []; }

  // Dish images (base64)
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

function saveCart() {
  localStorage.setItem(CONFIG.storage.cart, JSON.stringify(state.cart));
}

function saveDishImages() {
  localStorage.setItem(CONFIG.storage.dishImages, JSON.stringify(state.dishImages));
}


/* ============================================================
   CROP MODAL
   ============================================================ */
const crop = {
  img: null, scale: 1, minScale: 1,
  panX: 0, panY: 0, callback: null,
};

function openCropModal(imageDataUrl, callback) {
  crop.callback = callback;
  const img = new Image();
  img.onload = () => {
    crop.img = img;
    const canvas = $('cropCanvas');
    const size   = Math.min(window.innerWidth - 32, 420);
    canvas.width  = size;
    canvas.height = size;
    const sx = size / img.width, sy = size / img.height;
    crop.minScale = Math.max(sx, sy);
    crop.scale    = crop.minScale;
    crop.panX     = (size - img.width  * crop.scale) / 2;
    crop.panY     = (size - img.height * crop.scale) / 2;
    drawCrop();
    $('cropModal').classList.add('open');
    $('overlay').classList.add('active');
  };
  img.src = imageDataUrl;
}

function drawCrop() {
  const canvas = $('cropCanvas');
  const ctx    = canvas.getContext('2d');
  const size   = canvas.width;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(crop.img, crop.panX, crop.panY, crop.img.width * crop.scale, crop.img.height * crop.scale);
  // Grid overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth   = 0.8;
  ctx.beginPath();
  [size/3, size*2/3].forEach(x => { ctx.moveTo(x,0); ctx.lineTo(x,size); });
  [size/3, size*2/3].forEach(y => { ctx.moveTo(0,y); ctx.lineTo(size,y); });
  ctx.stroke();
  // Border
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth   = 2;
  ctx.strokeRect(1, 1, size-2, size-2);
}

function clampCropPan() {
  const canvas = $('cropCanvas');
  const size   = canvas.width;
  const iw = crop.img.width  * crop.scale;
  const ih = crop.img.height * crop.scale;
  crop.panX = Math.min(0, Math.max(size - iw, crop.panX));
  crop.panY = Math.min(0, Math.max(size - ih, crop.panY));
}

function confirmCrop() {
  const canvas = $('cropCanvas');
  // Output square at 480px
  const out    = document.createElement('canvas');
  out.width  = 480; out.height = 480;
  const ctx  = out.getContext('2d');
  const scale = 480 / canvas.width;
  ctx.drawImage(crop.img,
    crop.panX * scale, crop.panY * scale,
    crop.img.width * crop.scale * scale, crop.img.height * crop.scale * scale
  );
  const dataUrl = out.toDataURL('image/jpeg', 0.82);
  closeCropModal();
  if (crop.callback) crop.callback(dataUrl);
}

function closeCropModal() {
  $('cropModal').classList.remove('open');
  $('overlay').classList.remove('active');
}

function initCropEvents() {
  const canvas = $('cropCanvas');
  // Touch
  let lastTouches = [];
  canvas.addEventListener('touchstart', e => {
    e.preventDefault(); lastTouches = [...e.touches];
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouches.length >= 1) {
      crop.panX += e.touches[0].clientX - lastTouches[0].clientX;
      crop.panY += e.touches[0].clientY - lastTouches[0].clientY;
    } else if (e.touches.length === 2 && lastTouches.length === 2) {
      const d0 = Math.hypot(lastTouches[0].clientX - lastTouches[1].clientX, lastTouches[0].clientY - lastTouches[1].clientY);
      const d1 = Math.hypot(e.touches[0].clientX   - e.touches[1].clientX,   e.touches[0].clientY   - e.touches[1].clientY);
      const f  = d1 / d0;
      const newScale = Math.max(crop.minScale, crop.scale * f);
      const cx = canvas.getBoundingClientRect().left + canvas.width  / 2;
      const cy = canvas.getBoundingClientRect().top  + canvas.height / 2;
      crop.panX = cx - canvas.getBoundingClientRect().left - (cx - canvas.getBoundingClientRect().left - crop.panX) * (newScale / crop.scale);
      crop.panY = cy - canvas.getBoundingClientRect().top  - (cy - canvas.getBoundingClientRect().top  - crop.panY) * (newScale / crop.scale);
      crop.scale = newScale;
    }
    lastTouches = [...e.touches];
    clampCropPan(); drawCrop();
  }, { passive: false });
  canvas.addEventListener('touchend', e => { lastTouches = [...e.touches]; }, { passive: true });

  // Mouse (desktop)
  let dragging = false, mx = 0, my = 0;
  canvas.addEventListener('mousedown', e => { dragging = true; mx = e.clientX; my = e.clientY; });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    crop.panX += e.clientX - mx; crop.panY += e.clientY - my;
    mx = e.clientX; my = e.clientY;
    clampCropPan(); drawCrop();
  });
  window.addEventListener('mouseup', () => { dragging = false; });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(crop.minScale, crop.scale * f);
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    crop.panX = px - (px - crop.panX) * (newScale / crop.scale);
    crop.panY = py - (py - crop.panY) * (newScale / crop.scale);
    crop.scale = newScale;
    clampCropPan(); drawCrop();
  }, { passive: false });

  $('confirmCropBtn').addEventListener('click', confirmCrop);
  $('closeCropBtn').addEventListener('click',   closeCropModal);
}

/* ============================================================
   SIDEBAR RENDERING
   ============================================================ */
function renderSidebar() {
  const sidebar = $('catSidebar');
  sidebar.innerHTML = '';
  const usedCats = CATEGORIES.filter(cat =>
    state.allItems.some(item => (item.category || (item.isCustom ? 'custom' : 'dish')) === cat.id)
  );
  usedCats.forEach((cat, i) => {
    const el = document.createElement('div');
    el.className = `cat-item${state.activeCategory === cat.id || (!state.activeCategory && i === 0) ? ' active' : ''}`;
    el.dataset.cat = cat.id;
    el.innerHTML = `<span class="cat-emoji">${cat.emoji}</span>${cat.name}`;
    el.addEventListener('click', () => {
      const section = $(`section-${cat.id}`);
      if (section) { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveCat(cat.id); }
    });
    sidebar.appendChild(el);
  });
}

function setActiveCat(catId) {
  state.activeCategory = catId;
  document.querySelectorAll('.cat-item').forEach(el =>
    el.classList.toggle('active', el.dataset.cat === catId)
  );
  const activeEl = document.querySelector(`.cat-item[data-cat="${catId}"]`);
  if (activeEl) activeEl.scrollIntoView({ block: 'nearest' });
}

/* ============================================================
   MENU RENDERING
   ============================================================ */
function renderMenu() {
  const dishMain = $('dishMain');
  if (!dishMain) return;
  const query = state.searchQuery.trim().toLowerCase();
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
  if (state.adminMode) initDishSortable();
}

/* ============================================================
   WITHIN-CATEGORY DRAG SORT (admin mode)
   ============================================================ */
function syncCatOrder(section, catId) {
  const newIds = [...section.querySelectorAll('.dish-card')].map(c => c.dataset.id);
  const result = [];
  CATEGORIES.forEach(cat => {
    const catItems = state.allItems.filter(i =>
      (i.category || (i.isCustom ? 'custom' : 'dish')) === cat.id
    );
    if (cat.id === catId) {
      newIds.forEach(id => {
        const item = catItems.find(i => i.id === id);
        if (item) result.push(item);
      });
    } else {
      result.push(...catItems);
    }
  });
  state.allItems = result;
  showToast('顺序已调整，记得发布菜单', 'info');
}

function initDishSortable() {
  document.querySelectorAll('.dish-section').forEach(section => {
    const catId = section.id.replace('section-', '');
    let dragCard = null;

    section.querySelectorAll('.dish-card').forEach(card => {
      const handle = card.querySelector('.drag-handle');
      if (!handle) return;

      // ── Mouse / Desktop DnD ──────────────────────────────
      card.draggable = true;
      card.addEventListener('dragstart', e => {
        dragCard = card;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.classList.add('dragging'), 0);
      });
      card.addEventListener('dragend', () => {
        if (dragCard) { dragCard.classList.remove('dragging'); dragCard = null; }
        section.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(c => {
          c.classList.remove('drag-over-top', 'drag-over-bottom');
        });
        syncCatOrder(section, catId);
      });
      card.addEventListener('dragover', e => {
        e.preventDefault();
        if (!dragCard || dragCard === card) return;
        section.querySelectorAll('.drag-over-top,.drag-over-bottom').forEach(c => {
          c.classList.remove('drag-over-top', 'drag-over-bottom');
        });
        const rect = card.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          card.classList.add('drag-over-top');
          section.insertBefore(dragCard, card);
        } else {
          card.classList.add('drag-over-bottom');
          card.after(dragCard);
        }
      });

      // ── Touch / Mobile ───────────────────────────────────
      handle.addEventListener('touchstart', e => {
        e.preventDefault();
        dragCard = card;
        card.classList.add('dragging');
        card.style.pointerEvents = 'none'; // let elementFromPoint see through
      }, { passive: false });

      handle.addEventListener('touchmove', e => {
        if (!dragCard) return;
        e.preventDefault();
        const t = e.touches[0];
        const under = document.elementFromPoint(t.clientX, t.clientY);
        const targetCard = under && under.closest('.dish-card');
        if (targetCard && targetCard !== dragCard && section.contains(targetCard)) {
          const rect = targetCard.getBoundingClientRect();
          if (t.clientY < rect.top + rect.height / 2) {
            section.insertBefore(dragCard, targetCard);
          } else {
            targetCard.after(dragCard);
          }
        }
      }, { passive: false });

      handle.addEventListener('touchend', () => {
        if (!dragCard) return;
        dragCard.classList.remove('dragging');
        dragCard.style.pointerEvents = '';
        syncCatOrder(section, catId);
        dragCard = null;
      });
    });
  });
}

function createDishCard(item) {
  const entry    = state.cart.find(c => c.item.id === item.id);
  const qty      = entry ? entry.quantity : 0;
  const imgSrc   = getDisplayImage(item);
  const card     = document.createElement('div');
  card.className = 'dish-card pop-anim';
  card.dataset.id = item.id;

  const thumbStyle = imgSrc
    ? `background-image:url('${imgSrc}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from || '#FF6B35'},${item.to || '#FDCB6E'})`;

  const editOverlay = state.adminMode
    ? `<label class="thumb-edit-overlay" title="点击更换图片">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <span style="font-size:10px;margin-top:2px">换图片</span>
        <input type="file" accept="image/*" class="dish-img-input" data-id="${item.id}" style="display:none">
      </label>` : '';

  const deleteBtn = state.adminMode
    ? `<button class="dish-delete-btn" data-id="${item.id}" aria-label="删除">✕</button>` : '';

  card.innerHTML = `
    <div class="drag-handle" title="拖动排序">⠿</div>
    <div class="dish-thumb" style="${thumbStyle}">
      ${!imgSrc ? `<span class="dish-thumb-emoji">${item.emoji || '🍽️'}</span>` : ''}
      ${editOverlay}
    </div>
    <div class="dish-info">
      <div class="dish-name-row">
        <span class="dish-name">${escHtml(item.name)}</span>
      </div>
      ${item.desc ? `<p class="dish-desc">${escHtml(item.desc)}</p>` : ''}
      <div class="dish-footer">
        <span class="dish-sales">月销 ${getItemSales(item.id)}</span>
        <div class="dish-qty-ctrl">
          ${qty > 0 ? `<button class="qty-btn minus" data-id="${item.id}" aria-label="减少">−</button>
                       <span class="qty-num" aria-live="polite">${qty}</span>` : ''}
          <button class="qty-btn plus${qty === 0 ? ' solo' : ''}" data-id="${item.id}" aria-label="加入">+</button>
        </div>
      </div>
    </div>
    ${deleteBtn}
  `;

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

  // Admin: image replace → crop modal
  const imgInput = card.querySelector('.dish-img-input');
  if (imgInput) imgInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => openCropModal(ev.target.result, cropped => {
      state.dishImages[item.id] = cropped;
      saveDishImages();
      // Find & update imageUrl in allItems
      const mi = state.allItems.find(i => i.id === item.id);
      if (mi) {
        uploadToImgbb(cropped).then(url => {
          if (url) { mi.imageUrl = url; state.dishImageUrls[item.id] = url; }
        });
      }
      refreshDish(item.id);
      showToast('图片已更新，记得发布菜单', 'info');
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Admin: delete any item
  const delBtn = card.querySelector('.dish-delete-btn');
  if (delBtn) delBtn.addEventListener('click', e => {
    e.stopPropagation();
    deleteItem(item.id);
  });

  return card;
}

function refreshDish(itemId) {
  const old  = document.querySelector(`.dish-card[data-id="${itemId}"]`);
  if (!old)  return;
  const item = state.allItems.find(i => i.id === itemId);
  if (!item) return;
  old.replaceWith(createDishCard(item));
}

/* ============================================================
   CATEGORY OBSERVER
   ============================================================ */
function initCategoryObserver() {
  if (window._catObserver) window._catObserver.disconnect();
  window._catObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setActiveCat(e.target.id.replace('section-', ''));
    });
  }, { root: $('dishMain'), rootMargin: '-5% 0px -75% 0px' });
  document.querySelectorAll('.dish-section').forEach(s => window._catObserver.observe(s));
}

/* ============================================================
   CART RENDERING
   ============================================================ */
function renderCart() {
  const body   = $('drawerBody');
  const footer = $('drawerFooter');
  const total  = cartTotal();
  if (state.cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p class="empty-title">购物车是空的</p><p class="empty-sub">快去选选看吧！</p></div>`;
    footer.hidden = true;
  } else {
    body.innerHTML = state.cart.map(e => buildCartItemHTML(e)).join('');
    footer.hidden  = false;
    $('totalCount').textContent = total;
    bindCartItemEvents();
  }
  updateBadges(total);
}

function buildCartItemHTML(entry) {
  const { id, item, quantity, notes } = entry;
  const imgSrc = getDisplayImage(item);
  const thumbStyle = imgSrc
    ? `background-image:url('${imgSrc}');background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${item.from || '#FF6B35'},${item.to || '#FDCB6E'})`;
  return `
    <div class="cart-item" id="ci-${id}">
      <div class="ci-thumb" style="${thumbStyle}">
        ${!imgSrc ? `<span class="ci-emoji">${item.emoji || '🍽️'}</span>` : ''}
      </div>
      <div class="ci-body">
        <div class="ci-top">
          <span class="ci-name">${escHtml(item.name)}</span>
          <button class="ci-remove-btn" data-id="${id}" aria-label="移除">✕</button>
        </div>
        ${notes ? `<p class="ci-note">📝 ${escHtml(notes)}</p>` : ''}
        <div class="ci-actions">
          <button class="ci-note-btn" data-id="${id}">${notes ? '✏️ 编辑备注' : '📝 加备注'}</button>
          <div class="ci-qty-row">
            <button class="ci-qty-btn ci-minus" data-id="${id}">−</button>
            <span class="ci-qty-num">${quantity}</span>
            <button class="ci-qty-btn ci-plus"  data-id="${id}">+</button>
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
  const hb = $('cartHeaderBadge'), nb = $('navBadge');
  if (total > 0) { hb.textContent = total; hb.hidden = false; nb.textContent = total; nb.hidden = false; }
  else           { hb.hidden = true; nb.hidden = true; }
}

/* ============================================================
   CART OPERATIONS
   ============================================================ */
function handleAddDish(item) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (existing) { existing.quantity++; }
  else          { state.cart.push({ id: uid(), item, quantity: 1, notes: '' }); }
  saveCart(); refreshDish(item.id); renderCart();
  showToast(`${item.name} +1 ✓`, 'success');
}

function handleRemoveDish(item) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (!existing) return;
  existing.quantity--;
  if (existing.quantity <= 0) state.cart = state.cart.filter(c => c.item.id !== item.id);
  saveCart(); refreshDish(item.id); renderCart();
}

function addToCart(item, notes) {
  state.cart.push({ id: uid(), item, quantity: 1, notes });
  saveCart(); refreshDish(item.id); renderCart();
}

function removeFromCart(cartId) {
  const entry = state.cart.find(c => c.id === cartId);
  state.cart  = state.cart.filter(c => c.id !== cartId);
  saveCart();
  if (entry) refreshDish(entry.item.id);
  renderCart();
}

function updateQuantity(cartId, delta) {
  const entry = state.cart.find(c => c.id === cartId);
  if (!entry) return;
  entry.quantity = Math.max(0, entry.quantity + delta);
  if (entry.quantity === 0) { removeFromCart(cartId); return; }
  saveCart(); renderCart(); refreshDish(entry.item.id);
}

function clearCart() {
  const ids = state.cart.map(c => c.item.id);
  state.cart = []; saveCart();
  ids.forEach(id => refreshDish(id));
  renderCart();
}

/* ============================================================
   ADMIN MODE
   ============================================================ */
function toggleAdminMode() {
  state.adminMode = !state.adminMode;
  const app = $('app'), btn = $('adminToggleBtn'), bannerBtn = $('bannerEditBtn');
  const publishBtn = $('publishMenuBtn');
  if (state.adminMode) {
    app.classList.add('admin-mode'); btn.classList.add('active');
    bannerBtn.hidden = false; publishBtn.hidden = false;
    showToast('已进入管理模式', 'info');
  } else {
    app.classList.remove('admin-mode'); btn.classList.remove('active');
    bannerBtn.hidden = true; publishBtn.hidden = true;
    showToast('已退出管理模式', 'info');
  }
  renderMenu();
}

/* ============================================================
   CUSTOM ITEM DELETION
   ============================================================ */
function deleteItem(itemId) {
  state.cart = state.cart.filter(c => c.item.id !== itemId);
  state.allItems = state.allItems.filter(i => i.id !== itemId);
  delete state.dishImages[itemId];
  saveCart(); saveDishImages();
  renderMenu(); renderCart();
  showToast('菜品已删除，记得发布菜单', 'info');
}

/* ============================================================
   BANNER IMAGE
   ============================================================ */
function applyBannerImage(base64) {
  const b = $('headerBanner');
  b.style.backgroundImage    = `url('${base64}')`;
  b.style.backgroundSize     = 'cover';
  b.style.backgroundPosition = 'center';
}

function handleBannerSelect(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = evt => {
    localStorage.setItem(CONFIG.storage.bannerImage, evt.target.result);
    applyBannerImage(evt.target.result);
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
}

function closeDrawer() {
  $('cartDrawer').classList.remove('open');
  $('overlay').classList.remove('active');
  $('cartDrawer').setAttribute('aria-hidden', 'true');
}

/* ============================================================
   CUSTOM ITEM MODAL
   ============================================================ */
function openCustomModal() {
  $('customName').value = ''; $('customDesc').value = ''; $('customNote').value = '';
  $('customCategory').value = 'dish';
  $('imgPreview').hidden = true; $('uploadHint').hidden = false; $('imgInput').value = '';
  state.pendingCustomImage = null; state.pendingCustomImageUrl = null; state.pendingCustomImageUpload = null;
  $('customModal').classList.add('open');
  $('overlay').classList.add('active');
  $('customModal').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('customName').focus(), 400);
}

function closeCustomModal() {
  $('customModal').classList.remove('open');
  $('overlay').classList.remove('active');
  $('customModal').setAttribute('aria-hidden', 'true');
}

function handleImageSelect(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => openCropModal(ev.target.result, cropped => {
    state.pendingCustomImage = cropped;
    $('imgPreview').src = cropped; $('imgPreview').hidden = false; $('uploadHint').hidden = true;
    state.pendingCustomImageUrl = null;
    state.pendingCustomImageUpload = uploadToImgbb(cropped).then(url => {
      state.pendingCustomImageUrl = url; return url;
    });
  });
  reader.readAsDataURL(file);
}

async function addCustomItem() {
  const name = $('customName').value.trim();
  if (!name) { showToast('请输入菜品名称', 'error'); $('customName').focus(); return; }
  if (state.pendingCustomImageUpload) {
    showToast('图片上传中，请稍候…', 'info');
    await state.pendingCustomImageUpload;
  }
  const GRADS = [['#6C5CE7','#A29BFE'],['#00CEC9','#81ECEC'],['#E84393','#E17055'],['#0984E3','#74B9FF'],['#00B894','#55EFC4']];
  const g     = GRADS[state.allItems.filter(i => i.isCustom).length % GRADS.length];
  const item  = {
    id: 'custom-' + uid(), name,
    desc:      $('customDesc').value.trim(),
    emoji: '🍽️', from: g[0], to: g[1],
    category:  $('customCategory').value || 'dish',
    sales: 0,
    imageData: state.pendingCustomImage || null,
    imageUrl:  state.pendingCustomImageUrl || null,
    isCustom:  true,
  };
  state.allItems.push(item);
  renderMenu();
  addToCart(item, $('customNote').value.trim());
  closeCustomModal();
  showToast(`已加入「${name}」到菜单`, 'success');
  // Auto-push to GitHub
  pushMenuToGitHub();
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
  setTimeout(() => $('noteInput').focus(), 400);
}

function closeNoteModal() {
  $('noteModal').classList.remove('open');
  $('overlay').classList.remove('active');
  $('noteModal').setAttribute('aria-hidden', 'true');
  state.editingCartId = null;
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
   ORDER PLACEMENT + HISTORY
   ============================================================ */
async function placeOrder() {
  if (state.cart.length === 0) { showToast('购物车是空的！', 'error'); return; }
  closeConfirmModal();
  const btn = $('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> 传送中...`;

  const timestamp = new Date().toLocaleString('zh-TW', {
    year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false,
  });
  const e = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Upload missing imgbb URLs
  await Promise.all(state.cart.map(async entry => {
    const imgSrc = getDisplayImage(entry.item);
    const imgUrl = getItemImageUrl(entry.item);
    if (imgSrc && !imgUrl) {
      const url = await uploadToImgbb(imgSrc);
      if (url) { entry.item.imageUrl = url; state.dishImageUrls[entry.item.id] = url; }
    }
  }));

  const htmlLines = state.cart.map(entry => {
    let html = `<p style="margin:6px 0">• <strong>${e(entry.item.name)}</strong> × ${entry.quantity}`;
    if (entry.notes) html += `（备注：${e(entry.notes)}）`;
    html += '</p>';
    const imgUrl = getItemImageUrl(entry.item);
    if (imgUrl) html += `<p style="margin:4px 0 12px"><img src="${imgUrl}" style="max-width:200px;border-radius:8px;display:block" alt="${e(entry.item.name)}"></p>`;
    return html;
  });

  const orderBody = `<p><strong>【订单时间】</strong>${e(timestamp)}</p><p><strong>【点餐内容】</strong></p>${htmlLines.join('')}<p>共 ${cartTotal()} 道菜</p>`.trim();

  try {
    if (CONFIG.emailjs.enabled) {
      emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        to_email: CONFIG.chefEmail, order_time: timestamp, order_content: orderBody,
      });
    } else {
      const sub = encodeURIComponent(`【小六仔之家】新订单 - ${timestamp}`);
      window.open(`mailto:${CONFIG.chefEmail}?subject=${sub}&body=${encodeURIComponent(orderBody)}`, '_blank');
    }
    // Save to GitHub (two-phone sync)
    const order = {
      id: uid(), timestamp: new Date().toISOString(),
      items: state.cart.map(c => ({ id: c.item.id, name: c.item.name, quantity: c.quantity })),
    };
    state.orders.unshift(order); // optimistic local update
    pushOrderToGitHub(order);    // async GitHub push

    clearCart(); closeDrawer();
    showToast('🎉 下单成功！厨师已收到订单', 'success');
  } catch (err) {
    console.error('[Order]', err);
    showToast('传送失败，请重试', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> 立即下单`;
  }
}

/* ============================================================
   LISTS MODULE  (清单页面)
   ============================================================ */
function renderListsPage() {
  const pg = $('listsPage');
  if (!pg || pg.hidden) return;
  const { shoppingList, fridgeInventory } = state.lists;
  const tab = state.activeListTab;

  const buildItems = (items, type) => {
    if (!items.length) {
      return `<div class="list-empty">${type === 'shopping' ? '🛒 购买清单是空的' : '🧊 冰箱库存是空的'}</div>`;
    }
    return items.map(item => `
      <div class="list-item" data-id="${item.id}">
        <span class="list-item-name">${escHtml(item.name)}</span>
        <div class="list-item-actions">
          ${type === 'shopping' ? `<button class="list-action-btn move-btn" data-id="${item.id}" title="已买，移到冰箱">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
            移到冰箱
          </button>` : ''}
          <button class="list-action-btn del-list-btn" data-id="${item.id}" title="删除">✕</button>
        </div>
      </div>`).join('');
  };

  pg.innerHTML = `
    <div class="lists-header">
      <div class="lists-tabs">
        <button class="list-tab${tab === 'shopping' ? ' active' : ''}" data-tab="shopping">
          购买清单
          ${shoppingList.length ? `<span class="list-count">${shoppingList.length}</span>` : ''}
        </button>
        <button class="list-tab${tab === 'fridge' ? ' active' : ''}" data-tab="fridge">
          冰箱库存
          ${fridgeInventory.length ? `<span class="list-count">${fridgeInventory.length}</span>` : ''}
        </button>
      </div>
      <div class="list-add-row">
        <input type="text" class="list-add-input" id="listAddInput" placeholder="${tab === 'shopping' ? '添加食材…' : '添加库存…'}" maxlength="30">
        <button class="list-add-btn" id="listAddBtn">+ 添加</button>
      </div>
    </div>
    <div class="list-items-wrap">
      ${buildItems(tab === 'shopping' ? shoppingList : fridgeInventory, tab)}
    </div>`;

  // Bind tab switch
  pg.querySelectorAll('.list-tab').forEach(btn => btn.addEventListener('click', () => {
    state.activeListTab = btn.dataset.tab;
    renderListsPage();
  }));

  // Add item
  const addFn = () => {
    const input = $('listAddInput');
    const name  = input.value.trim();
    if (!name) return;
    const newItem = { id: uid(), name, addedAt: new Date().toISOString() };
    if (state.activeListTab === 'shopping') state.lists.shoppingList.push(newItem);
    else state.lists.fridgeInventory.push(newItem);
    input.value = '';
    renderListsPage();
    pushListsToGitHub();
  };
  $('listAddBtn').addEventListener('click', addFn);
  $('listAddInput').addEventListener('keydown', e => { if (e.key === 'Enter') addFn(); });

  // Move to fridge
  pg.querySelectorAll('.move-btn').forEach(btn => btn.addEventListener('click', () => {
    const id  = btn.dataset.id;
    const idx = state.lists.shoppingList.findIndex(i => i.id === id);
    if (idx === -1) return;
    const [item] = state.lists.shoppingList.splice(idx, 1);
    state.lists.fridgeInventory.push(item);
    state.activeListTab = 'fridge';
    renderListsPage();
    pushListsToGitHub();
    showToast(`${item.name} 已移到冰箱 ✓`, 'success');
  }));

  // Delete
  pg.querySelectorAll('.del-list-btn').forEach(btn => btn.addEventListener('click', () => {
    const id   = btn.dataset.id;
    const list = state.activeListTab === 'shopping' ? 'shoppingList' : 'fridgeInventory';
    state.lists[list] = state.lists[list].filter(i => i.id !== id);
    renderListsPage();
    pushListsToGitHub();
  }));
}

/* ============================================================
   PROFILE MODULE  (我的页面)
   ============================================================ */
function renderProfilePage() {
  const pg = $('profilePage');
  if (!pg || pg.hidden) return;
  const history = state.orders;

  const buildCard = order => {
    const date = new Date(order.timestamp).toLocaleString('zh-TW', {
      month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false,
    });
    const items = order.items.map(it =>
      `<span class="h-item">${escHtml(it.name)} ×${it.quantity}</span>`
    ).join('');
    return `
      <div class="history-card">
        <div class="history-card-header">
          <span class="history-date">${date}</span>
          <button class="reorder-btn" data-id="${order.id}">加入购物车</button>
        </div>
        <div class="history-items">${items}</div>
      </div>`;
  };

  pg.innerHTML = `
    <div class="profile-inner">
      <div class="profile-section-title">历史订单</div>
      ${history.length === 0
        ? '<div class="profile-empty">📋 还没有下过订单</div>'
        : history.map(buildCard).join('')}
    </div>`;

  pg.querySelectorAll('.reorder-btn').forEach(btn => btn.addEventListener('click', () => {
    const order = state.orders.find(o => o.id === btn.dataset.id);
    if (!order) return;
    order.items.forEach(hi => {
      const menuItem = state.allItems.find(i => i.id === hi.id);
      if (!menuItem) return;
      const ex = state.cart.find(c => c.item.id === menuItem.id);
      if (ex) ex.quantity += hi.quantity;
      else state.cart.push({ id: uid(), item: menuItem, quantity: hi.quantity, notes: '' });
    });
    saveCart(); renderCart(); updateBadges(cartTotal());
    showToast('已加入购物车 ✓', 'success');
    switchPage('kitchen');
  }));
}

/* ============================================================
   PAGE NAVIGATION
   ============================================================ */
function switchPage(page) {
  state.activePage = page;
  $('kitchenPage').hidden   = page !== 'kitchen';
  $('listsPage').hidden     = page !== 'lists';
  $('profilePage').hidden   = page !== 'profile';
  $('searchBar').hidden     = page !== 'kitchen' ? true : $('searchBar').hidden;

  // Show/hide header controls
  $('shopActions').hidden  = page !== 'kitchen';

  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.page === page)
  );
  if (page === 'lists')   renderListsPage();
  if (page === 'profile') renderProfilePage();
}

/* ============================================================
   SEARCH
   ============================================================ */
function toggleSearch() {
  const bar = $('searchBar');
  const closing = !bar.hidden;
  bar.hidden = closing;
  $('searchToggleBtn').classList.toggle('active', !closing);
  if (closing) { state.searchQuery = ''; $('searchInput').value = ''; renderMenu(); }
  else         { setTimeout(() => $('searchInput').focus(), 100); }
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg, type = 'info') {
  const container = $('toastContainer');
  const toast     = document.createElement('div');
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
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('installBar').hidden = false; });
  $('installBtn').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null; $('installBar').hidden = true;
    if (outcome === 'accepted') showToast('小六仔之家幸福私厨已安装 🎉', 'success');
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
        const w = reg.installing;
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller)
            showToast('应用已更新，请重新整理', 'info');
        });
      });
    }).catch(err => console.warn('[SW]', err));
}

/* ============================================================
   REMOTE DATA LOADING
   ============================================================ */
async function loadRemoteData() {
  // Menu
  const remoteItems = await fetchMenuFromGitHub();
  if (remoteItems && remoteItems.length > 0) {
    // Keep local custom items not yet on GitHub
    const remoteIds     = new Set(remoteItems.map(i => i.id));
    const localOnlyCustom = state.allItems.filter(i => i.isCustom && !remoteIds.has(i.id));
    state.allItems = [...remoteItems, ...localOnlyCustom];
    // Re-validate cart
    state.cart = state.cart.filter(c => state.allItems.some(m => m.id === c.item.id));
    saveCart();
    renderMenu();
    renderCart();
  }
  // Lists
  const remoteLists = await fetchListsFromGitHub();
  if (remoteLists) {
    state.lists.shoppingList   = remoteLists.shoppingList   || [];
    state.lists.fridgeInventory= remoteLists.fridgeInventory|| [];
    if (state.activePage === 'lists') renderListsPage();
  }
  // Orders (GitHub-synced history)
  const remoteOrders = await fetchOrdersFromGitHub();
  if (remoteOrders) {
    state.orders = remoteOrders;
    renderMenu(); // refresh 月销 with real data
    if (state.activePage === 'profile') renderProfilePage();
  }
}

/* ============================================================
   EVENT BINDINGS
   ============================================================ */
function bindEvents() {
  // Cart
  $('cartBtn').addEventListener('click', openDrawer);
  $('closeDrawerBtn').addEventListener('click', closeDrawer);
  $('navOrderBtn').addEventListener('click', openDrawer);

  // Overlay
  $('overlay').addEventListener('click', () => {
    if ($('cartDrawer').classList.contains('open'))   closeDrawer();
    if ($('customModal').classList.contains('open'))  closeCustomModal();
    if ($('noteModal').classList.contains('open'))    closeNoteModal();
    if ($('confirmModal').classList.contains('open')) closeConfirmModal();
    if ($('cropModal').classList.contains('open'))    closeCropModal();
  });

  // Admin & publish
  $('adminToggleBtn').addEventListener('click', toggleAdminMode);
  $('publishMenuBtn').addEventListener('click', pushMenuToGitHub);

  // Banner
  $('bannerInput').addEventListener('change', e => handleBannerSelect(e.target.files[0]));

  // Custom modal
  $('openCustomBtn').addEventListener('click', openCustomModal);
  $('closeCustomBtn').addEventListener('click', closeCustomModal);
  $('addCustomItemBtn').addEventListener('click', addCustomItem);
  $('customName').addEventListener('keydown', e => { if (e.key === 'Enter') addCustomItem(); });
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
  $('noteInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveNote(); } });

  // Order
  $('placeOrderBtn').addEventListener('click', openConfirmModal);
  $('cancelOrderBtn').addEventListener('click', closeConfirmModal);
  $('confirmOrderBtn').addEventListener('click', placeOrder);

  // Search
  $('searchToggleBtn').addEventListener('click', toggleSearch);
  $('searchInput').addEventListener('input', e => { state.searchQuery = e.target.value; renderMenu(); });
  $('searchClear').addEventListener('click', () => { $('searchInput').value = ''; state.searchQuery = ''; renderMenu(); $('searchInput').focus(); });

  // Bottom nav
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    if (btn.id === 'navOrderBtn') return; // handled separately
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });

  // Escape
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if ($('cropModal').classList.contains('open'))    { closeCropModal(); return; }
    if ($('cartDrawer').classList.contains('open'))   { closeDrawer(); return; }
    if ($('customModal').classList.contains('open'))  { closeCustomModal(); return; }
    if ($('noteModal').classList.contains('open'))    { closeNoteModal(); return; }
    if ($('confirmModal').classList.contains('open')) { closeConfirmModal(); return; }
  });
}

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  // 1. Load local data and render immediately
  loadFromStorage();
  state.allItems = [...FALLBACK_MENU];
  renderMenu();
  renderCart();

  // 2. Bind events
  bindEvents();
  initCropEvents();
  initDrawerSwipe();
  initInstallPrompt();
  registerServiceWorker();

  // 3. Fetch remote data (GitHub) — updates UI when ready
  loadRemoteData();
}

document.addEventListener('DOMContentLoaded', init);
