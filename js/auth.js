/* ============ DEMO AUTHENTICATION ============
   ⚠ DEMO ONLY — NOT REAL SECURITY.
   Ousta has no backend, so credentials are checked in the browser against the list below and the
   "session" is a flag in sessionStorage. Anyone can read this file or edit storage, so this only
   gates the UI for demonstration. For production, move verification to a server (hashed passwords,
   HTTPS, httpOnly session cookie / signed token, server-side role checks on every request). */
const DEMO_USERS = [
  {role:'customer',   username:'customer',   email:'customer@ousta.demo',   password:'Customer@123'},
  {role:'technician', username:'technician', email:'technician@ousta.demo', password:'Tech@123'},
  {role:'admin',      username:'admin',      email:'admin@ousta.demo',      password:'Admin@123'},
];
const ROLE_HOME = {customer:'#/customer', technician:'#/technician', admin:'#/admin'};
const AUTH_KEY = 'ousta.session';
let _memSession = null; // fallback if storage is unavailable

function getSession(){
  try{ const s = JSON.parse(sessionStorage.getItem(AUTH_KEY)); if(s && ROLE_HOME[s.role]) return s; }catch(e){}
  return (_memSession && ROLE_HOME[_memSession.role]) ? _memSession : null;
}
function setSession(s){ _memSession = s; try{ sessionStorage.setItem(AUTH_KEY, JSON.stringify(s)); }catch(e){} }
function clearSession(){ _memSession = null; try{ sessionStorage.removeItem(AUTH_KEY); }catch(e){} }

function setHash(h){
  if(location.hash === h) return;
  try{ history.replaceState(null, '', h); }catch(e){ location.hash = h; }
}

function authenticate(id, pw){
  const key = id.trim().toLowerCase();
  return DEMO_USERS.find(u => (u.email === key || u.username === key) && u.password === pw) || null;
}

/* ---- Screens ---- */
function showLogin(){
  document.body.classList.add('login-mode');
  setHash('#/login');
  const pw = document.getElementById('lfPw'); if(pw) pw.value = '';
  if(window.matchMedia && matchMedia('(pointer:fine)').matches){
    const id = document.getElementById('lfId'); if(id) id.focus();
  }
}
function enterApp(user){
  state.role = user.role;           // customer → customer dashboard, technician → technician, admin → admin
  document.body.classList.remove('login-mode');
  setHash(ROLE_HOME[user.role]);
  render();
}
function logout(){
  clearSession();
  setHash('#/login');
  location.reload();                // fresh state, returns to the login page
}

/* ---- Login form ---- */
function initLoginForm(){
  const form = document.getElementById('loginForm');
  const idIn = document.getElementById('lfId'), pwIn = document.getElementById('lfPw');
  const idErr = document.getElementById('lfIdErr'), pwErr = document.getElementById('lfPwErr');
  const eye = document.getElementById('lfEye');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setErr(input, box, msg){
    box.textContent = msg || '';
    input.closest('.lf-field').classList.toggle('has-error', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function clearErrors(){ setErr(idIn, idErr, ''); setErr(pwIn, pwErr, ''); }

  eye.addEventListener('click', ()=>{
    const show = pwIn.type === 'password';
    pwIn.type = show ? 'text' : 'password';
    eye.setAttribute('aria-pressed', String(show));
    eye.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
    eye.innerHTML = `<i class="fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    pwIn.focus();
  });

  idIn.addEventListener('input', ()=> setErr(idIn, idErr, ''));
  pwIn.addEventListener('input', ()=> setErr(pwIn, pwErr, ''));

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearErrors();
    const id = idIn.value.trim(), pw = pwIn.value;
    let bad = null;
    if(!id){ setErr(idIn, idErr, 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم.'); bad = idIn; }
    else if(id.includes('@') && !EMAIL_RE.test(id)){ setErr(idIn, idErr, 'صيغة البريد الإلكتروني غير صحيحة.'); bad = idIn; }
    if(!pw){ setErr(pwIn, pwErr, 'يرجى إدخال كلمة المرور.'); bad = bad || pwIn; }
    if(bad){ bad.focus(); return; }

    const user = authenticate(id, pw);
    if(!user){
      setErr(idIn, idErr, '');
      setErr(pwIn, pwErr, 'بيانات الدخول غير صحيحة. حاول مرة أخرى.');
      idIn.closest('.lf-field').classList.add('has-error');
      pwIn.value = ''; pwIn.focus();
      return;
    }
    setSession({role:user.role, username:user.username, ts:Date.now()});
    form.reset();
    enterApp(user);
  });

  // Demo shortcuts: fill (not submit) the credentials of a demo account.
  document.querySelectorAll('.lf-chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const u = DEMO_USERS.find(x=>x.role===btn.dataset.demo);
      idIn.value = u.email; pwIn.value = u.password; clearErrors();
      document.getElementById('lfSubmit').focus();
    });
  });
}

/* ---- Boot + route guard ---- */
function initAuth(){
  initLoginForm();
  const s = getSession();
  if(s) enterApp(s); else showLogin();
  // Keep the URL consistent with auth state (blocks back/forward and hand-typed hashes).
  window.addEventListener('hashchange', ()=>{
    const cur = getSession();
    const want = cur ? ROLE_HOME[cur.role] : '#/login';
    if(location.hash !== want) setHash(want);
  });
}
