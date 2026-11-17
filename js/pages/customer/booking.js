function setBookingField(key, value){ state.booking[key] = value; }

function viewBooking(){
  ProblemPhotos.resetMessages();
  const tech = TECHNICIANS.find(t=>t.id===state.booking.techId);
  const svcPrice = state.servicePrices.find(s=>s.id===state.booking.serviceId);
  const avg = svcPrice ? svcPrice.base + 40 : 150;
  state.booking.estimate = avg;
  return `
  <div class="view">
    <div class="page-head">
      <h1>تفاصيل الحجز</h1>
      <p>راجع بيانات الحجز قبل الإرسال للأسطى.</p>
    </div>
    <div class="grid grid-2">
      <div class="card">
        <div class="section-title" style="margin-top:0;"><span class="bar"></span>اختر الوقت المطلوب لتنفيذ الخدمة</div>
        <div class="grid grid-2">
          <div class="field"><label>التاريخ</label><input type="date" id="bDate" value="${escapeHtml(state.booking.date||'2026-07-15')}" oninput="setBookingField('date', this.value)"></div>
          <div class="field"><label>الوقت</label><input type="time" id="bTime" value="${escapeHtml(state.booking.time||'11:00')}" oninput="setBookingField('time', this.value)"></div>
        </div>
        <div class="field"><label>ملاحظات إضافية للفني</label><textarea id="bNotes" placeholder="مثال: عطل في المفاتيح الكهربائية بغرفة النوم" oninput="setBookingField('notes', this.value)">${escapeHtml(state.booking.notes)}</textarea></div>
        ${ProblemPhotos.sectionHtml()}
      </div>
      <div class="card">
        <div style="display:flex; gap:12px; align-items:center;">
          <div class="avatar">${tech?tech.letter:'؟'}</div>
          <div>
            <div style="font-weight:800;">${tech?tech.name:''}</div>
            <div class="subtle">${tech?tech.price:''}</div>
          </div>
        </div>
        <hr class="hr">
        <div class="ticket-row"><span>العنوان</span><b>${state.booking.address||'-'}</b></div>
        <div class="ticket-row"><span>الخدمة</span><b>${SERVICES.find(s=>s.id===state.booking.serviceId)?.name||'-'}</b></div>
        <hr class="hr">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700;">متوسط السعر التقريبي للخدمة</span>
          <span style="font-family:var(--disp); font-weight:900; font-size:22px; color:var(--brass);">~${avg} ج.م</span>
        </div>
        <div class="avg-note"><i class="fa-solid fa-circle-info"></i><span>هذا متوسط سعر عام لهذا النوع من الخدمة فقط. الأسطى سيحدد السعر الفعلي بعد مراجعة تفاصيل طلبك، وسيظهر لك السعر النهائي لتوافق عليه أو تتفاوض عليه قبل بدء العمل.</span></div>
      </div>
    </div>
    <div class="nav-row">
      <button class="btn btn-outline" onclick="goCustomer('location')"><i class="fa-solid fa-arrow-right"></i> رجوع</button>
      <button class="btn btn-primary" onclick="goCustomer('payment')">التالي: الدفع <i class="fa-solid fa-arrow-left"></i></button>
    </div>
  </div>`;
}

/* ---- Cancellation rule: no cancelling less than 3 hours before the execution time ---- */
const CANCEL_LOCK_HOURS = 3;
function orderStartTime(o){
  const t = new Date((o.date || '') + 'T' + (o.time || '11:00'));
  return isNaN(t) ? null : t;
}
function canCancelOrder(o){
  const t = orderStartTime(o);
  if(!t) return {ok:true};
  const diffH = (t.getTime() - Date.now()) / 3600000;
  return diffH >= CANCEL_LOCK_HOURS ? {ok:true} : {ok:false, hours:diffH};
}

/* ---- Confirmation dialog shown before the request is sent ---- */
function openBookingConsent(){
  if(document.getElementById('consentModal')) return;
  const m = document.createElement('div');
  m.id = 'consentModal'; m.className = 'consent-modal';
  m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','consentTitle');
  m.innerHTML = `<div class="consent-box">
    <h3 id="consentTitle"><i class="fa-solid fa-clipboard-check"></i> تأكيد إرسال طلب الخدمة</h3>
    <p class="subtle">يرجى مراجعة الإقرارات التالية والموافقة عليها قبل إرسال طلبك.</p>
    <label class="consent-item"><input type="checkbox" class="consent-cb"><span>أوافق على مشاركة بيانات التواصل والعنوان مع الفني المعيّن للطلب.</span></label>
    <label class="consent-item"><input type="checkbox" class="consent-cb"><span>أوافق على سياسة الإلغاء والتعديل.</span></label>
    <label class="consent-item"><input type="checkbox" class="consent-cb"><span>أُقرّ بأنه لا يحق للعميل إلغاء الطلب قبل موعد تنفيذ الخدمة بأقل من <b>3 ساعات</b>.</span></label>
    <div class="consent-actions">
      <button type="button" class="btn btn-outline" id="consentCancel">رجوع</button>
      <button type="button" class="btn btn-primary" id="consentOk" disabled><i class="fa-solid fa-paper-plane"></i> إرسال الطلب</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  const cbs = Array.from(m.querySelectorAll('.consent-cb')), ok = m.querySelector('#consentOk');
  const close = () => { m.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if(e.key==='Escape') close(); };
  document.addEventListener('keydown', onKey);
  cbs.forEach(c => c.addEventListener('change', () => { ok.disabled = !cbs.every(x => x.checked); }));
  m.querySelector('#consentCancel').addEventListener('click', close);
  m.addEventListener('click', e => { if(e.target === m) close(); });
  ok.addEventListener('click', () => { if(!cbs.every(x => x.checked)) return; close(); confirmBooking(); });
  cbs[0].focus();
}

function confirmBooking(){
  const tech = TECHNICIANS.find(t=>t.id===state.booking.techId);
  const svc = SERVICES.find(s=>s.id===state.booking.serviceId);
  // Guard against repeated confirmation (e.g. double click): once the draft is reset there is no tech/service.
  if(!tech || !svc) return;
  const id = 'OST-'+(1045+state.orders.length);
  const order = {
    id, customer:'أنت', service:svc.name, serviceIcon:svc.icon, techId:tech.id, techName:tech.name,
    status:'pending', estimatedPrice: state.booking.estimate, proposedPrice:null, price:null, date: state.booking.date || '2026-07-15', time: state.booking.time || '11:00', consent:{contact:true, policy:true, cancel3h:true, at:Date.now()}, address: state.booking.address,
    payment: state.booking.payment, promoCode: state.booking.promoCode||null, rating:null, review:null,
    attachments: ProblemPhotos.takeForOrder()   // images belong to this order only
  };
  if(state.booking.notes && state.booking.notes.trim()) order.notes = state.booking.notes.trim();
  state.orders.unshift(order);
  toast('تم إرسال طلبك إلى '+tech.name+' بانتظار الرد وتحديد السعر');
  state.booking = emptyBooking();
  goCustomer('tracking');
}
