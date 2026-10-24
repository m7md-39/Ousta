/* ============ APP ENTRY ============ */
/* No authentication in this demo: the customer interface opens immediately,
   and the role switch in the top bar moves between the customer / technician / admin demos. */
function render(){
  renderTopbar();
  if(state.role==='customer') renderCustomer();
  else if(state.role==='technician') renderTechnician();
  else if(state.role==='admin') renderAdmin();
}

render();
