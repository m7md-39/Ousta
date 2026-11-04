function viewAdminBroadcast(){
  return `
  <div class="view">
    <div class="page-head"><h1>إرسال إشعارات جماعية</h1><p>أرسل رسالة لكل العملاء أو كل الفنيين دفعة واحدة.</p></div>
    <div class="card" style="max-width:560px;">
      <div class="field"><label>الفئة المستهدفة</label>
        <select id="bcTarget"><option>كل العملاء</option><option>كل الفنيين</option><option>الجميع</option></select>
      </div>
      <div class="field"><label>نص الإشعار</label><textarea id="bcText" placeholder="مثال: عرض خصم 20% على خدمات الصيانة هذا الأسبوع"></textarea></div>
      <button class="btn btn-primary btn-block" onclick="sendBroadcast()">إرسال الإشعار</button>
    </div>
  </div>`;
}
function sendBroadcast(){
  const target = document.getElementById('bcTarget').value;
  const text = document.getElementById('bcText').value || 'إشعار جديد من إدارة أسطى';
  if(target!=='كل الفنيين') state.notifications.customer.unshift({id:Date.now(), text, time:'الآن', unread:true});
  if(target!=='كل العملاء') state.notifications.technician.unshift({id:Date.now(), text, time:'الآن', unread:true});
  toast('تم إرسال الإشعار إلى: '+target);
  document.getElementById('bcText').value='';
}

