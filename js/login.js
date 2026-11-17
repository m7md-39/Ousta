/* ============ LOGIN PAGE ============
   Uses the demo auth helpers from js/auth.js. After a successful login the user is sent to the
   home page of their role (customer / technician / admin). */

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
    clearSavedState();
    location.href = siteUrl(ROLE_HOME[user.role]);
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


/* ---- Boot: already signed in? go straight to the role's home page ---- */
(function(){
  const s = getSession();
  if(s){ location.replace(siteUrl(ROLE_HOME[s.role])); return; }
  initLoginForm();
  if(window.matchMedia && matchMedia('(pointer:fine)').matches){
    const id = document.getElementById('lfId'); if(id) id.focus();
  }
})();
function clearSavedState(){ try{ sessionStorage.removeItem('ousta.state'); }catch(e){} }
