function viewAdminUsers(){
  const users = [
    {name:'سارة أحمد', type:'عميل', joined:'2026-02-11', status:'نشط'},
    {name:'كريم عبد الرحمن', type:'فني', joined:'2025-11-03', status:'نشط'},
    {name:'مصطفى علي', type:'عميل', joined:'2026-05-20', status:'نشط'},
    {name:'أحمد جمال', type:'فني', joined:'2025-09-14', status:'موقوف'},
  ];
  return `
  <div class="view">
    <div class="page-head"><h1>إدارة المستخدمين والفنيين</h1><p>عرض وإدارة جميع الحسابات المسجّلة على المنصة.</p></div>
    <table>
      <tr><th>الاسم</th><th>النوع</th><th>تاريخ الانضمام</th><th>الحالة</th><th>إجراء</th></tr>
      ${users.map(u=>`<tr>
        <td>${u.name}</td><td>${u.type}</td><td>${u.joined}</td>
        <td><span class="tag ${u.status==='نشط'?'tag-green':'tag-red'}">${u.status}</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="toast('تم تحديث حالة الحساب')">${u.status==='نشط'?'إيقاف':'تفعيل'}</button></td>
      </tr>`).join('')}
    </table>
  </div>`;
}

