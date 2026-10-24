function notifIcon(text){
  if(text.includes('الطريق')) return 'fa-truck-fast';
  if(text.includes('قبول') || text.includes('تأكيد') || text.includes('وافق')) return 'fa-circle-check';
  if(text.includes('تقييم')) return 'fa-star';
  if(text.includes('سعر')) return 'fa-file-invoice-dollar';
  if(text.includes('أرباح') || text.includes('تحويل')) return 'fa-sack-dollar';
  if(text.includes('طلب جديد')) return 'fa-inbox';
  if(text.includes('اعتذر') || text.includes('رفض')) return 'fa-triangle-exclamation';
  return 'fa-bell';
}
function renderNotifCard(n, scope){
  const icon = notifIcon(n.text);
  const orderMatch = n.text.match(/OST-\d+/);
  const order = orderMatch ? state.orders.find(o=>o.id===orderMatch[0]) : null;
  return `
  <div class="card" style="margin-bottom:10px; cursor:pointer; transition:box-shadow .15s;" onclick="toggleNotif('${scope}',${n.id})">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
      <span style="display:flex; align-items:center; gap:8px;"><i class="fa-solid ${icon}" style="color:var(--brass); width:16px;"></i> ${n.text}</span>
      <div style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
        <span class="subtle">${n.time}</span>
        <i class="fa-solid fa-chevron-${n.open?'up':'down'}" style="color:#c9c9c9; font-size:12px;"></i>
      </div>
    </div>
    ${n.open ? `
    <div style="margin-top:12px; padding-top:12px; border-top:1px dashed var(--line); font-size:13.5px;">
      ${order ? `
        <div class="ticket-row"><span>رقم الطلب</span><b>${order.id}</b></div>
        <div class="ticket-row"><span>الخدمة</span><b>${order.service}</b></div>
        <div class="ticket-row"><span>الفني</span><b>${order.techName}</b></div>
        <div class="ticket-row"><span>الحالة</span><span class="tag ${order.status==='completed'?'tag-green':order.status==='rejected'?'tag-red':'tag-amber'}">${STATUS_META[order.status].label}</span></div>
        ${order.price?`<div class="ticket-row"><span>السعر</span><b>${order.price} ج.م</b></div>`:''}
        <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="event.stopPropagation(); ${scope==='customer'?"goCustomer('tracking')":`goTech('${['accepted','on_the_way','in_progress'].includes(order.status)?'current':'requests'}')`};">عرض الطلب بالتفصيل</button>
      ` : `<p class="subtle">لا توجد تفاصيل إضافية مرتبطة بهذا الإشعار حالياً.</p>`}
    </div>` : ''}
  </div>`;
}
function toggleNotif(scope,id){
  const list = scope==='customer' ? state.notifications.customer : state.notifications.technician;
  const n = list.find(x=>x.id===id);
  if(!n) return;
  n.open = !n.open;
  render();
}

