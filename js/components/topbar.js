/* ============ SHELL RENDER ============ */
function renderTopbar(){
  const bellDot = document.getElementById('bellDot');
  let unread = 0;
  if(state.role==='customer') unread = state.notifications.customer.filter(n=>n.unread).length;
  if(state.role==='technician') unread = state.notifications.technician.filter(n=>n.unread).length;
  if(state.role==='admin') unread = state.pendingTechnicians.length + state.complaints.filter(c=>c.status==='open').length;
  bellDot.style.display = unread>0 ? 'flex':'none';
  bellDot.textContent = unread;

  const names = {customer:'حسابي', technician:'كريم عبد الرحمن', admin:'فريق الإدارة'};
  const icons = {customer:'fa-user', technician:'fa-screwdriver-wrench', admin:'fa-user-shield'};
  document.getElementById('profileName').textContent = names[state.role];
  document.getElementById('profileIc').innerHTML = `<i class="fa-solid ${icons[state.role]}"></i>`;
}

document.getElementById('bellBtn').onclick = ()=>{
  if(state.role==='customer') { state.customerView='notifications'; }
  if(state.role==='technician') { state.technicianView='notifications'; }
  if(state.role==='admin') { state.adminView='approvals'; }
  render();
};
function toggleProfileMenu(){
  const m = document.getElementById('profileMenu');
  m.style.display = m.style.display==='block' ? 'none' : 'block';
}
document.addEventListener('click', (e)=>{
  const wrap = document.querySelector('.profile-wrap');
  if(wrap && !wrap.contains(e.target)) document.getElementById('profileMenu').style.display='none';
});
function goProfileFromMenu(){
  document.getElementById('profileMenu').style.display='none';
  if(state.role==='technician'){ state.technicianView='profile'; }
  if(state.role==='customer'){ state.customerView='profile'; }
  if(state.role==='admin'){ state.adminView='dashboard'; }
  render();
}

