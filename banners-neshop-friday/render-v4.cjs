const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();fs.mkdirSync(__dirname+'/final',{recursive:true});
for(const scale of (process.argv[2]==='quick'?[1]:[1,2])){const p=await b.newPage({viewport:{width:2000,height:1200},deviceScaleFactor:scale});
 await p.goto('file://'+__dirname+'/composite-v4.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 for(const [id,sz] of [['b1920','1920x480'],['b1500','1500x250'],['b600','600x338']])
  await p.locator('#'+id).screenshot({path:`${__dirname}/final/neshop-friday-${sz}${scale==2?'@2x':''}.png`});
 await p.close()}
await b.close()})();
