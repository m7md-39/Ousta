function viewPayment(){
  const tech = TECHNICIANS.find(t=>t.id===state.booking.techId);
  const svc = SERVICES.find(s=>s.id===state.booking.serviceId);
  const est = state.booking.estimate || 150;
  let discountAmt = 0;
  const promo = state.booking.promoCode ? VALID_PROMOS[state.booking.promoCode] : null;
  if(promo) discountAmt = promo.type==='percent' ? Math.round(est*promo.value/100) : promo.value;
  const finalEst = Math.max(est - discountAmt, 0);

  return `
  <div class="view">
    <div class="page-head">
      <h1>طريقة الدفع</h1>
      <p>اختر الطريقة المناسبة لك. لن يُخصم أي مبلغ إلا بعد موافقتك على السعر النهائي الذي يحدده الأسطى.</p>
    </div>
    <div class="grid grid-2">
      <div>
        <div class="section-title" style="margin-top:0;"><span class="bar"></span>اختر وسيلة الدفع</div>
        <div class="grid grid-2">
          <button class="service-tile ${state.booking.payment==='كاش'?'selected':''}" onclick="setPay('كاش')">
            <div class="service-emoji"><i class="fa-solid fa-money-bill-wave"></i></div><div class="service-name">كاش عند الاستلام</div>
          </button>
          <button class="service-tile ${state.booking.payment==='إلكتروني'?'selected':''}" onclick="setPay('إلكتروني')">
            <div class="service-emoji"><i class="fa-solid fa-credit-card"></i></div><div class="service-name">بطاقة / محفظة إلكترونية</div>
          </button>
        </div>
        ${state.booking.payment==='إلكتروني' ? `
        <div class="card" style="margin-top:16px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
            <i class="fa-brands fa-cc-visa" style="font-size:26px; color:#1a1f71;"></i>
            <i class="fa-brands fa-cc-mastercard" style="font-size:26px; color:#eb001b;"></i>
            <span class="subtle">بياناتك مشفّرة وآمنة تماماً</span>
          </div>
          <div class="field"><label>رقم البطاقة</label><input placeholder="•••• •••• •••• 4521"></div>
          <div class="grid grid-2">
            <div class="field"><label>تاريخ الانتهاء</label><input placeholder="MM/YY"></div>
            <div class="field"><label>CVV</label><input placeholder="•••"></div>
          </div>
        </div>` : `
        <div class="avg-note" style="margin-top:14px;"><i class="fa-solid fa-circle-info"></i><span>هتدفع كاش للأسطى مباشرة بعد ما يخلص شغله ويتفقوا سوا على السعر النهائي.</span></div>
        `}

        <div class="section-title"><span class="bar"></span>عندك كود خصم؟</div>
        <div class="card">
          <div style="display:flex; gap:10px; align-items:flex-end;">
            <div class="field" style="margin-bottom:0; flex:1;">
              <label><i class="fa-solid fa-ticket"></i> كود البرومو</label>
              <input id="promoInput" placeholder="مثال: OUSTA10" value="${state.booking.promoCode||''}" style="text-transform:uppercase;">
            </div>
            <button class="btn btn-outline" onclick="applyPromo()">تفعيل الكود</button>
          </div>
          ${promo ? `<div class="tag tag-green" style="margin-top:12px;"><i class="fa-solid fa-circle-check"></i> ${promo.label} — وفّرت ${discountAmt} ج.م</div>`
                  : `<div class="subtle" style="margin-top:10px;">جرّب: <b>OUSTA10</b> أو <b>WELCOME50</b> أو <b>AUSTA20</b></div>`}
        </div>
      </div>

      <div>
        <div class="section-title" style="margin-top:0;"><span class="bar"></span>ملخص الطلب</div>
        <div class="card">
          <div style="display:flex; gap:12px; align-items:center;">
            <div class="avatar">${tech?tech.letter:'؟'}</div>
            <div>
              <div style="font-weight:800;">${tech?tech.name:''} ${tech&&tech.verified?'<i class="fa-solid fa-circle-check" style="color:var(--green); font-size:13px;"></i>':''}</div>
              <div class="subtle">${svc?svc.name:''} ${tech?('· '+stars(tech.rating)):''}</div>
            </div>
          </div>
          <hr class="hr">
          <div class="ticket-row"><span><i class="fa-solid fa-location-dot" style="color:var(--brass);"></i> العنوان</span><b>${state.booking.address||'-'}</b></div>
          <div class="ticket-row"><span><i class="fa-solid fa-calendar" style="color:var(--brass);"></i> الموعد</span><b>${state.booking.date||'2026-07-15'} — ${state.booking.time||'11:00'}</b></div>
          <hr class="hr">
          <div class="ticket-row"><span>متوسط سعر الخدمة</span><b>${est} ج.م</b></div>
          ${promo ? `<div class="ticket-row"><span style="color:var(--green);">خصم الكود (${state.booking.promoCode})</span><b style="color:var(--green);">− ${discountAmt} ج.م</b></div>` : ''}
          <div class="hr" style="border-top:1.5px dashed var(--line);"></div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:800;">الإجمالي التقريبي</span>
            <span style="font-family:var(--disp); font-weight:900; font-size:24px; color:var(--brass);">${finalEst} ج.م</span>
          </div>
          <div class="avg-note" style="margin-top:12px;"><i class="fa-solid fa-shield-halved"></i><span>السعر النهائي الفعلي بيحدده الأسطى حسب حجم الشغل، وهيتطبّق عليه نفس الخصم لو الكود سارٍ.</span></div>
        </div>
      </div>
    </div>

    <div class="nav-row">
      <button class="btn btn-outline" onclick="goCustomer('booking')"><i class="fa-solid fa-arrow-right"></i> رجوع</button>
      <button class="btn btn-primary" ${!state.booking.payment?'disabled':''} onclick="confirmBooking()">تأكيد الحجز <i class="fa-solid fa-check"></i></button>
    </div>
  </div>`;
}
function setPay(p){ state.booking.payment=p; render(); }
function applyPromo(){
  const v = (document.getElementById('promoInput').value||'').trim().toUpperCase();
  if(!v){ toast('اكتب كود الخصم أولاً'); return; }
  if(VALID_PROMOS[v]){ state.booking.promoCode = v; toast('تم تفعيل الكود: '+VALID_PROMOS[v].label); }
  else { state.booking.promoCode = null; toast('الكود غير صالح أو منتهي'); }
  render();
}

