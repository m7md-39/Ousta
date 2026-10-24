function viewTechEarnings(){
  const myOrders = state.orders.filter(o=>o.techId==='t1').sort((a,b)=> new Date(b.date) - new Date(a.date));
  const total = myOrders.filter(o=>o.status==='completed').reduce((a,b)=>a+(b.price||0),0) + 640;
  return `
  <div class="view">
    <div class="page-head"><h1>الأرباح وسجل الطلبات</h1><p>ملخص أرباحك وسجل تنفيذ الطلبات.</p></div>
    <div class="grid grid-3">
      <div class="stat-card"><div class="num">${total} ج.م</div><div class="lbl">إجمالي الأرباح هذا الشهر</div></div>
      <div class="stat-card"><div class="num">${myOrders.length+18}</div><div class="lbl">عدد الطلبات المنفذة</div></div>
      <div class="stat-card"><div class="num">4.9 <i class="fa-solid fa-star" style="color:var(--amber); font-size:20px;"></i></div><div class="lbl">متوسط تقييم العملاء</div></div>
    </div>
    <div class="section-title"><span class="bar"></span>سجل الطلبات</div>
    <table>
      <tr><th>رقم الطلب</th><th>العميل</th><th>الحالة</th><th>السعر</th><th>التاريخ</th></tr>
      ${myOrders.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td><span class="tag ${o.status==='completed'?'tag-green':'tag-amber'}">${STATUS_META[o.status].label}</span></td><td>${o.price?o.price+' ج.م':'—'}</td><td>${o.date}</td></tr>`).join('')}
    </table>
  </div>`;
}

