function viewSupport(){
  return `
  <div class="view">
    <div class="page-head"><h1>الدعم الفني والمحادثة</h1><p>تواصل مع فريق الدعم أو مع الفني المسؤول عن طلبك، أو فاوضه على السعر مباشرة.</p></div>
    <div class="grid grid-2">
      <div class="chat-box">
        <div style="padding:12px 16px; border-bottom:1px solid var(--line); font-weight:700;"><i class="fa-solid fa-comments" style="color:var(--brass);"></i> محادثة مع الفني (كريم عبد الرحمن)</div>
        <div class="chat-msgs" id="chatMsgs">
          ${state.chat.map(m=>`<div class="msg ${m.from==='me'?'me':'them'}">${m.text}</div>`).join('')}
        </div>
        <div class="chat-input">
          <input id="chatInput" placeholder="اكتب رسالتك...">
          <button class="btn btn-primary btn-sm" onclick="sendChat()">إرسال</button>
        </div>
      </div>
      <div class="card">
        <div style="font-weight:800; margin-bottom:10px;">تواصل مع خدمة العملاء</div>
        <p class="subtle">متاحون على مدار الساعة لمساعدتك في أي مشكلة تخص الحجز أو الدفع أو الفنيين.</p>
        <div class="field" style="margin-top:14px;"><label>موضوع الشكوى أو الاستفسار</label><input placeholder="مثال: تأخر الفني عن الموعد"></div>
        <div class="field"><label>التفاصيل</label><textarea placeholder="اكتب تفاصيل المشكلة..."></textarea></div>
        <button class="btn btn-primary btn-block" onclick="toast('تم إرسال بلاغك لفريق الدعم، سنتواصل معك قريباً.')">إرسال إلى الدعم</button>
      </div>
    </div>
  </div>`;
}
function sendChat(){
  const inp = document.getElementById('chatInput');
  if(!inp.value.trim()) return;
  state.chat.push({from:'me', text:inp.value});
  inp.value='';
  render();
  setTimeout(()=>{ state.chat.push({from:'them', text:'تمام، وصلتني رسالتك 👍'}); render(); }, 900);
}

