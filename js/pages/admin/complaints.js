function viewAdminComplaints(){
  return `
  <div class="view">
    <div class="page-head"><h1>إدارة الشكاوى</h1><p>راجع بلاغات العملاء والفنيين واتخذ الإجراء المناسب.</p></div>
    ${state.complaints.length===0? `<div class="empty"><div class="ic"><i class="fa-solid fa-circle-check"></i></div>لا توجد شكاوى مفتوحة.</div>` : state.complaints.map(c=>`
      <div class="card" style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between;">
          <div style="font-weight:800;">${c.id} — من ${c.from}</div>
          <span class="tag ${c.status==='open'?'tag-amber':'tag-green'}">${c.status==='open'?'مفتوحة':'تم الحل'}</span>
        </div>
        <div class="subtle" style="margin:6px 0;">بخصوص: ${c.about}</div>
        <p style="font-size:14px;">${c.text}</p>
        ${c.status==='open' ? `<button class="btn btn-success btn-sm" onclick="resolveComplaint('${c.id}')">تحديد كمحلولة</button>` : ''}
      </div>`).join('')}
  </div>`;
}
function resolveComplaint(id){ state.complaints.find(c=>c.id===id).status='resolved'; toast('تم تحديد الشكوى كمحلولة'); render(); }

