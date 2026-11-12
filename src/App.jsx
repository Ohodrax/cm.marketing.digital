import { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { content } from './content';
import { services, validateContact, maskPhone } from './lib/contact';

const instagram=import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/mktdigital.cm/';
const phone=(import.meta.env.VITE_WHATSAPP_NUMBER || '5511978549530').replace(/\D/g,'');
const whatsapp=`https://wa.me/${phone}`;
const photo=import.meta.env.VITE_CAMILA_PHOTO_URL || '/camila.webp';
const ids=['servicos','sobre','contato'];
function readPreference(key,fallback){try{return localStorage.getItem(key)||fallback;}catch{return fallback;}}
function savePreference(key,value){try{localStorage.setItem(key,value);}catch{/* Storage can be unavailable in private browsing. */}}
function Icon({name,...props}) {
 const paths={arrow:'M7 17 17 7M7 7h10v10',up:'m6 14 6-6 6 6M12 8v13',menu:'M4 7h16M4 12h16M4 17h16',close:'m6 6 12 12M6 18 18 6',chat:'M4 4h16v12H9l-5 4V4ZM8 8h8M8 12h5',instagram:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 7h.01',whatsapp:'M20 11.5a8 8 0 0 1-11.8 7L3 20l1.5-5.1A8 8 0 1 1 20 11.5ZM8 8c0 4 4 7 7 7l1-2-3-1-1 1-2-2 1-1-1-3Z',target:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0',ads:'m3 10 17-6v14L3 13v-3Zm4 4 2 6h4l-2-5M20 8l2-1M20 14l2 1',moon:'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',sun:'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]}/></svg>;
}
function Sun({className=''}) {return <svg className={`sun-art ${className}`} viewBox="0 0 500 500" fill="none" aria-hidden="true"><circle cx="250" cy="250" r="99"/>{Array.from({length:32},(_,i)=><path key={i} transform={`rotate(${i*11.25} 250 250)`} d={i%2===0?'M243 142 250 10 257 142Z':'M244 142C232 108 270 86 250 32C283 78 247 108 257 142Z'}/>)}</svg>}
function Flourish(){return <svg className="flourish" viewBox="0 0 180 36" fill="none" aria-hidden="true"><path d="M21 20c9 2 11-13 1-14C5 3 0 26 17 29c30 7 91-29 138-24 24 2 24 30 6 27-14-2-9-20 0-17 8 2 4 10 0 7M19 15c-5-4-10 7-2 9" stroke="currentColor" strokeWidth="1.6"/></svg>}
function Brand(){return <a className="brand" href="#inicio" aria-label="CM Marketing Digital"><Sun/><span>CM MARKETING DIGITAL</span></a>}
function SocialLinks({compact=false}) {return <div className={compact?'social-links compact':'social-links'}><a className="button outline" href={whatsapp} target="_blank" rel="noreferrer"><Icon name="whatsapp"/>WhatsApp</a><a className="button outline" href={instagram} target="_blank" rel="noreferrer"><Icon name="instagram"/>Instagram</a></div>}
function LanguageSwitch({language,onChange,className=''}){return <div className={`languages ${className}`} aria-label="Idioma / Language">{['pt','es','en'].map(lang=><button key={lang} aria-pressed={language===lang} onClick={()=>onChange(lang)}>{lang.toUpperCase()}</button>)}</div>}
function Portrait({small=false,t}){return <div className={`portrait ${small?'portrait-small':''}`}><Sun/><div className="portrait-photo"><img src={photo} alt={t.photo} loading={small?'lazy':'eager'} fetchPriority={small?'auto':'high'}/></div></div>}

function ContactForm({t,language}) {
 const [errors,setErrors]=useState({});const [sending,setSending]=useState(false);const busy=useRef(false);const [status,setStatus]=useState('');
 async function submit(event){
  event.preventDefault();if(busy.current)return;
  const form=event.currentTarget;const values=Object.fromEntries(new FormData(form));const result=validateContact(values);
  setErrors(result.errors);setStatus('');
  if(Object.keys(result.errors).length){form.elements.namedItem(Object.keys(result.errors)[0])?.focus();toast.warning(`⚠️ ${t.invalid}`,{icon:false});return;}
  busy.current=true;setSending(true);const notification=toast.loading(`⏳ ${t.sending}`,{icon:false});
  try {
   const response=await axios.post('/api/contact',{...result.data,website:values.website,language},{timeout:15000});
   if(response.data?.ok!==true)throw new Error('Unconfirmed');
   form.reset();setStatus('success');toast.update(notification,{render:`✅ ${t.success}`,type:'success',isLoading:false,autoClose:5000,closeButton:true});
  } catch(error){const key=error.response?.data?.code==='NOT_CONFIGURED'?'unavailable':'error';setStatus(key);toast.update(notification,{render:`❌ ${t[key]}`,type:'error',isLoading:false,autoClose:6000,closeButton:true});}
  finally {busy.current=false;setSending(false);}
 }
 const field=(name,index,type,placeholder)=><div className={`field field-${name}`}><label htmlFor={name}>{t.fields[index]}</label><input id={name} name={name} type={type} autoComplete={{name:'name',email:'email',phone:'tel'}[name]} placeholder={placeholder} onChange={name==='phone'?event=>{event.target.value=maskPhone(event.target.value);}:undefined} maxLength={name==='name'?120:name==='email'?254:30} required readOnly={sending} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name]?`${name}-error`:undefined}/>{errors[name]&&<span className="field-error" id={`${name}-error`}>{t[errors[name]]}</span>}</div>;
 return <form onSubmit={submit} noValidate aria-label={t.contact} className="contact-form" data-aos="fade-up">
  <div className="form-row">{field('name',0,'text',t.placeholders[0])}{field('phone',1,'tel',t.placeholders[1])}</div>
  {field('email',2,'email',t.placeholders[2])}
  <div className="field"><label htmlFor="service">{t.fields[3]}</label><div className="select-wrap"><select id="service" name="service" disabled={sending} defaultValue="strategy">{services.map((service,i)=><option key={service} value={service}>{t.titles[i]}</option>)}</select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></div></div>
  <div className="field"><label htmlFor="message">{t.fields[4]}</label><textarea id="message" name="message" rows="4" required maxLength="3000" placeholder={t.placeholders[3]} readOnly={sending} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?'message-error':undefined}/>{errors.message&&<span className="field-error" id="message-error">{t[errors.message]}</span>}</div>
  <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex="-1" autoComplete="off"/></label></div>
  <button className="button primary submit" disabled={sending}>{sending?t.sending:t.interest}<Icon name="arrow"/></button>
  <p className="privacy">{t.privacy}</p><p className="form-status" role="status">{status?t[status]:''}</p>
 </form>;
}

