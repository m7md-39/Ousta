/* ============ STATE ============ */
/* Fresh, empty booking draft. `photos` holds the not-yet-confirmed problem images
   ({id,name,size,type,url,file}); they move to the order on confirmation. */
function emptyBooking(){
  return { serviceId:null, techId:null, location:null, address:'', date:'', time:'', notes:'', payment:null, promoCode:null, photos:[] };
}

/* Demo problem images (inline SVG) so the technician's photo section has something to show. */
function demoPhoto(id, label, c1, c2){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/><circle cx="320" cy="200" r="70" fill="rgba(255,255,255,.25)"/><path d="M290 200l25 25 45-55" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".0"/><text x="320" y="330" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${label}</text></svg>`;
  return {id, name:label, size:0, type:'image/svg+xml', url:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)};
}

let searchState = { sort:'rating', serviceFilter:'all', gov:'all' };

let state = {
  role: 'customer',
  customerView: 'services',
  technicianView: 'requests',
  adminView: 'dashboard',
  booking: emptyBooking(),
  techProfile: { photo:null, verifiedSub:true },
  orders: [
    {id:'OST-1042', customer:'سارة أحمد', service:'سباكة', serviceIcon:'fa-faucet-drip', techId:'t3', techName:'أحمد جمال', status:'completed', estimatedPrice:160, proposedPrice:180, price:180, date:'2026-07-10', address:'شارع النصر، القاهرة', payment:'كاش', rating:5, review:'سريع ومحترف جداً، أنصح به.'},
    {id:'OST-1043', customer:'أنت', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'in_progress', estimatedPrice:160, proposedPrice:220, price:220, date:'2026-07-14', address:'كفر الدوار، البحيرة', payment:'إلكتروني', rating:null, review:null},
    {id:'OST-1044', customer:'مصطفى علي', service:'تكييف', serviceIcon:'fa-snowflake', techId:'t4', techName:'حسام الدين', status:'pending', estimatedPrice:240, proposedPrice:null, price:null, date:'2026-07-14', address:'دمنهور، البحيرة', payment:'كاش', rating:null, review:null},
    {id:'OST-1045', customer:'منى إبراهيم', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'pending', estimatedPrice:150, proposedPrice:null, price:null, date:'2026-07-19', address:'شارع الجمهورية، كفر الدوار', payment:'كاش', urgent:true, time:'14:00', notes:'ماسورة كهرباء محروقة في المطبخ، محتاجة حد يجي بسرعة.', attachments:[demoPhoto('d1a','الماسورة المحروقة','#7a3b1d','#2b1408'), demoPhoto('d1b','المطبخ - لقطة عامة','#3b5b7a','#14222e')], rating:null, review:null},
    {id:'OST-1046', customer:'عمر شريف', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'pending', estimatedPrice:170, proposedPrice:null, price:null, date:'2026-07-19', address:'حي أول، دمنهور', payment:'إلكتروني', urgent:false, time:'10:00', notes:'تركيب لوحة توزيع جديدة للشقة كاملة.', attachments:[demoPhoto('d2a','لوحة التوزيع الحالية','#4a4a52','#18181b')], rating:null, review:null},
    {id:'OST-1047', customer:'ياسمين عادل', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'pending', estimatedPrice:130, proposedPrice:null, price:null, date:'2026-07-20', address:'أبو حمص، البحيرة', payment:'كاش', urgent:false, notes:'إنارة الصالة بتقطع كل شوية والمفتاح سخن.', rating:null, review:null},
    {id:'OST-1048', customer:'هبة سامي', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'price_proposed', estimatedPrice:140, proposedPrice:190, price:null, date:'2026-07-18', address:'رشيد، البحيرة', payment:'كاش', rating:null, review:null},
    {id:'OST-1049', customer:'كريم ماهر', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'negotiating', estimatedPrice:160, proposedPrice:260, price:null, date:'2026-07-18', address:'إيتاي البارود، البحيرة', payment:'إلكتروني', rating:null, review:null},
    {id:'OST-1030', customer:'سلمى وجدي', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:150, proposedPrice:170, price:170, date:'2026-07-02', address:'كفر الدوار، البحيرة', payment:'كاش', rating:5, review:'محترف جداً وسعره مناسب.'},
    {id:'OST-1031', customer:'أحمد ناصر', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:140, proposedPrice:160, price:160, date:'2026-06-28', address:'دمنهور، البحيرة', payment:'إلكتروني', rating:4, review:'جيد لكن تأخر شوية.'},
    {id:'OST-1032', customer:'رنا فتحي', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:180, proposedPrice:210, price:210, date:'2026-06-22', address:'رشيد، البحيرة', payment:'كاش', rating:5, review:'شغل نضيف جداً ومنظم.'},
    {id:'OST-1033', customer:'محمد رفعت', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:130, proposedPrice:150, price:150, date:'2026-06-15', address:'أبو المطامير، البحيرة', payment:'كاش', rating:5, review:'سريع في التنفيذ وأمين.'},
    {id:'OST-1034', customer:'نور الهدى', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:200, proposedPrice:230, price:230, date:'2026-06-08', address:'إيتاي البارود، البحيرة', payment:'إلكتروني', rating:4, review:'الخدمة كويسة والسعر مناسب.'},
    {id:'OST-1035', customer:'عبد الله سعد', service:'كهرباء', serviceIcon:'fa-bolt', techId:'t1', techName:'كريم عبد الرحمن', status:'completed', estimatedPrice:160, proposedPrice:180, price:180, date:'2026-05-30', address:'كفر الدوار، البحيرة', payment:'كاش', rating:5, review:'من أفضل الفنيين اللي تعاملت معاهم.'},
  ],
  notifications: {
    customer: [
      {id:1, text:'الفني كريم عبد الرحمن في الطريق إليك الآن.', time:'منذ 5 دقائق', unread:true},
      {id:2, text:'تم قبول طلبك رقم OST-1043.', time:'منذ 20 دقيقة', unread:true},
      {id:3, text:'لا تنسَ تقييم آخر خدمة تمت.', time:'أمس', unread:false},
    ],
    technician: [
      {id:1, text:'طلب جديد بانتظار موافقتك في منطقتك.', time:'منذ دقيقتين', unread:true},
      {id:2, text:'تم تحويل أرباح الأسبوع الماضي لحسابك.', time:'أمس', unread:false},
    ],
  },
  pendingTechnicians: [
    {id:'p1', name:'إبراهيم توفيق', service:'plumbing', phone:'01012345678', cert:'رخصة صنعة - سباكة', date:'2026-07-12'},
    {id:'p2', name:'وائل رمزي', service:'electric', phone:'01098765432', cert:'شهادة تدريب كهرباء منزلية', date:'2026-07-13'},
  ],
  complaints: [
    {id:'C-201', from:'سارة أحمد', about:'الفني محمود سيد', text:'تأخر عن الموعد المحدد أكثر من ساعة.', status:'open'},
    {id:'C-202', from:'مصطفى علي', about:'طلب OST-1044', text:'السعر المعروض أعلى من المتفق عليه هاتفياً.', status:'open'},
  ],
  chat: [
    {from:'them', text:'أهلاً، أنا في الطريق إليك الآن.'},
    {from:'me', text:'تمام يا أسطى، في انتظارك.'},
    {from:'them', text:'هوصل خلال ١٥ دقيقة تقريباً.'},
  ],
  activeChatId: 'c1',
  techChats: [
    {id:'c1', name:'أنت (طلب OST-1043)', letter:'أ', online:true, orderId:'OST-1043', unread:0, messages:[
      {from:'me', text:'أهلاً، أنا في الطريق إليك الآن.', time:'10:02 ص'},
      {from:'them', text:'تمام يا أسطى، في انتظارك.', time:'10:03 ص'},
      {from:'me', text:'هوصل خلال ١٥ دقيقة تقريباً.', time:'10:04 ص'},
    ]},
    {id:'c2', name:'منى إبراهيم', letter:'م', online:true, orderId:'OST-1045', unread:2, messages:[
      {from:'them', text:'الماسورة لسه بتحرق، ممكن تيجي بسرعة؟', time:'11:20 ص'},
      {from:'them', text:'المطبخ فيه ريحة حريق خفيفة كمان.', time:'11:21 ص'},
    ]},
    {id:'c3', name:'عمر شريف', letter:'ع', online:false, orderId:'OST-1046', unread:1, messages:[
      {from:'them', text:'إمتى ممكن تعدي على لوحة التوزيع؟', time:'9:45 ص'},
    ]},
    {id:'c4', name:'ياسمين عادل', letter:'ي', online:true, orderId:'OST-1047', unread:0, messages:[
      {from:'them', text:'المفتاح بقى سخن أكتر من الأول.', time:'أمس'},
      {from:'me', text:'حاضر هطمن عليه أول ما أوصل.', time:'أمس'},
    ]},
    {id:'c5', name:'هبة سامي', letter:'ه', online:false, orderId:'OST-1048', unread:0, messages:[
      {from:'them', text:'شفت السعر المقترح، هو ده شامل قطع الغيار؟', time:'أمس'},
      {from:'me', text:'أيوه شامل كل حاجة غير الكابل لو احتجناه.', time:'أمس'},
      {from:'them', text:'تمام، هوافق على السعر.', time:'أمس'},
    ]},
    {id:'c6', name:'كريم ماهر', letter:'ك', online:true, orderId:'OST-1049', unread:3, messages:[
      {from:'them', text:'السعر شوية غالي، ممكن تنزل شوية؟', time:'12:10 م'},
      {from:'them', text:'عندي عرض من فني تاني بـ٢٠٠ بس هو مش موثّق.', time:'12:11 م'},
      {from:'them', text:'لو تقدر تعمل ٢٣٠ نمشيها.', time:'12:12 م'},
    ]},
  ],
  servicePrices: [
    {id:'electric', name:'كهرباء', base:120},
    {id:'plumbing', name:'سباكة', base:100},
    {id:'ac', name:'تكييف وتبريد', base:200},
    {id:'paint', name:'دهانات', base:90},
    {id:'carpentry', name:'نجارة', base:150},
    {id:'general', name:'صيانة عامة', base:100},
  ],
};


/* ============ PERSISTENCE ACROSS PAGES ============
   The site is now a set of separate HTML pages, so the in-memory state (orders, booking draft,
   notifications, chats...) is saved to sessionStorage and restored on every page load.
   Demo only; it lives as long as the browser tab. */
const STATE_KEY = 'ousta.state';
function saveState(){
  try{ sessionStorage.setItem(STATE_KEY, JSON.stringify({state, searchState}, (k,v)=> k==='file' ? undefined : v)); }catch(e){}
}
function loadState(){
  try{
    const s = JSON.parse(sessionStorage.getItem(STATE_KEY));
    if(s){ Object.assign(state, s.state); Object.assign(searchState, s.searchState); }
  }catch(e){}
}
function clearSavedState(){ try{ sessionStorage.removeItem(STATE_KEY); }catch(e){} }
