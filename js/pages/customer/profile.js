function viewCustomerProfile(){
  return `
  <div class="view">
    <div class="page-head"><h1>حسابي</h1><p>بيانات حسابك كعميل على منصة Ousta.</p></div>
    <div class="card" style="max-width:520px;">
      <div class="field"><label>الاسم الكامل</label><input value="أنت"></div>
      <div class="field"><label>رقم الموبايل</label><input value="010xxxxxxx"></div>
      <div class="field"><label>العنوان الافتراضي</label><input value="كفر الدوار، البحيرة"></div>
      <button class="btn btn-primary" onclick="toast('تم حفظ بيانات حسابك')">حفظ التعديلات</button>
    </div>
  </div>`;
}

