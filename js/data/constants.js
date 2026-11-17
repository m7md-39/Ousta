const STATUS_META = {
  pending:{label:'بانتظار رد الأسطى', cls:'pending'},
  price_proposed:{label:'بانتظار موافقتك على السعر', cls:'price_proposed'},
  negotiating:{label:'قيد التفاوض على السعر', cls:'negotiating'},
  accepted:{label:'تم تأكيد السعر', cls:'accepted'},
  on_the_way:{label:'في الطريق', cls:'on_the_way'},
  in_progress:{label:'العمل جارٍ', cls:'in_progress'},
  completed:{label:'تم الإنجاز', cls:'completed'},
  rejected:{label:'مرفوض', cls:'rejected'},
};
const STEP_ORDER = ['pending','price_proposed','accepted','on_the_way','in_progress','completed'];
const VALID_PROMOS = {
  'OUSTA10': {type:'percent', value:10, label:'خصم 10% على قيمة الخدمة'},
  'WELCOME50': {type:'fixed', value:50, label:'خصم 50 جنيهاً على أول طلب'},
  'AUSTA20': {type:'percent', value:20, label:'خصم 20% لعملاء أُسطى المميزين'},
};
