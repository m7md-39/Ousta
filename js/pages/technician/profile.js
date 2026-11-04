function viewTechProfile(){
  const sub = state.techProfile.verifiedSub;
  return `
  <div class="view">
    <div class="page-head"><h1>الملف الشخصي</h1><p>بيانات ملفك تظهر للعملاء عند البحث عن فني.</p></div>
    <div class="grid grid-2">
      <div class="card">
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:18px;">
          <div style="position:relative;">
            <div style="width:82px; height:82px; border-radius:50%; overflow:hidden; background:var(--ink); display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow);">
              ${state.techProfile.photo
                ? `<img src="${state.techProfile.photo}" style="width:100%; height:100%; object-fit:cover;">`
                : `<span style="color:#fff; font-family:var(--disp); font-weight:800; font-size:28px;">ك</span>`}
            </div>
            <label for="techPhotoInput" style="position:absolute; bottom:-2px; left:-2px; width:30px; height:30px; border-radius:50%; background:var(--brass); color:#fff; display:flex; align-items:center; justify-content:center; border:2px solid #fff; cursor:pointer; font-size:12px;">
              <i class="fa-solid fa-camera"></i>
            </label>
            <input type="file" id="techPhotoInput" accept="image/*" style="display:none;" onchange="uploadTechPhoto(this)">
          </div>
          <div>
            <div style="font-weight:800; font-size:16px;">كريم عبد الرحمن</div>
            <div class="subtle">اضغط على أيقونة الكاميرا لرفع صورة شخصية جديدة</div>
          </div>
        </div>
        <div class="field"><label>الاسم الكامل</label><input value="كريم عبد الرحمن"></div>
        <div class="field"><label>التخصص</label>
          <select><option>كهرباء</option><option>سباكة</option><option>تكييف وتبريد</option><option>دهانات</option><option>نجارة</option></select>
        </div>
        <div class="field"><label>سنوات الخبرة</label><input value="9"></div>
        <div class="field"><label>نبذة مختصرة</label><textarea>فني كهرباء معتمد، خبرة 9 سنوات في الأعطال المنزلية والتمديدات.</textarea></div>
        <button class="btn btn-primary" onclick="toast('تم حفظ التعديلات على ملفك الشخصي')">حفظ التعديلات</button>
      </div>
      <div class="card">
        <div style="font-weight:800; margin-bottom:10px;">الشهادات والتراخيص</div>
        <p class="subtle">ارفع صور الشهادات أو رخصة مزاولة المهنة لزيادة ثقة العملاء وتوثيق حسابك.</p>
        <div style="border:2px dashed var(--line); border-radius:12px; padding:26px; text-align:center; margin-top:12px;" onclick="toast('تم رفع الملف بنجاح، بانتظار مراجعة الإدارة')">
          <div style="font-size:24px; color:var(--brass);"><i class="fa-solid fa-paperclip"></i></div>
          <div class="subtle" style="margin-top:6px;">اضغط لرفع صورة الشهادة (PDF أو JPG)</div>
        </div>
        <hr class="hr">
        <div style="font-weight:800; margin-bottom:8px;">حالة التوفر</div>
        <div class="toggle-row" style="border-bottom:none;"><span>متاح لاستقبال طلبات جديدة</span><div class="switch on" onclick="this.classList.toggle('on')"></div></div>
        <hr class="hr">
        <div style="border:1.5px solid ${sub?'var(--green)':'var(--brass)'}; border-radius:14px; padding:16px; background:${sub?'rgba(29,184,106,0.06)':'#FFF7F0'};">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div>
              <div style="font-weight:800; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-shield-halved" style="color:${sub?'var(--green)':'var(--brass)'};"></i>
                اشتراك علامة التوثيق
              </div>
              <p class="subtle" style="margin-top:4px;">فعّل العلامة الزرقاء ✅ بجانب اسمك في نتائج البحث ليثق بك العملاء أكثر ويفضّلوك عن غيرك.</p>
            </div>
            <span class="tag ${sub?'tag-green':'tag-amber'}">${sub?'مفعّل':'غير مفعّل'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-family:var(--disp); font-weight:900; font-size:22px; color:var(--brass);">50 <span style="font-size:13px; font-weight:700; color:#7a7a7a;">ج.م / شهرياً</span></span>
            <button class="btn ${sub?'btn-outline':'btn-primary'} btn-sm" onclick="toggleVerifiedSub()">
              ${sub?'إلغاء الاشتراك':'اشترك الآن وفعّل التوثيق'}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
function uploadTechPhoto(input){
  const file = input.files && input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{ state.techProfile.photo = e.target.result; toast('تم تحديث صورتك الشخصية'); render(); };
  reader.readAsDataURL(file);
}
function toggleVerifiedSub(){
  state.techProfile.verifiedSub = !state.techProfile.verifiedSub;
  toast(state.techProfile.verifiedSub ? 'تم تفعيل اشتراك التوثيق — 50 ج.م/شهرياً' : 'تم إلغاء اشتراك التوثيق');
  render();
}

