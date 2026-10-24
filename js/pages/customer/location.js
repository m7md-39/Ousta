/* ===== Location / Map (OpenStreetMap live map + Google Maps link) ===== */
function viewLocation(){
  return `
  <div class="view">
    <div class="page-head">
      <h1>حدّد موقعك على الخريطة</h1>
      <p>ابحث عن عنوانك، أو اضغط على الخريطة لتثبيت الدبوس، أو اسحبه لمكانك بالضبط.</p>
    </div>
    <div class="map-search-row">
      <div class="input-wrap">
        <input id="addrSearch" placeholder="اكتب اسم الشارع أو المنطقة..." oninput="onAddrSearchInput()" autocomplete="off">
        <i class="fa-solid fa-magnifying-glass"></i>
        <div class="addr-suggestions" id="addrSuggestions" style="display:none;"></div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="useMyLocation()"><i class="fa-solid fa-location-crosshairs"></i> موقعي الحالي</button>
    </div>
    <div id="leafletMap"></div>
    <div class="map-links">
      <span><i class="fa-solid fa-map-pin"></i> اسحب الدبوس لضبط الموقع بدقة</span>
      <a id="googleMapsLink" href="#" target="_blank" rel="noopener">فتح في خرائط جوجل <i class="fa-solid fa-arrow-up-left-from-square"></i></a>
    </div>
    <div class="map-note"><i class="fa-solid fa-circle-info"></i><span>تعمل الخريطة ببيانات OpenStreetMap الحية (لا تتطلب مفتاح API)، مع رابط مباشر لفتح نفس الموقع على خرائط جوجل للتأكيد.</span></div>
    <div class="field" style="margin-top:16px;">
      <label>العنوان بالتفصيل</label>
      <input id="addrInput" placeholder="مثال: كفر الدوار، البحيرة - شارع الجمهورية" value="${state.booking.address||''}">
    </div>
    <div class="nav-row">
      <button class="btn btn-outline" onclick="goCustomer('search')"><i class="fa-solid fa-arrow-right"></i> رجوع</button>
      <button class="btn btn-primary" onclick="confirmLocation()">تأكيد الموقع والمتابعة <i class="fa-solid fa-arrow-left"></i></button>
    </div>
  </div>`;
}

let _ostaMap=null, _ostaMarker=null, _addrDebounce=null;
function defaultLatLng(){
  return state.booking.location || {lat:31.1330, lng:30.1319}; // Kafr El Dawwar, Beheira
}
function initLocationMap(){
  const mapDiv = document.getElementById('leafletMap');
  if(!mapDiv || typeof L === 'undefined') return;
  if(_ostaMap){ _ostaMap.remove(); _ostaMap=null; }
  const start = defaultLatLng();
  _ostaMap = L.map('leafletMap').setView([start.lat, start.lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; OpenStreetMap contributors', maxZoom:19
  }).addTo(_ostaMap);
  _ostaMarker = L.marker([start.lat, start.lng], {draggable:true}).addTo(_ostaMap);
  _ostaMarker.on('dragend', ()=>{ const p=_ostaMarker.getLatLng(); setBookingLocation(p.lat,p.lng); });
  _ostaMap.on('click', (e)=>{ _ostaMarker.setLatLng(e.latlng); setBookingLocation(e.latlng.lat, e.latlng.lng); });
  updateGoogleMapsLink(start.lat, start.lng);
}
function updateGoogleMapsLink(lat,lng){
  const a = document.getElementById('googleMapsLink');
  if(a) a.href = `https://www.google.com/maps?q=${lat},${lng}`;
}
function setBookingLocation(lat,lng){
  state.booking.location = {lat,lng};
  updateGoogleMapsLink(lat,lng);
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`)
    .then(r=>r.json()).then(d=>{
      const inp = document.getElementById('addrInput');
      if(inp && d && d.display_name){ inp.value = d.display_name; state.booking.address = d.display_name; }
    }).catch(()=>{});
}
function onAddrSearchInput(){
  clearTimeout(_addrDebounce);
  const q = document.getElementById('addrSearch').value.trim();
  const box = document.getElementById('addrSuggestions');
  if(q.length<3){ box.style.display='none'; box.innerHTML=''; return; }
  _addrDebounce = setTimeout(()=>{
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=eg&limit=5&accept-language=ar`)
      .then(r=>r.json()).then(list=>{
        if(!list.length){ box.innerHTML = `<button disabled><i class="fa-solid fa-circle-info"></i> لا توجد نتائج</button>`; box.style.display='block'; return; }
        box.innerHTML = list.map((p,i)=>`<button onclick="selectAddrSuggestion(${i})"><i class="fa-solid fa-location-dot"></i>${p.display_name}</button>`).join('');
        window._addrResults = list;
        box.style.display='block';
      }).catch(()=>{ box.style.display='none'; });
  }, 450);
}
function selectAddrSuggestion(i){
  const p = window._addrResults[i];
  if(!p) return;
  const lat=parseFloat(p.lat), lng=parseFloat(p.lon);
  document.getElementById('addrSuggestions').style.display='none';
  document.getElementById('addrSearch').value = p.display_name;
  document.getElementById('addrInput').value = p.display_name;
  state.booking.address = p.display_name;
  state.booking.location = {lat,lng};
  if(_ostaMap){ _ostaMap.setView([lat,lng],16); _ostaMarker.setLatLng([lat,lng]); }
  updateGoogleMapsLink(lat,lng);
}
function useMyLocation(){
  if(!navigator.geolocation){ toast('المتصفح لا يدعم تحديد الموقع'); return; }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude:lat, longitude:lng} = pos.coords;
    if(_ostaMap){ _ostaMap.setView([lat,lng],16); _ostaMarker.setLatLng([lat,lng]); }
    setBookingLocation(lat,lng);
  }, ()=> toast('تعذّر الوصول لموقعك، حدّده يدوياً على الخريطة'));
}
function confirmLocation(){
  state.booking.address = document.getElementById('addrInput').value || state.booking.address || 'كفر الدوار، البحيرة';
  if(!state.booking.location) state.booking.location = defaultLatLng();
  state.customerView='booking';
  render();
}

