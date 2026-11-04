/* Shared helpers */
function escapeHtml(v){
  return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function stars(rating){
  const full = Math.round(rating);
  let html = '<span class="stars">';
  for(let i=0;i<5;i++) html += `<i class="fa-solid fa-star" style="${i<full?'':'opacity:.28'}"></i>`;
  html += '</span>';
  return html;
}

function toast(msg){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className='toast';
  el.innerHTML = `<i class="fa-solid fa-bell"></i><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>el.remove(),300); }, 3200);
}
function svcIconHtml(id){
  const s = SERVICES.find(x=>x.id===id);
  return s ? `<i class="fa-solid ${s.icon}"></i>` : '';
}
function nowTime(){
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  const ap = h>=12 ? 'م':'ص';
  h = h%12; if(h===0) h=12;
  return h+':'+String(m).padStart(2,'0')+' '+ap;
}
