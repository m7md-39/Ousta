function viewAdminApprovals(){
  return `
  <div class="view">
    <div class="page-head"><h1>مراجعة طلبات انضمام الفنيين</h1><p>راجع الشهادات والبيانات قبل الموافقة على انضمام الفني للمنصة.</p></div>
    ${state.pendingTechnicians.length===0 ? `<div class="empty"><div class="ic"><i class="fa-solid fa-circle-check"></i></div>لا توجد طلبات معلّقة.</div>` : state.pendingTechnicians.map(p=>`
      <div class="card" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-weight:800;">${p.name} — <span class="subtle">${SERVICES.find(s=>s.id===p.service)?.name}</span></div>
          <div class="subtle"><i class="fa-solid fa-phone"></i> ${p.phone} &nbsp;·&nbsp; <i class="fa-solid fa-paperclip"></i> ${p.cert} &nbsp;·&nbsp; تاريخ التقديم: ${p.date}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-success btn-sm" onclick="approveTech('${p.id}')">موافقة</button>
          <button class="btn btn-danger btn-sm" onclick="rejectTech('${p.id}')">رفض</button>
        </div>
      </div>`).join('')}
  </div>`;
}
function approveTech(id){ state.pendingTechnicians = state.pendingTechnicians.filter(p=>p.id!==id); toast('تمت الموافقة على الفني وتفعيل حسابه'); render(); }
function rejectTech(id){ state.pendingTechnicians = state.pendingTechnicians.filter(p=>p.id!==id); toast('تم رفض طلب الانضمام'); render(); }

