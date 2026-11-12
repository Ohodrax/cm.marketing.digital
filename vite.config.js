import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/contact.js';
import { metadataPlugin } from './config/metadata.js';
export default defineConfig(({mode}) => {
 const env=loadEnv(mode,process.cwd(),'');
 for(const key of ['MAKE_WEBHOOK_URL','MAKE_APPLICATION_ID']) if(env[key]) process.env[key]=env[key];
 return {plugins:[react(),metadataPlugin({...env,...process.env}),{name:'local-contact-api',configureServer(server){server.middlewares.use('/api/contact',async(req,res)=>{
  let body=''; for await(const chunk of req){body+=chunk;if(body.length>16000){res.statusCode=413;res.end();return;}}
  req.body=body;res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
  await handler(req,res);
 });}}]};
});
