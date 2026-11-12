import axios from 'axios';
import { validateContact } from '../src/lib/contact.js';
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST') {res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
 if(!req.headers['content-type']?.startsWith('application/json')) return res.status(415).json({ok:false});
 let body; try {body=typeof req.body==='string'?JSON.parse(req.body):req.body;} catch {return res.status(400).json({ok:false});}
 const {data,errors}=validateContact(body);
 if(Object.keys(errors).length) return res.status(400).json({ok:false,errors});
 if(body.website) return res.status(400).json({ok:false});
 let url; try {url=new URL(process.env.MAKE_WEBHOOK_URL);} catch {return res.status(503).json({ok:false,code:'NOT_CONFIGURED'});}
 if(url.protocol!=='https:') return res.status(503).json({ok:false,code:'NOT_CONFIGURED'});
 try {
  const payload={...data,source:'cm-marketing-digital',language:['pt','es','en'].includes(body.language)?body.language:'pt',createdAt:new Date().toISOString(),...(process.env.MAKE_APPLICATION_ID?{applicationId:process.env.MAKE_APPLICATION_ID}:{})};
  const response=await axios.post(url.href,payload,{timeout:10000,maxRedirects:0});
  if(response.status===204 || response.data==='Accepted' || response.data?.ok===true) return res.status(200).json({ok:true});
 } catch { /* Never expose webhook or upstream response. */ }
 return res.status(502).json({ok:false});
}