export default function App(){
 const [language,setLanguage]=useState(()=>{const saved=readPreference('cm-language','pt');return content[saved]?saved:'pt';});
 const [theme,setTheme]=useState(()=>readPreference('cm-theme',window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
 const [menu,setMenu]=useState(false);const [social,setSocial]=useState(false);const [scrolled,setScrolled]=useState(false);
 const socialRoot=useRef(null);const socialButton=useRef(null);const menuButton=useRef(null);const header=useRef(null);const t=content[language];
 useEffect(()=>{AOS.init({duration:650,once:true,offset:50,disable:window.matchMedia('(prefers-reduced-motion: reduce)').matches});const onScroll=()=>setScrolled(window.scrollY>600);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);},[]);
 useEffect(()=>{if(!scrolled)setSocial(false);},[scrolled]);
 useEffect(()=>{document.documentElement.lang=language==='pt'?'pt-BR':language;savePreference('cm-language',language);AOS.refresh();},[language]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;savePreference('cm-theme',theme);},[theme]);
 useEffect(()=>{function dismiss(e){if(e.type==='keydown'&&e.key==='Escape'){if(social){setSocial(false);socialButton.current?.focus();}if(menu){setMenu(false);menuButton.current?.focus();}}if(e.type==='pointerdown'){if(!socialRoot.current?.contains(e.target))setSocial(false);if(!header.current?.contains(e.target))setMenu(false);}}document.addEventListener('keydown',dismiss);document.addEventListener('pointerdown',dismiss);return()=>{document.removeEventListener('keydown',dismiss);document.removeEventListener('pointerdown',dismiss);};},[menu,social]);
 return <><a className="skip" href="#main">{t.skip}</a><header ref={header}><div className="container header-inner"><Brand/><nav id="navigation" className={menu?'navigation is-open':'navigation'} aria-label={t.menu}>{ids.map((id,i)=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{t.nav[i]}</a>)}<LanguageSwitch language={language} onChange={setLanguage} className="mobile-languages"/></nav><div className="header-actions"><LanguageSwitch language={language} onChange={setLanguage} className="desktop-languages"/><button className="icon-button theme-toggle" aria-label={t.theme} onClick={()=>setTheme(theme==='dark'?'light':'dark')}><Icon name={theme==='dark'?'sun':'moon'}/></button><a className="button primary header-cta" href="#contato">{t.talk}<Icon name="arrow"/></a><button ref={menuButton} className="icon-button hamburger" aria-label={menu?t.close:t.menu} aria-expanded={menu} aria-controls="navigation" onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'}/></button></div></div></header>
 <main id="main"><section className="hero container" id="inicio"><div className="hero-copy"><p className="eyebrow" data-aos="fade-up">{t.eyebrow}</p><h1 data-aos="fade-up" data-aos-delay="100">{t.hero} <em>{t.emphasis}</em></h1><Flourish/><p className="intro" data-aos="fade-up" data-aos-delay="200">{t.intro}</p><div className="hero-buttons" data-aos="fade-up" data-aos-delay="300"><a href="#contato" className="button primary">{t.more}<Icon name="arrow"/></a><a href="#servicos" className="button outline">{t.view}</a></div></div><div className="hero-art" data-aos="fade-in" data-aos-delay="200"><Portrait t={t}/></div></section>
 <section className="statement"><div className="container statement-grid"><h2 data-aos="fade-up">{t.statement}</h2><p data-aos="fade-up" data-aos-delay="100">{t.statementText}</p></div></section>
 <section id="servicos" className="services section container"><div className="section-heading" data-aos="fade-up"><p className="eyebrow">{t.nav[0]}</p><h2>{t.services}</h2></div><div className="service-grid">{t.titles.map((title,i)=><article className="service-card" key={services[i]} data-aos="fade-up" data-aos-delay={i*100}><div className="card-top"><span className="service-icon"><Icon name={['target','chat','ads'][i]}/></span><span className="number">0{i+1}</span></div><h3>{title}</h3><div className="card-line"/><p>{t.descriptions[i]}</p><div className="tags">{t.tags[i].map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div></section>
 <section className="about section" id="sobre"><div className="container about-grid"><div data-aos="fade-up"><Portrait small t={t}/></div><div className="about-copy" data-aos="fade-up"><p className="eyebrow">{t.nav[1]}</p><h2>{t.about}</h2><p>{t.bio}</p><a href={instagram} className="button outline" target="_blank" rel="noreferrer"><Icon name="instagram"/>@mktdigital.cm<Icon name="arrow"/></a></div></div></section>
 <section className="cta-banner"><div className="container"><div data-aos="fade-up"><p className="eyebrow">CM Marketing Digital</p><h2>{t.cta}</h2><a href="#contato" className="button">{t.interest}<Icon name="arrow"/></a></div></div><Sun/></section>
 <section id="contato" className="contact section container"><div className="contact-copy" data-aos="fade-up"><p className="eyebrow">{t.nav[2]}</p><h2>{t.contact}</h2><Flourish/><p>{t.contactText}</p><SocialLinks/></div><ContactForm t={t} language={language}/></section>
 </main><footer><div className="container footer-grid"><div><Brand/><p>© {new Date().getFullYear()} Camila Machado · {t.rights}</p><p className="disclaimer">{t.disclaimer}</p></div><div className="footer-social"><p className="eyebrow">{t.networks}</p><SocialLinks compact/></div></div></footer>
 <button className={`icon-button back-top ${scrolled?'is-visible':''}`} inert={!scrolled} aria-hidden={!scrolled} aria-label={t.top} onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><Icon name="up"/></button>
 <div className={`floating-social ${scrolled?'is-visible':''}`} inert={!scrolled} aria-hidden={!scrolled} ref={socialRoot}><div id="social-channels" className={`floating-channels ${social?'is-open':''}`} inert={!social} aria-hidden={!social}><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="icon-button whatsapp"><Icon name="whatsapp"/></a><a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="icon-button instagram"><Icon name="instagram"/></a></div><button ref={socialButton} className="icon-button social-toggle" aria-expanded={social} aria-controls="social-channels" aria-label={social?t.close:t.channels} onClick={()=>setSocial(!social)}><Icon name={social?'close':'chat'}/></button></div>
 <ToastContainer position="top-right" theme={theme} limit={3}/>
 <Analytics />
 <SpeedInsights />
 </>;
}
