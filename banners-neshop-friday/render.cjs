const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const scale of [1,2]){
 const p=await b.newPage({viewport:{width:2100,height:1400},deviceScaleFactor:scale});
 await p.goto('file://'+__dirname+'/banners.html',{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
 for(const id of ['b1920','b1500','b600']){
  const n=id.slice(1);const sz={1920:'1920x480',1500:'1500x250',600:'600x338'}[n];
  await p.locator('#'+id).screenshot({path:`${__dirname}/neshop-friday-${sz}${scale==2?'@2x':''}.png`});
 }
 await p.close();}
await b.close();})();
