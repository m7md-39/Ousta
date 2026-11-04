function viewTechRequests(){
  const incoming = state.orders.filter(o=>o.techId==='t1' && o.status==='pending');
  const awaitingCustomer = state.orders.filter(o=>o.techId==='t1' && (o.status==='price_proposed' || o.status==='negotiating'));
  return `
  <div class="view">
    <div class="page-head"><h1>الطلبات الواردة</h1><p>راجع الطلبات الجديدة في منطقتك، وحدد السعر المناسب حسب حجم الشغل.</p></div>
    ${incoming.length===0? `<div class="empty"><div class="ic"><i class="fa-solid fa-inbox"></i></div>لا توجد طلبات جديدة حالياً.</div>` : incoming.map(o=>`
      <div class="ticket">
        <div class="ticket-head">
          <div><div class="ticket-id">${o.id}</div><div class="ticket-service"><i class="fa-solid ${o.serviceIcon}"></i> ${o.service}</div></div>
          <div class="stamp pending">${o.urgent?'عاجل':'جديد'}</div>
        </div>
        <div class="ticket-row"><span>العميل</span><b>${o.customer}</b></div>
        <div class="ticket-row"><span>العنوان</span><b>${o.address}</b></div>
        <div class="ticket-row"><span>وسيلة الدفع</span><b>${o.payment}</b></div>
        ${ProblemPhotos.galleryHtml(o)}
        ${o.urgent ? `<div class="tag tag-red" style="margin-top:6px;"><i class="fa-solid fa-triangle-exclamation"></i> طلب عاجل — العميل محتاج حد بسرعة</div>` : ''}
        ${o.notes ? `<p class="subtle" style="margin-top:8px;"><i class="fa-solid fa-note-sticky" style="color:var(--brass);"></i> ${o.notes}</p>` : ''}
        <div class="ticket-row"><span>متوسط السعر العام لهذه الخدمة</span><b>~${o.estimatedPrice} ج.م</b></div>
        ${o._settingPrice ? `
        <div class="avg-note" style="margin-top:10px;"><i class="fa-solid fa-circle-info"></i><span>هذا رقم متوسط فقط، حدد السعر الفعلي المناسب لحجم العطل — سيظهر للعميل ليوافق عليه.</span></div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
          ${[o.estimatedPrice-20, o.estimatedPrice, o.estimatedPrice+30, o.estimatedPrice+60].filter(v=>v>0).map(v=>`<button class="btn btn-ghost btn-sm" onclick="quickSetPrice('${o.id}',${v})">${v} ج.م</button>`).join('')}
        </div>
        <div style="display:flex; gap:10px; align-items:flex-end; margin-top:10px; flex-wrap:wrap;">
          <div class="field" style="margin-bottom:0; flex:1; min-width:140px;"><label>السعر المقترح (ج.م)</label><input type="number" id="priceInput_${o.id}" value="${o.estimatedPrice}"></div>
          <div class="field" style="margin-bottom:0; min-width:160px;"><label>مدة التنفيذ المتوقعة</label>
            <select id="durationInput_${o.id}">
              <option value="30 دقيقة">حتى 30 دقيقة</option>
              <option value="ساعة" selected>حوالي ساعة</option>
              <option value="ساعتين">حوالي ساعتين</option>
              <option value="نصف يوم">نصف يوم</option>
              <option value="يوم كامل">يوم كامل</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="submitTechPrice('${o.id}')"><i class="fa-solid fa-paper-plane"></i> إرسال السعر للعميل</button>
        </div>
        ` : `
        <div class="ticket-actions">
          <button class="btn btn-success btn-sm" onclick="techRespond('${o.id}', true)"><i class="fa-solid fa-check"></i> قبول وتحديد السعر</button>
          <button class="btn btn-danger btn-sm" onclick="techRespond('${o.id}', false)"><i class="fa-solid fa-xmark"></i> رفض</button>
        </div>
        `}
      </div>`).join('')}

    ${awaitingCustomer.length>0 ? `
    <div class="section-title"><span class="bar"></span>بانتظار موافقة العميل على السعر</div>
    ${awaitingCustomer.map(o=>`
      <div class="ticket">
        <div class="ticket-head">
          <div><div class="ticket-id">${o.id}</div><div class="ticket-service"><i class="fa-solid ${o.serviceIcon}"></i> ${o.service}</div></div>
          <div class="stamp ${STATUS_META[o.status].cls}">${STATUS_META[o.status].label}</div>
        </div>
        <div class="ticket-row"><span>العميل</span><b>${o.customer}</b></div>
        <div class="ticket-row"><span>السعر المقترح</span><b style="color:var(--brass);">${o.proposedPrice} ج.م</b></div>
        ${ProblemPhotos.galleryHtml(o)}
        <div class="ticket-actions"><button class="btn btn-outline btn-sm" onclick="goTech('chat')"><i class="fa-solid fa-comments"></i> مراسلة العميل</button></div>
      </div>`).join('')}
    ` : ''}
  </div>`;
}
function techRespond(id, accept){
  const o = state.orders.find(x=>x.id===id);
  if(!accept){
    o.status = 'rejected';
    state.notifications.customer.unshift({id:Date.now(), text:'اعتذر الفني عن تنفيذ الطلب '+id, time:'الآن', unread:true});
    toast('تم رفض الطلب');
    render();
    return;
  }
  o._settingPrice = true;
  render();
}
function quickSetPrice(id, val){
  const input = document.getElementById('priceInput_'+id);
  if(input) input.value = val;
}
function submitTechPrice(id){
  const o = state.orders.find(x=>x.id===id);
  const input = document.getElementById('priceInput_'+id);
  const durInput = document.getElementById('durationInput_'+id);
  const price = parseInt(input.value) || o.estimatedPrice;
  const duration = durInput ? durInput.value : 'ساعة';
  o.proposedPrice = price;
  o.duration = duration;
  o.status = 'price_proposed';
  o._settingPrice = false;
  state.notifications.customer.unshift({id:Date.now(), text:'حدد الفني '+o.techName+' سعر طلبك رقم '+id+': '+price+' ج.م (مدة تقريبية: '+duration+')', time:'الآن', unread:true});
  toast('تم إرسال السعر للعميل، بانتظار موافقته');
  render();
}

