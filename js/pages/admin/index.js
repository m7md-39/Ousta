/* ============ ADMIN ============ */
const ADMIN_NAV = [
  {id:'dashboard', label:'لوحة الإحصائيات', ic:'fa-chart-line'},
  {id:'users', label:'إدارة المستخدمين', ic:'fa-users'},
  {id:'approvals', label:'مراجعة الفنيين', ic:'fa-user-check'},
  {id:'services', label:'الخدمات والأسعار', ic:'fa-tags'},
  {id:'monitor', label:'مراقبة الطلبات', ic:'fa-receipt'},
  {id:'complaints', label:'إدارة الشكاوى', ic:'fa-triangle-exclamation'},
  {id:'broadcast', label:'إشعارات جماعية', ic:'fa-bullhorn'},
];
function renderAdmin(){
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `<div class="side-eyebrow">لوحة الإدارة</div>` + ADMIN_NAV.map(n=>`
    <button class="side-btn ${state.adminView===n.id?'active':''}" onclick="goAdmin('${n.id}')">
      <span class="ic"><i class="fa-solid ${n.ic}"></i></span>${n.label}
    </button>`).join('');

  const c = document.getElementById('content');
  if(state.adminView==='dashboard') c.innerHTML = viewAdminDashboard();
  else if(state.adminView==='users') c.innerHTML = viewAdminUsers();
  else if(state.adminView==='approvals') c.innerHTML = viewAdminApprovals();
  else if(state.adminView==='services') c.innerHTML = viewAdminServices();
  else if(state.adminView==='monitor') c.innerHTML = viewAdminMonitor();
  else if(state.adminView==='complaints') c.innerHTML = viewAdminComplaints();
  else if(state.adminView==='broadcast') c.innerHTML = viewAdminBroadcast();
}
function goAdmin(v){ state.adminView=v; render(); }

