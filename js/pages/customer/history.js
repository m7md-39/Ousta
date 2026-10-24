function viewHistory(){
  const myOrders = state.orders.filter(o=>o.customer==='أنت' || o.customer==='سارة أحمد');
  return `
  <div class="view">
    <div class="page-head"><h1>سجل الطلبات السابقة</h1><p>كل طلباتك مع تفاصيلها وتقييماتك.</p></div>
    ${myOrders.map(o=>{
      const meta = STATUS_META[o.status];
      return `<div class="ticket">
        <div class="ticket-head">
          <div><div class="ticket-id">${o.id}</div><div class="ticket-service"><i class="fa-solid ${o.serviceIcon}"></i> ${o.service}</div></div>
          <div class="stamp ${meta.cls}">${meta.label}</div>
        </div>
        <div class="ticket-row"><span>الفني</span><b>${o.techName}</b></div>
        <div class="ticket-row"><span>التاريخ</span><b>${o.date}</b></div>
        ${ProblemPhotos.galleryHtml(o)}
        <div class="ticket-row"><span>السعر النهائي</span><b>${o.price?o.price+' ج.م':'—'}</b></div>
        ${o.rating?`<div class="ticket-row"><span>تقييمك</span><b>${stars(o.rating)}</b></div>`:''}
      </div>`;
    }).join('')}
  </div>`;
}

