/* ============ PAGE ENTRY ============
   Every app page declares <body data-role="customer|technician|admin" data-view="...">.
   Route guard: no session -> login.html; wrong role -> that role's own home page. */
function render(){
  renderTopbar();
  if(state.role==='customer') renderCustomer();
  else if(state.role==='technician') renderTechnician();
  else if(state.role==='admin') renderAdmin();
  saveState();
}

(function boot(){
  const role = document.body.dataset.role, view = document.body.dataset.view;
  const s = getSession();
  if(!s){ location.replace(siteUrl('login.html')); return; }
  if(s.role !== role){ location.replace(siteUrl(ROLE_HOME[s.role])); return; }
  loadState();
  state.role = role;
  state[role + 'View'] = view;
  render();
  window.addEventListener('pagehide', saveState);
})();
