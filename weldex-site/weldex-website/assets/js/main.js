const IS_AR=location.pathname.includes('/ar/');
const ASSET_PREFIX=IS_AR?'../':'';
const PAGE=(location.pathname.split('/').pop()||'index.html');
const LANG_KEY='weldex-language';
const savedLang=localStorage.getItem(LANG_KEY);

// Keep the selected language across every page and refresh.
if(savedLang==='ar' && !IS_AR){
  location.replace(`ar/${PAGE}${location.search}${location.hash}`);
}
if(savedLang==='en' && IS_AR){
  location.replace(`../${PAGE}${location.search}${location.hash}`);
}
const SITE={
 en:[['Home','index.html'],['About','about.html'],['Services','services.html'],['Projects','projects.html'],['Engineering','value-engineering.html'],['Q&S','quality-safety.html'],['Careers','careers.html'],['Contact','contact.html']],
 ar:[['الرئيسية','index.html'],['عن ويلدكس','about.html'],['الخدمات','services.html'],['المشاريع','projects.html'],['الهندسة','value-engineering.html'],['جودة وسلامة','quality-safety.html'],['الوظائف','careers.html'],['تواصل معنا','contact.html']]
};
function asset(path){return ASSET_PREFIX+path}
function page(path){return path}
function rootFile(path){return IS_AR?'../'+path:path}
function header(){
 const links=IS_AR?SITE.ar:SITE.en;
 const langHref=IS_AR?'../'+PAGE:'ar/'+PAGE;
 const quote=IS_AR?'طلب عرض سعر':'Request a Quote';
 return `<header class="site-header"><div class="container nav"><a class="brand" href="${page('index.html')}"><img src="${asset('assets/img/logo-original.png')}" alt="WELDEX Steel"></a><nav class="nav-links">${links.map(([n,x])=>`<a class="${PAGE===x?'active':''}" href="${page(x)}">${n}</a>`).join('')}</nav><a class="lang-switch" data-lang-target="${IS_AR?'en':'ar'}" href="${langHref}">${IS_AR?'EN':'عربي'}</a><a class="btn btn-primary nav-cta" href="${page('contact.html#quote')}">${quote} →</a><button class="menu-btn" aria-label="Open menu"><span></span><span></span><span></span></button></div></header><div class="mobile-nav"><div class="stack">${links.map(([n,x])=>`<a href="${page(x)}">${n}</a>`).join('')}<a data-lang-target="${IS_AR?'en':'ar'}" href="${langHref}">${IS_AR?'English':'العربية'}</a><a class="btn btn-primary" href="${page('contact.html#quote')}">${quote}</a></div></div>`;
}
function footer(){
 if(IS_AR)return `<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="${asset('assets/img/logo-original.png')}" alt="WELDEX Steel"><p>شركة سعودية لحلول الحديد الإنشائي والتصنيع والتوريد والتنفيذ المتكامل للمشاريع في مختلف مناطق المملكة.</p><div class="social-row"><a href="https://www.facebook.com/weldexsteel" target="_blank">Facebook</a><a href="https://www.instagram.com/weldexsteel" target="_blank">Instagram</a><a href="https://www.tiktok.com/@weldexsteel" target="_blank">TikTok</a><a href="https://www.linkedin.com/in/weldex-steel-ba2898401" target="_blank">LinkedIn</a></div></div><div><h4>الشركة</h4><div class="footer-links"><a href="${page('about.html')}">من نحن</a><a href="${page('about.html#vision')}">الرؤية والرسالة</a><a href="${page('value-engineering.html')}">هندسة القيمة</a><a href="${page('quality-safety.html')}">الجودة والسلامة</a><a href="${page('careers.html')}">الوظائف</a></div></div><div><h4>الخدمات</h4><div class="footer-links"><a href="${page('services.html#peb')}">الهياكل الحديدية / PEB</a><a href="${page('services.html#misc')}">الأعمال الحديدية المتنوعة</a><a href="${page('services.html#canopies')}">المظلات والكانوبي</a><a href="${page('services.html#repair')}">الإصلاح والتدعيم</a><a href="${page('services.html#stainless')}">الستانلس ستيل</a></div></div><div><h4>تواصل معنا</h4><div class="footer-links"><a dir="ltr" href="tel:+966570066001">+966 57 006 6001</a><a href="https://wa.me/966570066001" target="_blank" rel="noopener">واتساب</a><a dir="ltr" href="mailto:info@weldexsteel.com">info@weldexsteel.com</a><a href="${page('contact.html#quote')}">طلب عرض سعر</a><a href="${page('projects.html')}">المشاريع</a><a href="${rootFile('WELDEX-Company-Profile.pdf')}" download>تحميل ملف الشركة</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} WELDEX Steel. جميع الحقوق محفوظة.</span><span>تصميم • توريد • تنفيذ</span></div></div></footer>`;
 return `<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><img src="${asset('assets/img/logo-original.png')}" alt="WELDEX Steel"><p>Saudi-based steel solutions company focused on structural steel, fabrication and integrated project delivery across the Kingdom.</p><div class="social-row"><a href="https://www.facebook.com/weldexsteel" target="_blank">Facebook</a><a href="https://www.instagram.com/weldexsteel" target="_blank">Instagram</a><a href="https://www.tiktok.com/@weldexsteel" target="_blank">TikTok</a><a href="https://www.linkedin.com/in/weldex-steel-ba2898401" target="_blank">LinkedIn</a></div></div><div><h4>Company</h4><div class="footer-links"><a href="${page('about.html')}">Who We Are</a><a href="${page('about.html#vision')}">Vision & Mission</a><a href="${page('value-engineering.html')}">Value Engineering</a><a href="${page('quality-safety.html')}">Quality & Safety</a><a href="${page('careers.html')}">Careers</a></div></div><div><h4>Services</h4><div class="footer-links"><a href="${page('services.html#peb')}">Steel Structures / PEB</a><a href="${page('services.html#misc')}">Miscellaneous Steel</a><a href="${page('services.html#canopies')}">Shades & Canopies</a><a href="${page('services.html#repair')}">Repair & Strengthening</a><a href="${page('services.html#stainless')}">Stainless Steel</a></div></div><div><h4>Contact</h4><div class="footer-links"><a href="tel:+966570066001">+966 57 006 6001</a><a href="https://wa.me/966570066001" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:info@weldexsteel.com">info@weldexsteel.com</a><a href="${page('contact.html#quote')}">Request a Quote</a><a href="${page('projects.html')}">View Projects</a><a href="${rootFile('WELDEX-Company-Profile.pdf')}" download>Download Profile</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} WELDEX Steel. All rights reserved.</span><span>Design • Supply • Execution</span></div></div></footer>`}
