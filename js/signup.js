/* ============ SIGN-UP PAGE (demo only: accounts live in localStorage, see js/auth.js) ============
   No-scroll system: the form is split into 3 steps so each one always fits the viewport.
   Step 1: account type + name | Step 2: email + phone | Step 3: password + terms */
function clearSavedState(){ try{ sessionStorage.removeItem('ousta.state'); }catch(e){} }

(function(){
  const s = getSession();
  if(s){ location.replace(siteUrl(ROLE_HOME[s.role])); return; }

  const $ = id => document.getElementById(id);
  const form = $('signupForm');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^01[0125][0-9]{8}$/;   // Egyptian mobile numbers
  const toLatinDigits = v => v.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

  const TOTAL = 3;
  const steps = [...form.querySelectorAll('.su-step')];
  const bars = [...document.querySelectorAll('.su-bars i')];
  const FIELDS_BY_STEP = {1:['suNameField'], 2:['suEmailField','suPhoneField'], 3:['suPwField','suPw2Field','suTermsField']};
  let step = 1;

  function setErr(fieldId, msg){
    const f = $(fieldId); f.classList.toggle('has-error', !!msg);
    f.querySelector('.lf-err').textContent = msg || '';
    const inp = f.querySelector('input'); if(inp) inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  ['suName','suEmail','suPhone','suPw','suPw2','suTerms'].forEach(id=>{
    $(id).addEventListener(id==='suTerms'?'change':'input', ()=> setErr(id+'Field', ''));
  });

  /* ---- Step navigation ---- */
  function showStep(n, back){
    step = n;
    steps.forEach(el=>{
      const on = +el.dataset.step === n;
      el.hidden = !on;
      el.classList.toggle('back', on && !!back);
    });
    bars.forEach((b,i)=> b.classList.toggle('on', i < n));
    $('suStepNum').textContent = n;
    $('suStepName').textContent = steps[n-1].dataset.name;
    $('suBack').hidden = n === 1;
    const last = n === TOTAL;
    $('suSubmit').querySelector('span').textContent = last ? 'إنشاء الحساب' : 'التالي';
    const first = steps[n-1].querySelector('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
    if(first && n > 1) first.focus({preventScroll:true});
  }
  $('suBack').addEventListener('click', ()=> showStep(step-1, true));

  /* ---- Validation, one function per step; each returns the id of the first bad field (or null) ---- */
  function validate(n){
    let first = null; const bad = (fid, msg)=>{ setErr(fid, msg); first = first || fid; };
    FIELDS_BY_STEP[n].forEach(f=>setErr(f,''));
    if(n === 1){
      if($('suName').value.trim().length < 3) bad('suNameField', 'يرجى إدخال اسمك الكامل (3 أحرف على الأقل).');
    }
    if(n === 2){
      const email = $('suEmail').value.trim();
      const phone = toLatinDigits($('suPhone').value.replace(/[\s-]/g,''));
      if(!email) bad('suEmailField', 'يرجى إدخال البريد الإلكتروني.');
      else if(!EMAIL_RE.test(email)) bad('suEmailField', 'صيغة البريد الإلكتروني غير صحيحة.');
      else if(emailTaken(email)) bad('suEmailField', 'هذا البريد مسجّل بالفعل. جرّب تسجيل الدخول.');
      if(!PHONE_RE.test(phone)) bad('suPhoneField', 'أدخل رقم موبايل مصري صحيح (01012345678).');
    }
    if(n === 3){
      const pw = $('suPw').value, pw2 = $('suPw2').value;
      if(Array.from(pw).length < 8) bad('suPwField', 'كلمة المرور يجب ألا تقل عن 8 أحرف.');
      else if(!/\p{N}/u.test(pw) || !/\p{L}/u.test(pw)) bad('suPwField', 'يجب أن تحتوي على أحرف وأرقام.');
      if(pw2 !== pw) bad('suPw2Field', 'كلمتا المرور غير متطابقتين.');
      if(!$('suTerms').checked) bad('suTermsField', 'يجب الموافقة على الشروط لإنشاء الحساب.');
    }
    return first;
  }
  function focusField(fid){ const el = $(fid).querySelector('input'); if(el) el.focus({preventScroll:true}); }

  function strength(pw){
    let n = 0;
    if(Array.from(pw).length >= 8) n++;
    if(/\p{L}/u.test(pw)) n++;
    if(/\p{N}/u.test(pw)) n++;
    if(/[^\p{L}\p{N}]/u.test(pw)) n++;
    return n;
  }
  $('suPw').addEventListener('input', e=>{
    const n = strength(e.target.value), bar = $('suStrength');
    bar.style.width = (n*25)+'%';
    bar.style.background = n<=1 ? 'var(--red)' : n===2 ? 'var(--amber)' : 'var(--green)';
  });

  $('suEye').addEventListener('click', ()=>{
    const pw = $('suPw'), show = pw.type === 'password';
    pw.type = $('suPw2').type = show ? 'text' : 'password';
    $('suEye').setAttribute('aria-pressed', String(show));
    $('suEye').setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
    $('suEye').innerHTML = `<i class="fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  });

  /* ---- Terms dialog ---- */
  const modal = $('termsModal');
  document.querySelectorAll('[data-open-terms]').forEach(a=> a.addEventListener('click', e=>{ e.preventDefault(); e.stopPropagation(); modal.classList.add('open'); $('termsClose').focus(); }));
  $('termsClose').addEventListener('click', ()=> modal.classList.remove('open'));
  modal.addEventListener('click', e=>{ if(e.target === modal) modal.classList.remove('open'); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') modal.classList.remove('open'); });

  /* ---- Submit: "Next" on steps 1-2 (Enter key works too), create the account on step 3 ---- */
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(step < TOTAL){
      const bad = validate(step);
      if(bad){ focusField(bad); return; }
      showStep(step+1);
      return;
    }
    // Final step: re-check everything; jump back to the earliest step that has a problem.
    for(let n = 1; n <= TOTAL; n++){
      const bad = validate(n);
      if(bad){ if(n !== step) showStep(n, true); focusField(bad); return; }
    }
    const name = $('suName').value.trim(), email = $('suEmail').value.trim();
    const phone = toLatinDigits($('suPhone').value.replace(/[\s-]/g,'')), pw = $('suPw').value;
    const role = form.querySelector('input[name="role"]:checked').value;

    if(!registerUser({role, name, email, phone, password:pw})){
      showStep(2, true); setErr('suEmailField', 'تعذّر حفظ الحساب في المتصفح. فعّل التخزين المحلي.'); return;
    }
    $('suSubmit').disabled = true;
    const ok = $('suOk'); ok.textContent = 'تم إنشاء حسابك بنجاح! جارٍ تحويلك...'; ok.classList.add('show');
    setSession({role, username:email.toLowerCase(), ts:Date.now()});
    clearSavedState();
    setTimeout(()=>{ location.href = siteUrl(ROLE_HOME[role]); }, 900);
  });

  showStep(1);
})();
