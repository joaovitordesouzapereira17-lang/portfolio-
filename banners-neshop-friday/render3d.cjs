const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const scale of [1,2]){const p=await b.newPage({viewport:{width:2000,height:1000},deviceScaleFactor:scale});
 await p.goto('file://'+__dirname+'/composite.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 for(const [id,sz] of [['b1920','1920x480'],['b1500','1500x250'],['b600','600x338']])
  await p.locator('#'+id).screenshot({path:`${__dirname}/3d/neshop-friday-3d-${sz}${scale==2?'@2x':''}.png`});
 await p.close()}
await b.close()})();