document.querySelectorAll('[data-site-header]').forEach(el=>el.innerHTML=header());document.querySelectorAll('[data-site-footer]').forEach(el=>el.innerHTML=footer());

// Persist explicit language choice.
document.querySelectorAll('[data-lang-target]').forEach(link=>{
  link.addEventListener('click',()=>localStorage.setItem(LANG_KEY,link.dataset.langTarget));
});
const hdr=document.querySelector('.site-header');const mobile=document.querySelector('.mobile-nav');const menu=document.querySelector('.menu-btn');
function navScroll(){hdr?.classList.toggle('scrolled',scrollY>25)}navScroll();addEventListener('scroll',navScroll,{passive:true});menu?.addEventListener('click',()=>mobile.classList.toggle('open'));mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));
// reveal
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));
// counters
const cobs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;if(el.dataset.counted)return;el.dataset.counted=1;const target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'',dur=1200,start=performance.now();function tick(t){let p=Math.min(1,(t-start)/dur);p=1-Math.pow(1-p,3);el.textContent=Math.floor(target*p)+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}),{threshold:.6});document.querySelectorAll('[data-count]').forEach(el=>cobs.observe(el));
// pointer glow + cursor
if(matchMedia('(pointer:fine)').matches){const dot=document.createElement('div'),ring=document.createElement('div');dot.className='cursor-dot';ring.className='cursor-ring';document.body.append(dot,ring);let rx=0,ry=0,mx=0,my=0;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';document.documentElement.style.setProperty('--mx',mx+'px');document.documentElement.style.setProperty('--my',my+'px')});function loop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop)}loop();document.querySelectorAll('a,button,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width='56px';ring.style.height='56px'});el.addEventListener('mouseleave',()=>{ring.style.width='36px';ring.style.height='36px'})});}
// tilt
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*6}deg) translateY(-4px)`});card.addEventListener('mouseleave',()=>card.style.transform='')})}
// parallax
const heroImg=document.querySelector('.hero-media img');addEventListener('scroll',()=>{if(heroImg)heroImg.style.transform=`scale(1.05) translateY(${Math.min(scrollY*.08,45)}px)`},{passive:true});
// project filtering
document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.project-card').forEach(c=>c.classList.toggle('hide',f!=='all'&&c.dataset.type!==f))}));
// demo forms
const toast=document.createElement('div');toast.className='toast';toast.innerHTML='<b>Thank you.</b> Your submission has been received.';document.body.appendChild(toast);document.querySelectorAll('form[data-demo]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500);f.reset()}));

// Animated Saudi coverage pins. Positions correspond to the map artwork.
document.querySelectorAll('.map-panel').forEach((panel)=>{
  const img=panel.querySelector('img');
  if(!img || panel.querySelector('.map-pins')) return;
  const canvas=document.createElement('div');
  canvas.className='map-canvas';
  img.parentNode.insertBefore(canvas,img);
  canvas.appendChild(img);
  const pins=document.createElement('div');
  pins.className='map-pins';
  const cities=IS_AR
    ? [
        ['الرياض','49.8%','50.4%','0s'],
        ['جدة','26.1%','53%','.35s'],
        ['الدمام','66.9%','39.6%','.7s'],
        ['جيزان','30.6%','78.8%','1.05s']
      ]
    : [
        ['Riyadh','49.8%','50.4%','0s'],
        ['Jeddah','26.1%','53%','.35s'],
        ['Dammam','66.9%','39.6%','.7s'],
        ['Jizan','30.6%','78.8%','1.05s']
      ];
  pins.innerHTML=cities.map(([name,x,y,d])=>`<span class="map-pin" style="--x:${x};--y:${y};--delay:${d}"><i class="pulse"></i><i class="marker"></i><b class="label">${name}</b></span>`).join('');
  canvas.appendChild(pins);
});

// V8 global WhatsApp + FAQ chatbot
(function(){
  const whatsappNumber='966570066001';
  const wa=document.createElement('a');
  wa.className='whatsapp-fab';
  wa.href=`https://wa.me/${whatsappNumber}`;
  wa.target='_blank'; wa.rel='noopener';
  wa.setAttribute('aria-label',IS_AR?'تواصل عبر واتساب':'Chat on WhatsApp');
  wa.textContent='WA';
  document.body.appendChild(wa);

  const toggle=document.createElement('button');
  toggle.className='chatbot-toggle'; toggle.type='button';
  toggle.setAttribute('aria-label',IS_AR?'الأسئلة الشائعة':'Frequently asked questions');
  toggle.textContent='?';
  document.body.appendChild(toggle);

  const faq=IS_AR?[
    {q:'ما هي خدمات WELDEX؟',keys:['خدمات','خدمة','تعملون','بتعملوا'],a:'تقدم WELDEX الهياكل الحديدية وPEB، أنظمة حوامل الكابلات، الأعمال الحديدية المتنوعة، المظلات، Trench Boxes، قطاعات C/Z، Powder Coating، أعمال الستانلس ستيل، والإصلاح والتدعيم.'},
    {q:'أين تعمل WELDEX؟',keys:['اين','أين','مناطق','مدن','موقع'],a:'تنفذ WELDEX أعمالًا في مختلف مناطق المملكة، ويعرض الملف التعريفي حضورًا في الرياض وجدة والدمام وجازان ومشاريع بمناطق أخرى.'},
    {q:'كيف أطلب عرض سعر؟',keys:['عرض','سعر','تسعير','quote'],a:'يمكنك فتح صفحة تواصل معنا وملء نموذج طلب عرض السعر بتفاصيل المشروع والخدمة المطلوبة.'},
    {q:'كيف أتقدم لوظيفة؟',keys:['وظيفة','وظائف','توظيف','cv','سيرة'],a:'من صفحة الوظائف يمكنك إدخال بياناتك واختيار بلدك ورفع ملف السيرة الذاتية مباشرة.'},
    {q:'كيف أتواصل مباشرة؟',keys:['تواصل','هاتف','رقم','واتساب','whatsapp'],a:'يمكنك الاتصال على +966 57 006 6001 أو استخدام زر واتساب الأخضر الموجود أسفل الموقع.'}
  ]:[
    {q:'What services does WELDEX offer?',keys:['service','services','offer','do you do'],a:'WELDEX provides Structural Steel / PEB, cable tray systems, miscellaneous steel works, shades and canopies, trench boxes, cold-formed C/Z sections, powder coating, stainless steel works, and repair & strengthening.'},
    {q:'Where does WELDEX operate?',keys:['where','locations','cities','operate'],a:'WELDEX delivers projects across Saudi Arabia, with locations shown in Riyadh, Jeddah, Dammam and Jizan and projects in additional regions.'},
    {q:'How do I request a quote?',keys:['quote','price','pricing','request'],a:'Open the Contact page and submit the Request a Quote form with your service and project details.'},
    {q:'How do I apply for a job?',keys:['career','job','apply','cv','resume'],a:'Open the Careers page, complete your details and upload your CV directly through the application form.'},
    {q:'How can I contact WELDEX?',keys:['contact','phone','whatsapp','call'],a:'Call +966 57 006 6001 or use the green WhatsApp button at the bottom of the site.'}
  ];

  const bot=document.createElement('section');
  bot.className='chatbot';
  bot.innerHTML=`<div class="chatbot-head"><strong>${IS_AR?'مساعد WELDEX — الأسئلة الشائعة':'WELDEX FAQ Assistant'}</strong><button class="chatbot-close" type="button">×</button></div><div class="chatbot-body"><div class="chat-msg">${IS_AR?'مرحبًا، اختر سؤالًا شائعًا أو اكتب سؤالك. إذا لم أجد إجابة دقيقة سأوجهك مباشرة إلى واتساب.':'Hi. Choose a common question or type yours. If I do not have a reliable answer, I will direct you to WhatsApp.'}</div><div class="chat-quick">${faq.map((x,i)=>`<button type="button" data-faq="${i}">${x.q}</button>`).join('')}</div><div class="chat-log"></div></div><form class="chat-input"><input aria-label="${IS_AR?'اكتب سؤالك':'Type your question'}" placeholder="${IS_AR?'اكتب سؤالك...':'Type your question...'}"><button type="submit">${IS_AR?'إرسال':'Send'}</button></form>`;
  document.body.appendChild(bot);
  const close=bot.querySelector('.chatbot-close'), log=bot.querySelector('.chat-log'), input=bot.querySelector('input');
  const answer=(item)=>{const d=document.createElement('div');d.className='chat-msg';d.textContent=item.a;log.appendChild(d);bot.querySelector('.chatbot-body').scrollTop=99999;};
  const fallback=()=>{const d=document.createElement('div');d.className='chat-msg';d.innerHTML=(IS_AR?'لا أملك إجابة دقيقة على هذا السؤال. الأفضل أن يرد عليك فريق WELDEX مباشرة.':'I do not have a reliable answer for that question. The WELDEX team can help directly.')+`<br><a class="chat-wa" target="_blank" rel="noopener" href="https://wa.me/${whatsappNumber}">${IS_AR?'تواصل عبر واتساب':'Continue on WhatsApp'}</a>`;log.appendChild(d);bot.querySelector('.chatbot-body').scrollTop=99999;};
  toggle.addEventListener('click',()=>bot.classList.toggle('open'));
  close.addEventListener('click',()=>bot.classList.remove('open'));
  bot.querySelectorAll('[data-faq]').forEach(b=>b.addEventListener('click',()=>answer(faq[Number(b.dataset.faq)])));
  bot.querySelector('.chat-input').addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim().toLowerCase();if(!q)return;const u=document.createElement('div');u.className='chat-msg';u.style.borderInlineStartColor='#777';u.textContent=input.value;log.appendChild(u);const hit=faq.find(x=>x.keys.some(k=>q.includes(k.toLowerCase())));hit?answer(hit):fallback();input.value='';});
})();

// Arabic-aware demo form message + selected file name
if(IS_AR){toast.innerHTML='<b>شكرًا لك.</b> تم استلام البيانات في النسخة التجريبية من الواجهة.';}
document.querySelectorAll('.file-drop input[type="file"]').forEach(inp=>inp.addEventListener('change',()=>{
  const strong=inp.closest('.file-drop')?.querySelector('strong');
  if(strong && inp.files?.[0]) strong.textContent=inp.files[0].name;
}));
