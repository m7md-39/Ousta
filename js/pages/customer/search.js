function viewSearch(){
  if(state.booking.serviceId && searchState.serviceFilter==='all') searchState.serviceFilter = state.booking.serviceId;
  const govs = [...new Set(TECHNICIANS.map(t=>t.gov))];
  let list = TECHNICIANS.filter(t=> searchState.serviceFilter==='all' ? true : t.service===searchState.serviceFilter);
  if(searchState.gov!=='all') list = list.filter(t=>t.gov===searchState.gov);

  const sortLabels = {rating:'الأعلى تقييماً', price:'الأقل سعراً', distance:'الأقرب لموقعك', speed:'الأسرع في الإنجاز'};
  if(searchState.sort==='price') list = [...list].sort((a,b)=>a.priceFrom-b.priceFrom);
  else if(searchState.sort==='distance') list = [...list].sort((a,b)=>a.distance-b.distance);
  else if(searchState.sort==='speed') list = [...list].sort((a,b)=>a.completion-b.completion);
  else list = [...list].sort((a,b)=>b.rating-a.rating);

  const activeSvc = SERVICES.find(s=>s.id===searchState.serviceFilter);

  return `
  <div class="view">
    <div class="page-head">
      <h1>الفنيون المتاحون ${activeSvc?('في تخصص '+activeSvc.name):''}</h1>
      <p>${list.length} فني متاح — مرتبين حسب: ${sortLabels[searchState.sort]}</p>
    </div>

    <div class="card" style="margin-bottom:18px;">
      <div class="grid grid-3">
        <div class="field" style="margin-bottom:0;">
          <label><i class="fa-solid fa-arrow-down-wide-short"></i> ترتيب حسب</label>
          <select onchange="setSearchSort(this.value)">
            <option value="rating" ${searchState.sort==='rating'?'selected':''}>الأعلى تقييماً</option>
            <option value="price" ${searchState.sort==='price'?'selected':''}>الأقل سعراً</option>
            <option value="distance" ${searchState.sort==='distance'?'selected':''}>الأقرب لموقعك</option>
            <option value="speed" ${searchState.sort==='speed'?'selected':''}>الأسرع في الإنجاز</option>
          </select>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label><i class="fa-solid fa-list-check"></i> نوع الخدمة</label>
          <select onchange="setSearchServiceFilter(this.value)">
            <option value="all" ${searchState.serviceFilter==='all'?'selected':''}>كل الخدمات</option>
            ${SERVICES.map(s=>`<option value="${s.id}" ${searchState.serviceFilter===s.id?'selected':''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label><i class="fa-solid fa-map-location-dot"></i> المحافظة</label>
          <select onchange="setSearchGov(this.value)">
            <option value="all" ${searchState.gov==='all'?'selected':''}>كل المحافظات</option>
            ${govs.map(g=>`<option value="${g}" ${searchState.gov===g?'selected':''}>${g}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>

    ${list.length===0? `<div class="empty"><div class="ic"><i class="fa-solid fa-magnifying-glass"></i></div>لا يوجد فنيون مطابقون لهذا الفلتر، جرّب تغييره.</div>` : `
    <div class="grid grid-2">
      ${list.map(t=>`
        <div class="card">
          <div style="display:flex; gap:14px;">
            <div class="avatar" style="width:52px;height:52px;font-size:18px;">${t.letter}</div>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="font-weight:800; font-size:15.5px;">${t.name} ${t.verified?'<i class="fa-solid fa-circle-check" style="color:var(--green);" title="فني موثّق"></i>':''}</div>
                  <div>${stars(t.rating)} <span style="color:#9a9a9a; font-size:12.5px;">(${t.rating} · ${t.reviews} تقييم)</span></div>
                </div>
                <span class="tag ${t.status==='available'?'tag-green':'tag-amber'}">${t.status==='available'?'متاح الآن':'مشغول'}</span>
              </div>
              <p class="subtle" style="margin-top:8px;">${t.bio}</p>
              <div class="subtle" style="margin-top:6px;"><i class="fa-solid fa-location-dot"></i> ${t.area}، ${t.gov} &nbsp;·&nbsp; يبعد ${t.distance} كم</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <span class="subtle"><i class="fa-solid fa-tag"></i> ${t.price}</span>
                <span class="subtle"><i class="fa-solid fa-bolt"></i> يُنجز خلال ~${t.completion} دقيقة</span>
              </div>
              <button class="btn btn-primary btn-sm btn-block" style="margin-top:12px;" onclick="pickTech('${t.id}')" ${t.status!=='available'?'disabled':''}>
                ${t.status==='available' ? 'اختيار وحجز الموعد' : 'غير متاح حالياً'}
              </button>
            </div>
          </div>
        </div>`).join('')}
    </div>`}
  </div>`;
}
function setSearchSort(v){ searchState.sort=v; render(); }
function setSearchServiceFilter(v){ searchState.serviceFilter=v; render(); }
function setSearchGov(v){ searchState.gov=v; render(); }
function pickTech(id){ state.booking.techId = id; state.customerView='location'; render(); }
