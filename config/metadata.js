// Rendered into the HTML at build time so crawlers do not need JavaScript.
export function metadataPlugin(env) {
 const domain=env.SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
 let siteUrl;
 if(domain){
  const parsed=new URL(domain.includes('://')?domain:`https://${domain}`);
  if(!['https:','http:'].includes(parsed.protocol))throw new Error('SITE_URL deve usar HTTP ou HTTPS.');
  siteUrl=parsed.origin+'/';
 }
 const imageUrl=siteUrl?new URL('og-image.jpg',siteUrl).href:'/og-image.jpg';
 return {
  name:'cm-social-metadata',
  transformIndexHtml(html){
   const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;');
   html=html.replace('<meta property="og:image:type"',`<meta property="og:image" content="${escape(imageUrl)}" />\n    <meta property="og:image:type"`);
   return {html,tags:[
    {tag:'meta',attrs:{name:'twitter:image',content:imageUrl},injectTo:'head'},
    {tag:'meta',attrs:{name:'robots',content:env.VERCEL_ENV==='preview'?'noindex, nofollow':'index, follow, max-image-preview:large'},injectTo:'head'},
    ...(siteUrl?[
     {tag:'link',attrs:{rel:'canonical',href:siteUrl},injectTo:'head'},
     {tag:'meta',attrs:{property:'og:url',content:siteUrl},injectTo:'head'},
    ]:[]),
   ]};
  },
  buildStart(){if(!siteUrl)this.warn('Defina SITE_URL antes da publicação para gerar canonical e URLs absolutas da imagem OG. Na Vercel, o domínio automático também é reconhecido.');},
 };
}
