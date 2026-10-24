function viewAdminServices(){
  return `
  <div class="view">
    <div class="page-head"><h1>إدارة الخدمات ومتوسطات الأسعار</h1><p>تحكم في قائمة الخدمات المتاحة ومتوسط السعر الاسترشادي لكل منها (السعر النهائي دائماً بيد الفني).</p></div>
    <table>
      <tr><th>الخدمة</th><th>متوسط السعر الاسترشادي</th><th>الحالة</th><th>إجراء</th></tr>
      ${state.servicePrices.map(s=>`<tr>
        <td><i class="fa-solid ${SERVICES.find(x=>x.id===s.id).icon}" style="color:var(--brass);"></i> ${s.name}</td>
        <td><input style="width:100px; padding:6px 8px; border:1px solid var(--line); border-radius:8px;" value="${s.base}"> ج.م</td>
        <td><span class="tag tag-green">مفعّلة</span></td>
        <td><button class="btn btn-ghost btn-sm" onclick="toast('تم حفظ متوسط السعر الجديد لخدمة ${s.name}')">حفظ</button></td>
      </tr>`).join('')}
    </table>
    <button class="btn btn-outline" style="margin-top:14px;" onclick="toast('يمكنك إضافة خدمة جديدة من هنا')"><i class="fa-solid fa-plus"></i> إضافة خدمة جديدة</button>
  </div>`;
}

