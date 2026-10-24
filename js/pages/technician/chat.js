function viewTechChat(){
  const chats = [...state.techChats].sort((a,b)=> (b.unread>0)-(a.unread>0));
  const active = state.techChats.find(c=>c.id===state.activeChatId);
  return `
  <div class="view">
    <div class="page-head"><h1>التواصل مع العملاء</h1><p>عدة عملاء بيكلموك دلوقتي — اختَر المحادثة اللي عايز تدخلها.</p></div>
    <div class="wa-shell">
      <div class="wa-list">
        <div class="wa-list-head"><span><i class="fa-solid fa-comments"></i> المحادثات</span><span class="tag" style="background:rgba(255,255,255,0.15); color:#fff;">${state.techChats.filter(c=>c.unread>0).length} جديد</span></div>
        <div class="wa-list-search"><input placeholder="بحث عن عميل..."><i class="fa-solid fa-magnifying-glass"></i></div>
        ${chats.map(c=>{
          const last = c.messages[c.messages.length-1];
          return `
          <div class="wa-chat-item ${state.activeChatId===c.id?'active':''}" onclick="selectTechChat('${c.id}')">
            <div class="wa-avatar">${c.letter}${c.online?'<span class="dot-online"></span>':''}</div>
            <div class="wa-meta">
              <div class="wa-name-row"><span class="wa-name">${c.name}</span><span class="wa-time">${last?last.time:''}</span></div>
              <div class="wa-row2">
                <span class="wa-preview">${last?(last.from==='me'?'أنت: ':'')+last.text:'لا توجد رسائل بعد'}</span>
                ${c.unread>0?`<span class="wa-unread">${c.unread}</span>`:''}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="wa-panel">
        ${!active ? `
        <div class="wa-empty"><i class="fa-solid fa-comments"></i><div>اختَر محادثة من القائمة عشان تبدأ الرد على العميل</div></div>
        ` : `
        <div class="wa-panel-head">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="wa-avatar" style="width:38px; height:38px; font-size:14px;">${active.letter}${active.online?'<span class="dot-online"></span>':''}</div>
            <div>
              <div style="font-weight:800; font-size:14.5px;">${active.name}</div>
              <div class="subtle" style="font-size:12px;">${active.online?'متصل الآن':'غير متصل'} ${active.orderId?(' · طلب '+active.orderId):''}</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="goTech('current')"><i class="fa-solid fa-clipboard-list"></i> تفاصيل الطلب</button>
        </div>
        <div class="wa-panel-msgs" id="waMsgs">
          ${active.messages.map(m=>`<div class="wa-msg ${m.from==='me'?'me':'them'}">${m.text}<span class="wa-msg-time">${m.time||''}</span></div>`).join('')}
        </div>
        <div class="wa-panel-input">
          <input id="waInput" placeholder="اكتب رسالة للعميل..." onkeydown="if(event.key==='Enter') sendTechChatMsg()">
          <button class="wa-send-btn" onclick="sendTechChatMsg()"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
        `}
      </div>
    </div>
  </div>`;
}
function selectTechChat(id){
  state.activeChatId = id;
  const c = state.techChats.find(x=>x.id===id);
  if(c) c.unread = 0;
  render();
  setTimeout(()=>{ const box=document.getElementById('waMsgs'); if(box) box.scrollTop = box.scrollHeight; }, 30);
}
function sendTechChatMsg(){
  const inp = document.getElementById('waInput');
  if(!inp || !inp.value.trim()) return;
  const c = state.techChats.find(x=>x.id===state.activeChatId);
  if(!c) return;
  c.messages.push({from:'me', text:inp.value, time:nowTime()});
  inp.value='';
  render();
  setTimeout(()=>{ const box=document.getElementById('waMsgs'); if(box) box.scrollTop = box.scrollHeight; }, 30);
  setTimeout(()=>{
    c.messages.push({from:'them', text:'تمام يا أسطى، شكراً على الرد 🙏', time:nowTime()});
    if(state.activeChatId!==c.id) c.unread++;
    render();
  }, 1100);
}

