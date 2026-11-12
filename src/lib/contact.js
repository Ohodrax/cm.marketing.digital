export const services = ['strategy', 'social-media', 'paid-ads'];
export function maskPhone(value) {
 const digits=value.replace(/\D/g,'').slice(0,15);
 if(!digits)return '';
 const international=value.trim().startsWith('+');
 if(international && !digits.startsWith('55')) return '+'+digits.replace(/(\d{3})(?=\d)/g,'$1 ').trim();
 const hasCountry=(international && digits.startsWith('55')) || (digits.startsWith('55') && digits.length>11);
 const local=(hasCountry?digits.slice(2):digits).slice(0,11);
 const prefix=hasCountry?'+55 ':'';
 if(!local)return prefix.trim();
 if(local.length<=2)return prefix+'('+local;
 const number=local.slice(2),split=number.length>8?5:4;
 return prefix+'('+local.slice(0,2)+') '+number.slice(0,split)+(number.length>split?'-'+number.slice(split):'');
}
export function validateContact(values) {
 const data = Object.fromEntries(['name','phone','email','service','message'].map(k => [k, typeof values?.[k] === 'string' ? values[k].trim() : '']));
 const errors = {};
 if(data.name.length < 3 || data.name.length > 120) errors.name='nameError';
 if(!/^[+()\d\s.-]+$/.test(data.phone) || !/^\d{10,15}$/.test(data.phone.replace(/\D/g,''))) errors.phone='phoneError';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length>254) errors.email='emailError';
 if(!services.includes(data.service)) errors.service='required';
 if(!data.message || data.message.length>3000) errors.message='required';
 if(!errors.phone){data.phone=data.phone.replace(/\D/g,'');if(data.phone.startsWith('55')&&data.phone.length>11)data.phone=data.phone.slice(2);}
 return {data,errors};
}
