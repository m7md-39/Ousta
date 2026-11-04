function viewTechCurrent(){
  const o = state.orders.find(x=>x.techId==='t1' && ['accepted','on_the_way','in_progress'].includes(x.status));
  if(!o) return `<div class="view"><div class="empty"><div class="ic"><i class="fa-solid fa-circle-check"></i></div>لا يوجد طلب جارٍ حالياً.</div></div>`;
  const nextMap = {accepted:'on_the_way', on_the_way:'in_progress', in_progress:'completed'};
  const nextLabelMap = {accepted:'بدء التوجه (في الطريق)', on_the_way:'بدء العمل', in_progress:'إنهاء العمل (مكتمل)'};
  const nextIconMap = {accepted:'fa-route', on_the_way:'fa-screwdriver-wrench', in_progress:'fa-flag-checkered'};
  const meta = STATUS_META[o.status];
  const steps = [{k:'accepted',l:'تم التأكيد',ic:'fa-check'},{k:'on_the_way',l:'في الطريق',ic:'fa-route'},{k:'in_progress',l:'العمل جارٍ',ic:'fa-screwdriver-wrench'},{k:'completed',l:'اكتمل',ic:'fa-flag-checkered'}];
  const order2 = ['accepted','on_the_way','in_progress','completed'];
  const idx = order2.indexOf(o.status);
  return `
  <div class="view" style="height:100%; display:flex; flex-direction:column;">
    <div class="page-head"><h1>الطلب الحالي</h1><p>حدّث حالة العمل أولاً بأول ليتابعها العميل مباشرة.</p></div>

    <div style="background:linear-gradient(120deg, var(--ink), #2B2B2D); border-radius:20px; padding:26px 28px; color:#fff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div>
        <div style="font-family:var(--mono); font-size:13px; opacity:0.6; letter-spacing:1px;">${o.id}</div>
        <div style="font-family:var(--disp); font-weight:900; font-size:26px; display:flex; align-items:center; gap:10px; margin-top:4px;">
          <i class="fa-solid ${o.serviceIcon}" style="color:var(--brass);"></i> ${o.service} — ${o.customer}
        </div>
        <div style="opacity:0.75; margin-top:4px;"><i class="fa-solid fa-location-dot"></i> ${o.address}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-family:var(--disp); font-weight:900; font-size:32px; color:var(--brass);">${o.price} ج.م</div>
        <div style="opacity:0.7; font-size:12.5px;">السعر المتفق عليه</div>
      </div>
    </div>

    <div class="stepper" style="margin:28px 0 8px;">
      ${steps.map((s,i)=>`
        <div class="step ${i<idx?'done':''} ${i===idx?'current':''}">
          <div class="dot">${i<idx?'<i class="fa-solid fa-check"></i>':`<i class="fa-solid ${s.ic}"></i>`}</div>
          <div class="lbl">${s.l}</div>
        </div>`).join('')}
    </div>

    <div class="grid grid-2" style="margin-top:16px; flex:1;">
      <div class="card" style="display:flex; flex-direction:column; justify-content:center;">
        <div style="font-weight:800; margin-bottom:14px; font-size:16px;"><i class="fa-solid fa-circle-info" style="color:var(--brass);"></i> تفاصيل الطلب</div>
        <div class="ticket-row"><span>العميل</span><b>${o.customer}</b></div>
        <div class="ticket-row"><span>العنوان</span><b>${o.address}</b></div>
        <div class="ticket-row"><span>وسيلة الدفع</span><b>${o.payment}</b></div>
        ${ProblemPhotos.galleryHtml(o)}
        <div class="ticket-row"><span>الحالة الحالية</span><span class="tag ${meta.cls==='completed'?'tag-green':'tag-amber'}">${meta.label}</span></div>
        <div class="ticket-row"><span>السعر المتفق عليه</span><b style="color:var(--brass);">${o.price} ج.م</b></div>
      </div>
      <div class="card" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap:14px;">
        <div style="font-size:38px; color:var(--brass);"><i class="fa-solid ${nextMap[o.status]?nextIconMap[o.status]:'fa-circle-check'}"></i></div>
        <div style="font-weight:800; font-size:17px;">${nextMap[o.status] ? nextLabelMap[o.status] : 'تم إنجاز الطلب بنجاح'}</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
          ${nextMap[o.status] ? `<button class="btn btn-primary" onclick="advanceOrder('${o.id}')">${nextLabelMap[o.status]}</button>` : ''}
          <button class="btn btn-outline" onclick="goTech('chat')"><i class="fa-solid fa-comments"></i> مراسلة العميل</button>
        </div>
      </div>
    </div>
  </div>`;
}
function advanceOrder(id){
  const o = state.orders.find(x=>x.id===id);
  const nextMap = {accepted:'on_the_way', on_the_way:'in_progress', in_progress:'completed'};
  const labels = {on_the_way:'الفني في الطريق إليك الآن', in_progress:'بدأ الفني تنفيذ العمل', completed:'تم إنجاز الخدمة بنجاح'};
  o.status = nextMap[o.status];
  state.notifications.customer.unshift({id:Date.now(), text: labels[o.status]+' — طلب '+o.id, time:'الآن', unread:true});
  toast('تم تحديث حالة الطلب: '+STATUS_META[o.status].label);
  render();
}

