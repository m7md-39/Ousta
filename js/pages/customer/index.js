/* ============ CUSTOMER ============ */
const CUSTOMER_NAV = [
  {id:'services', label:'اختيار الخدمة', ic:'fa-list-check'},
  {id:'search', label:'البحث عن فني', ic:'fa-magnifying-glass'},
  {id:'tracking', label:'تتبع الطلب', ic:'fa-location-dot'},
  {id:'history', label:'سجل الطلبات', ic:'fa-clock-rotate-left'},
  {id:'notifications', label:'الإشعارات', ic:'fa-bell'},
  {id:'support', label:'الدعم والمحادثة', ic:'fa-headset'},
  {id:'profile', label:'حسابي', ic:'fa-id-card'},
];

function renderCustomer(){
  const sb = document.getElementById('sidebar');
  sb.innerHTML = `<div class="side-eyebrow">حساب العميل</div>` + CUSTOMER_NAV.map(n=>`
    <button class="side-btn ${state.customerView===n.id?'active':''}" onclick="goCustomer('${n.id}')">
      <span class="ic"><i class="fa-solid ${n.ic}"></i></span>${n.label}
    </button>`).join('');

  const c = document.getElementById('content');
  if(state.customerView==='services') c.innerHTML = viewServices();
  else if(state.customerView==='search') c.innerHTML = viewSearch();
  else if(state.customerView==='location'){ c.innerHTML = viewLocation(); setTimeout(initLocationMap, 30); }
  else if(state.customerView==='booking') c.innerHTML = viewBooking();
  else if(state.customerView==='payment') c.innerHTML = viewPayment();
  else if(state.customerView==='tracking') c.innerHTML = viewTracking();
  else if(state.customerView==='history') c.innerHTML = viewHistory();
  else if(state.customerView==='notifications') c.innerHTML = viewNotificationsCustomer();
  else if(state.customerView==='support') c.innerHTML = viewSupport();
  else if(state.customerView==='profile') c.innerHTML = viewCustomerProfile();
}
function goCustomer(v){ state.customerView=v; render(); }

