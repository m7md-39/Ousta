/* ============ APP ENTRY ============ */
/* Authentication gate: the login screen is shown until a (demo) session exists.
   After login the user lands on the dashboard of their role (see js/auth.js). */
function render(){
  renderTopbar();
  if(state.role==='customer') renderCustomer();
  else if(state.role==='technician') renderTechnician();
  else if(state.role==='admin') renderAdmin();
}

initAuth();
