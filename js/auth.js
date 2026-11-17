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
/* Landing (home) page of each role, relative to the site root. */
const ROLE_HOME = {customer:'customer/services.html', technician:'technician/requests.html', admin:'admin/dashboard.html'};
const AUTH_KEY = 'ousta.session';
let _memSession = null; // fallback if storage is unavailable

function getSession(){
  try{ const s = JSON.parse(sessionStorage.getItem(AUTH_KEY)); if(s && ROLE_HOME[s.role]) return s; }catch(e){}
  return (_memSession && ROLE_HOME[_memSession.role]) ? _memSession : null;
}
function setSession(s){ _memSession = s; try{ sessionStorage.setItem(AUTH_KEY, JSON.stringify(s)); }catch(e){} }
function clearSession(){ _memSession = null; try{ sessionStorage.removeItem(AUTH_KEY); }catch(e){} }

/* Accounts created on the Sign-Up page (demo only: kept in localStorage, password stored in plain text). */
const REG_KEY = 'ousta.registered';
function getRegistered(){ try{ const a = JSON.parse(localStorage.getItem(REG_KEY)); return Array.isArray(a) ? a : []; }catch(e){ return []; } }
function allUsers(){ return DEMO_USERS.concat(getRegistered()); }
function emailTaken(email){ const k = email.trim().toLowerCase(); return allUsers().some(u => u.email === k || u.username === k); }
function registerUser(u){
  const list = getRegistered();
  list.push({role:u.role, username:u.email.toLowerCase(), email:u.email.toLowerCase(), password:u.password, name:u.name, phone:u.phone, acceptedTermsAt:Date.now()});
  try{ localStorage.setItem(REG_KEY, JSON.stringify(list)); return true; }catch(e){ return false; }
}
function authenticate(id, pw){
  const key = id.trim().toLowerCase();
  return allUsers().find(u => (u.email === key || u.username === key) && u.password === pw) || null;
}

/* Pages live in sub-folders, so every page declares its path back to the site root in <body data-root>. */
function siteUrl(p){ return (document.body.dataset.root || '') + p; }
function goPage(p){ saveStateSafe(); location.href = p; }
function saveStateSafe(){ if(typeof saveState === 'function') saveState(); }

function logout(){
  clearSession();
  if(typeof clearSavedState === 'function') clearSavedState();   // next login starts from fresh demo data
  location.href = siteUrl('login.html');
}
