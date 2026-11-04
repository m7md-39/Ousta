function viewNotificationsCustomer(){
  state.notifications.customer.forEach(n=>n.unread=false);
  return `
  <div class="view">
    <div class="page-head"><h1>الإشعارات</h1><p>اضغط على أي إشعار لعرض التفاصيل الكاملة.</p></div>
    ${state.notifications.customer.map(n=>renderNotifCard(n,'customer')).join('')}
  </div>`;
}
