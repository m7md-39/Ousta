/* ============ PROBLEM PHOTOS (optional booking attachments) ============
   Front-end demo only. Selected images stay in the browser as File objects plus
   object URLs. Nothing is uploaded, nothing is saved to a server, and nothing
   survives a page reload.

   Flow: draft images live in state.booking.photos while the customer books.
   confirmBooking() calls takeForOrder(), which moves them onto that one order
   (order.attachments) and empties the draft. */
const ProblemPhotos = (() => {
  const MAX_FILES = 5;
  const MAX_BYTES = 5 * 1024 * 1024;
  const MIME_OK = ['image/jpeg', 'image/png', 'image/webp'];
  const EXT_OK = /\.(jpe?g|png|webp)$/i;
  let seq = 0;
  let messages = [];
  let lightbox = null; // { items:[{url,alt}], index, opener }

  const draft = () => state.booking.photos;
  const fileKey = f => [f.name, f.size, f.lastModified].join('|');
  const isAllowed = f => MIME_OK.includes(f.type) || (!f.type && EXT_OK.test(f.name));

  /* ---------- validation + adding ---------- */
  function addFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return; // selection cancelled: nothing to do
    const errors = [];
    for (const f of files) {
      const name = f.name || 'صورة';
      if (!isAllowed(f)) { errors.push(`الملف «${name}» غير مدعوم. الصيغ المسموحة: JPG وPNG وWebP.`); continue; }
      if (f.size === 0) { errors.push(`تعذّرت قراءة الصورة «${name}» لأن الملف فارغ.`); continue; }
      if (f.size > MAX_BYTES) { errors.push(`الصورة «${name}» أكبر من 5 ميجابايت.`); continue; }
      if (draft().some(p => p.key === fileKey(f))) { errors.push(`الصورة «${name}» مضافة بالفعل.`); continue; }
      if (draft().length >= MAX_FILES) { errors.push(`الحد الأقصى ${MAX_FILES} صور لكل حجز، وتم تجاهل باقي الصور.`); break; }
      let url;
      try { url = URL.createObjectURL(f); }
      catch (e) { errors.push(`تعذّرت قراءة الصورة «${name}».`); continue; }
      draft().push({ id: 'ph' + (++seq), key: fileKey(f), file: f, name, size: f.size, type: f.type, url });
    }
    messages = errors;
    refresh();
  }

  function remove(id) {
    const i = draft().findIndex(p => p.id === id);
    if (i < 0) return;
    URL.revokeObjectURL(draft()[i].url);
    draft().splice(i, 1);
    messages = [];
    refresh();
  }

  /* Explicit cancellation of the draft (frees the object URLs). */
  function clearDraft() {
    draft().forEach(p => URL.revokeObjectURL(p.url));
    state.booking.photos = [];
    messages = [];
    refresh();
  }

  /* Called by confirmBooking(): hands the images to the new order and empties the draft.
     URLs are NOT revoked here, because the order still displays them. */
  function takeForOrder() {
    const list = draft().map(({ id, name, size, type, url, file }) => ({ id, name, size, type, url, file }));
    state.booking.photos = [];
    messages = [];
    return list;
  }

  /* ---------- rendering ---------- */
  function thumbHtml(p, scope) {
    const nm = escapeHtml(p.name);
    return `<div class="photo-item">
      <button type="button" class="photo-thumb" data-photo-open data-full="${escapeHtml(p.url)}" data-alt="${nm}" aria-label="تكبير الصورة: ${nm}">
        <img src="${escapeHtml(p.url)}" alt="${scope === 'draft' ? 'معاينة الصورة' : 'صورة المشكلة'}: ${nm}" data-photo-id="${escapeHtml(p.id)}" data-photo-scope="${scope}" loading="lazy">
      </button>
      ${scope === 'draft' ? `<button type="button" class="photo-remove" data-photo-remove="${escapeHtml(p.id)}" aria-label="حذف الصورة ${nm}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>` : ''}
    </div>`;
  }
  function previewHtml() {
    const list = draft();
    return `<div class="subtle photo-count">${list.length} / ${MAX_FILES} صور</div>
      ${messages.length ? `<ul class="photo-errors">${messages.map(m => `<li><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${escapeHtml(m)}</li>`).join('')}</ul>` : ''}
      ${list.length ? `<div class="photo-grid">${list.map(p => thumbHtml(p, 'draft')).join('')}</div>` : ''}`;
  }
  function refresh() {
    const el = document.getElementById('photoPreview');
    if (el) el.innerHTML = previewHtml();
  }
  function resetMessages() { messages = []; }

  function sectionHtml() {
    return `<section class="photo-section" aria-labelledby="photoTitle">
      <h3 class="photo-title" id="photoTitle">صور المشكلة (اختياري)</h3>
      <p class="subtle">أرفق حتى ${MAX_FILES} صور توضّح العطل للأسطى (JPG أو PNG أو WebP، بحد أقصى 5 ميجابايت للصورة).</p>
      <div class="photo-actions">
        <button type="button" class="btn btn-outline btn-sm" data-photo-pick="gallery"><i class="fa-solid fa-image" aria-hidden="true"></i> اختيار صور من الجهاز</button>
        <button type="button" class="btn btn-ghost btn-sm" data-photo-pick="camera"><i class="fa-solid fa-camera" aria-hidden="true"></i> التقاط صورة</button>
      </div>
      <input type="file" id="photoInputGallery" data-photo-input hidden multiple accept="image/jpeg,image/png,image/webp" aria-label="اختيار صور المشكلة من الجهاز">
      <input type="file" id="photoInputCamera" data-photo-input hidden accept="image/jpeg,image/png,image/webp" capture="environment" aria-label="التقاط صورة للمشكلة بالكاميرا">
      <div id="photoPreview" aria-live="polite">${previewHtml()}</div>
    </section>`;
  }

  /* Read-only gallery shown inside order details (customer + technician). */
  function galleryHtml(order) {
    const list = (order && order.attachments) || [];
    if (!list.length) return '';
    return `<div class="order-photos">
      <div class="order-photos-title"><i class="fa-solid fa-images" aria-hidden="true"></i> صور المشكلة (${list.length})</div>
      <div class="photo-grid">${list.map(p => thumbHtml(p, 'order')).join('')}</div>
    </div>`;
  }

  /* ---------- lightbox ---------- */
  function renderLightbox() {
    let el = document.getElementById('photoLightbox');
    if (!el) {
      el = document.createElement('div');
      el.id = 'photoLightbox';
      el.className = 'photo-lightbox';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', 'عرض الصورة');
      document.body.appendChild(el);
    }
    const n = lightbox.items.length, it = lightbox.items[lightbox.index], multi = n > 1;
    el.innerHTML = `<button type="button" class="lb-btn lb-close" data-lb="close" aria-label="إغلاق"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      ${multi ? `<button type="button" class="lb-btn lb-prev" data-lb="prev" aria-label="الصورة السابقة"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
      <button type="button" class="lb-btn lb-next" data-lb="next" aria-label="الصورة التالية"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>` : ''}
      <figure class="lb-fig"><img src="${escapeHtml(it.url)}" alt="${escapeHtml(it.alt)}"><figcaption>${lightbox.index + 1} / ${n}</figcaption></figure>`;
    const focusTarget = el.querySelector('[data-lb="close"]');
    if (focusTarget) focusTarget.focus();
  }
  function openLightbox(btn) {
    const grid = btn.closest('.photo-grid');
    if (!grid) return;
    const buttons = Array.from(grid.querySelectorAll('[data-photo-open]'));
    lightbox = { items: buttons.map(b => ({ url: b.dataset.full, alt: b.dataset.alt || '' })), index: buttons.indexOf(btn), opener: btn };
    renderLightbox();
  }
  function stepLightbox(d) {
    if (!lightbox) return;
    const n = lightbox.items.length;
    lightbox.index = (lightbox.index + d + n) % n;
    renderLightbox();
  }
  function closeLightbox() {
    const el = document.getElementById('photoLightbox');
    if (el) el.remove();
    if (lightbox && lightbox.opener && document.contains(lightbox.opener)) lightbox.opener.focus();
    lightbox = null;
  }

  /* ---------- one-time delegated listeners (survive re-rendering) ---------- */
  document.addEventListener('click', e => {
    const pick = e.target.closest('[data-photo-pick]');
    if (pick) {
      const input = document.getElementById(pick.dataset.photoPick === 'camera' ? 'photoInputCamera' : 'photoInputGallery');
      if (input) input.click();
      return;
    }
    const rm = e.target.closest('[data-photo-remove]');
    if (rm) { remove(rm.dataset.photoRemove); return; }
    const open = e.target.closest('[data-photo-open]');
    if (open) { openLightbox(open); return; }
    const lb = e.target.closest('[data-lb]');
    if (lb) {
      const a = lb.dataset.lb;
      if (a === 'close') closeLightbox(); else if (a === 'next') stepLightbox(1); else if (a === 'prev') stepLightbox(-1);
      return;
    }
    if (e.target.id === 'photoLightbox') closeLightbox();
  });
  document.addEventListener('change', e => {
    if (e.target.matches && e.target.matches('[data-photo-input]')) {
      addFiles(e.target.files);
      e.target.value = ''; // lets the same file be chosen again after removal; also resets cancelled selections
    }
  });
  document.addEventListener('keydown', e => {
    if (!lightbox) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(1);   // RTL: left = next
    else if (e.key === 'ArrowRight') stepLightbox(-1);
  });
  /* Image load errors don't bubble, so listen in the capture phase. */
  document.addEventListener('error', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.dataset || !img.dataset.photoId) return;
    if (img.dataset.photoScope === 'draft') {
      const i = draft().findIndex(p => p.id === img.dataset.photoId);
      if (i >= 0) { URL.revokeObjectURL(draft()[i].url); messages = [`تعذّرت قراءة الصورة «${draft()[i].name}» وتمت إزالتها.`]; draft().splice(i, 1); refresh(); }
    } else {
      const item = img.closest('.photo-item');
      if (item) { item.classList.add('photo-broken'); const t = item.querySelector('[data-photo-open]'); if (t) { t.removeAttribute('data-photo-open'); t.disabled = true; } }
    }
  }, true);

  return { sectionHtml, galleryHtml, takeForOrder, clearDraft, resetMessages, addFiles, MAX_FILES, MAX_BYTES };
})();
