function viewAdminMonitor(){
  return `
  <div class="view">
    <div class="page-head"><h1>مراقبة الطلبات</h1><p>تابع كل الطلبات الجارية على المنصة لحظة بلحظة.</p></div>
    <table>
      <tr><th>رقم الطلب</th><th>العميل</th><th>الفني</th><th>الخدمة</th><th>الحالة</th><th>السعر</th></tr>
      ${state.orders.map(o=>`<tr>
        <td>${o.id}</td><td>${o.customer}</td><td>${o.techName}</td><td><i class="fa-solid ${o.serviceIcon}" style="color:var(--brass);"></i> ${o.service}</td>
        <td><span class="tag ${o.status==='completed'?'tag-green':o.status==='rejected'?'tag-red':'tag-amber'}">${STATUS_META[o.status].label}</span></td>
        <td>${o.price?o.price+' ج.م':'~'+o.estimatedPrice+' (متوسط)'}</td>
      </tr>`).join('')}
    </table>
  </div>`;
}

