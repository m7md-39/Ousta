function viewAdminDashboard(){
  const bars = [40,65,52,80,71,90,60];
  const days = ['سبت','أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة'];
  return `
  <div class="view">
    <div class="page-head"><h1>لوحة الإحصائيات</h1><p>نظرة عامة على أداء المنصة.</p></div>
    <div class="grid grid-4">
      <div class="stat-card"><div class="num">1,284</div><div class="lbl">إجمالي المستخدمين</div></div>
      <div class="stat-card"><div class="num">312</div><div class="lbl">فني نشط</div></div>
      <div class="stat-card"><div class="num">${state.orders.length+96}</div><div class="lbl">طلب هذا الشهر</div></div>
      <div class="stat-card"><div class="num">4.7 <i class="fa-solid fa-star" style="color:var(--amber); font-size:20px;"></i></div><div class="lbl">متوسط رضا العملاء</div></div>
    </div>
    <div class="section-title"><span class="bar"></span>الطلبات خلال الأسبوع</div>
    <div class="card">
      <div class="bar-chart">
        ${bars.map((b,i)=>`<div class="col"><div class="bar" style="height:${b}%"></div><div class="bar-lbl">${days[i]}</div></div>`).join('')}
      </div>
    </div>
    <div class="grid grid-2" style="margin-top:16px;">
      <div class="card">
        <div style="font-weight:800; margin-bottom:10px;">الطلبات حسب الخدمة</div>
        ${SERVICES.map(s=>`<div class="ticket-row"><span><i class="fa-solid ${s.icon}" style="color:var(--brass); width:16px;"></i> ${s.name}</span><b>${Math.floor(Math.random()*40+10)} طلب</b></div>`).join('')}
      </div>
      <div class="card">
        <div style="font-weight:800; margin-bottom:10px;">تنبيهات تحتاج إجراء</div>
        <div class="ticket-row"><span><i class="fa-solid fa-triangle-exclamation" style="color:var(--amber);"></i> فنيون بانتظار المراجعة</span><b>${state.pendingTechnicians.length}</b></div>
        <div class="ticket-row"><span><i class="fa-solid fa-receipt" style="color:var(--red);"></i> شكاوى مفتوحة</span><b>${state.complaints.filter(c=>c.status==='open').length}</b></div>
        <div class="ticket-row"><span><i class="fa-solid fa-clock" style="color:#9a9a9a;"></i> طلبات معلّقة</span><b>${state.orders.filter(o=>o.status==='pending').length}</b></div>
      </div>
    </div>
  </div>`;
}

