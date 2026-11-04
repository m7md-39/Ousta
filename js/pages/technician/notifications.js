function viewTechNotifications(){
  state.notifications.technician.forEach(n=>n.unread=false);
  return `
  <div class="view">
    <div class="page-head"><h1>الإشعارات</h1><p>اضغط على أي إشعار لعرض التفاصيل الكاملة.</p></div>
    ${state.notifications.technician.map(n=>renderNotifCard(n,'technician')).join('')}
  </div>`;
}

