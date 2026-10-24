function viewServices(){
  return `
  <div class="view" style="height:100%; display:flex; flex-direction:column;">
    <div class="page-head">
      <h1>إيه الخدمة اللي محتاجها؟</h1>
      <p>اختَر نوع الصنعة عشان نلاقيلك أقرب أسطى موثوق في منطقتك، وهننقلك على طول لصفحة البحث.</p>
    </div>
    <div class="services-fill">
      ${SERVICES.map(s=>`
        <button class="service-tile ${state.booking.serviceId===s.id?'selected':''}" onclick="pickService('${s.id}')">
          <div class="service-emoji"><i class="fa-solid ${s.icon}"></i></div>
          <div class="service-name">${s.name}</div>
        </button>`).join('')}
    </div>
  </div>`;
}
function pickService(id){
  state.booking.serviceId = id;
  searchState.serviceFilter = id;
  state.customerView = 'search';
  render();
}

