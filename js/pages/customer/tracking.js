function viewTracking(){
  const myOrders = state.orders.filter(o=>o.customer==='أنت');
  const order = myOrders[0];
  if(!order) return `<div class="view"><div class="empty"><div class="ic"><i class="fa-solid fa-box-open"></i></div>لا يوجد طلب حالي.<br><button class="btn btn-primary" style="margin-top:14px;" onclick="goCustomer('services')">احجز خدمة جديدة</button></div></div>`;
  const idx = STEP_ORDER.indexOf(order.status);
  const steps = [{k:'pending',l:'تم الحجز'},{k:'price_proposed',l:'السعر جاهز'},{k:'accepted',l:'تم التأكيد'},{k:'on_the_way',l:'في الطريق'},{k:'in_progress',l:'بدأ العمل'},{k:'completed',l:'اكتمل'}];
  const meta = STATUS_META[order.status];
  return `
  <div class="view">
    <div class="page-head">
      <h1>تتبع طلبك</h1>
      <p>رقم الطلب ${order.id} — ${order.service}</p>
    </div>
    ${order.status==='rejected' ? `
      <div class="card" style="text-align:center; padding:40px;">
        <div style="font-size:32px; color:var(--red);"><i class="fa-solid fa-face-frown"></i></div>
        <h3 style="margin:10px 0;">اعتذر الفني عن الطلب</h3>
        <p class="subtle">يمكنك اختيار فني آخر متاح لنفس الخدمة.</p>
        <button class="btn btn-primary" style="margin-top:14px;" onclick="goCustomer('search')">البحث عن فني آخر</button>
      </div>
    ` : `
    <div class="stepper">
      ${steps.map((s,i)=>`
        <div class="step ${i<idx?'done':''} ${i===idx?'current':''}">
          <div class="dot">${i<idx?'<i class=\"fa-solid fa-check\"></i>':i+1}</div>
          <div class="lbl">${s.l}</div>
        </div>`).join('')}
    </div>

    ${order.status==='price_proposed' ? `
    <div class="price-callout">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-weight:800; margin-bottom:4px;"><i class="fa-solid fa-file-invoice-dollar"></i> ${order.techName} حدّد سعر الخدمة</div>
          <div class="subtle">متوسط السعر العام كان ~${order.estimatedPrice} ج.م، والسعر الفعلي المقترح حسب حالة العطل هو:</div>
        </div>
        <div class="amt">${order.proposedPrice} ج.م</div>
      </div>
      <div class="ticket-actions">
        <button class="btn btn-success" onclick="approvePriceCustomer('${order.id}')"><i class="fa-solid fa-check"></i> موافقة على السعر</button>
        <button class="btn btn-outline" onclick="negotiatePrice('${order.id}')"><i class="fa-solid fa-comments"></i> التفاوض مع الأسطى</button>
        <button class="btn btn-danger" onclick="cancelOrderPrice('${order.id}')"><i class="fa-solid fa-xmark"></i> إلغاء الطلب</button>
      </div>
    </div>
    ` : ''}

    ${order.status==='negotiating' ? `
    <div class="price-callout" style="border-color:#8447C9; background:#F7F2FF;">
      <div style="font-weight:800; margin-bottom:6px;"><i class="fa-solid fa-comments" style="color:#8447C9;"></i> جاري التفاوض على السعر</div>
      <p class="subtle">آخر سعر مقترح من الأسطى: <b>${order.proposedPrice} ج.م</b>. تابع المحادثة للاتفاق على السعر النهائي.</p>
      <div class="ticket-actions">
        <button class="btn btn-primary" onclick="goCustomer('support')"><i class="fa-solid fa-comments"></i> فتح المحادثة</button>
        <button class="btn btn-success" onclick="approvePriceCustomer('${order.id}')"><i class="fa-solid fa-check"></i> موافقة على آخر سعر</button>
      </div>
    </div>
    ` : ''}

    <div class="ticket">
      <div class="ticket-head">
        <div>
          <div class="ticket-id">${order.id}</div>
          <div class="ticket-service"><i class="fa-solid ${order.serviceIcon}"></i> ${order.service}</div>
        </div>
        <div class="stamp ${meta.cls}">${meta.label}</div>
      </div>
      <div class="ticket-row"><span>الفني</span><b>${order.techName}</b></div>
      <div class="ticket-row"><span>العنوان</span><b>${order.address}</b></div>
      <div class="ticket-row"><span>متوسط السعر العام</span><b>~${order.estimatedPrice} ج.م</b></div>
      ${order.proposedPrice ? `<div class="ticket-row"><span>السعر المتفق عليه</span><b style="color:var(--brass);">${order.proposedPrice} ج.م</b></div>` : ''}
      <div class="ticket-row"><span>طريقة الدفع</span><b>${order.payment}</b></div>
      ${ProblemPhotos.galleryHtml(order)}
      ${order.status==='completed' && !order.rating ? `
        <hr class="hr">
        <div style="font-weight:700; margin-bottom:8px;">قيّم تجربتك مع الفني</div>
        <div id="starPicker" style="font-size:24px; color:#ddd; cursor:pointer; margin-bottom:10px;">
          ${[1,2,3,4,5].map(n=>`<i class="fa-solid fa-star" onclick="rateOrder('${order.id}',${n})" style="margin-left:4px;"></i>`).join('')}
        </div>
        <textarea id="reviewText" placeholder="اكتب رأيك في الخدمة..." style="width:100%; border:1.5px solid var(--line); border-radius:10px; padding:10px; min-height:60px;"></textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="submitReviewOnly('${order.id}')">إرسال التقييم</button>
      ` : ''}
      ${order.rating ? `<hr class="hr">${stars(order.rating)}<p class="subtle" style="margin-top:4px;">"${order.review||''}"</p>` : ''}
    </div>
    `}
  </div>`;
}
function approvePriceCustomer(id){
  const o = state.orders.find(x=>x.id===id);
  o.status='accepted'; o.price = o.proposedPrice;
  state.notifications.technician.unshift({id:Date.now(), text:'وافق العميل على سعر الطلب '+id, time:'الآن', unread:true});
  toast('تم تأكيد السعر، سيبدأ الأسطى بالتوجه إليك قريباً');
  render();
}
function negotiatePrice(id){
  const o = state.orders.find(x=>x.id===id);
  o.status='negotiating';
  state.chat.push({from:'me', text:'ممكن نتفاوض شوية على السعر المقترح لطلب '+id+'؟'});
  toast('تم فتح التفاوض، تابع المحادثة مع الأسطى');
  state.customerView='support';
  render();
}
function cancelOrderPrice(id){
  const o = state.orders.find(x=>x.id===id);
  o.status='rejected';
  toast('تم إلغاء الطلب');
  render();
}
let tempRating = null;
function rateOrder(id, n){
  tempRating = n;
  const picker = document.getElementById('starPicker');
  if(picker) picker.innerHTML = [1,2,3,4,5].map(i=>`<i class="fa-solid fa-star" onclick="rateOrder('${id}',${i})" style="margin-left:4px; color:${i<=n?'var(--amber)':'#ddd'};"></i>`).join('');
}
function submitReviewOnly(id){
  const order = state.orders.find(o=>o.id===id);
  order.rating = tempRating || 5;
  order.review = document.getElementById('reviewText').value || 'خدمة ممتازة، شكراً.';
  toast('تم إرسال تقييمك، شكراً لك!');
  render();
}

