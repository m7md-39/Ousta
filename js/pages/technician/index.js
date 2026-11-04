/* ============ TECHNICIAN ============ */
const TECH_NAV = [
  {id:'profile', label:'الملف الشخصي', ic:'fa-id-card'},
  {id:'requests', label:'الطلبات الواردة', ic:'fa-inbox'},
  {id:'current', label:'الطلب الحالي', ic:'fa-truck-fast'},
  {id:'earnings', label:'الأرباح والسجل', ic:'fa-sack-dollar'},
  {id:'chat', label:'التواصل مع العميل', ic:'fa-comments'},
  {id:'notifications', label:'الإشعارات', ic:'fa-bell'},
];
function renderTechnician(){
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `<div class="side-eyebrow">حساب الأسطى</div>` + TECH_NAV.map(n=>`
    <button class="side-btn ${state.technicianView===n.id?'active':''}" onclick="goTech('${n.id}')">
      <span class="ic"><i class="fa-solid ${n.ic}"></i></span>${n.label}
    </button>`).join('');

  const c = document.getElementById('content');
  if(state.technicianView==='profile') c.innerHTML = viewTechProfile();
  else if(state.technicianView==='requests') c.innerHTML = viewTechRequests();
  else if(state.technicianView==='current') c.innerHTML = viewTechCurrent();
  else if(state.technicianView==='earnings') c.innerHTML = viewTechEarnings();
  else if(state.technicianView==='chat') c.innerHTML = viewTechChat();
  else if(state.technicianView==='notifications') c.innerHTML = viewTechNotifications();
}
function goTech(v){ state.technicianView=v; render(); }

