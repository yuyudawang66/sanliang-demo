const $=s=>document.querySelector(s);
const product=SanliangProducts[new URLSearchParams(location.search).get('id')]||SanliangProducts['nano-speedy'];
function displaySize(value){const v=String(value||'—');const dims=v.split(/\s*[×xX]\s*/);return dims.length>2?dims.slice(0,2).join(' × '):v.replace(/\s*cm$/i,'');}
const photos=product.photos.map((src,i)=>({src,alt:product.name+(product.generatedPhotoIndices?.includes(i)?' AI视角示意 ':' 实拍 ')+(i+1)}));
const imagePath=i=>photos[((i%photos.length)+photos.length)%photos.length].src;
let photoIndex=0,condition=product.initial,saved=false;
try{saved=JSON.parse(localStorage.getItem('sanliang-detail-saved')||'[]').includes(product.id);}catch{}
function notify(message){$('.toast').textContent=message;$('.toast').classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('.toast').classList.remove('visible'),2600);}
function syncSaved(){$('.save-product').setAttribute('aria-pressed',String(saved));$('.save-product').setAttribute('aria-label',saved?'取消收藏商品':'收藏商品');}
$('.save-product').onclick=()=>{saved=!saved;try{const stored=JSON.parse(localStorage.getItem('sanliang-detail-saved')||'[]');const ids=new Set(Array.isArray(stored)?stored:[]);saved?ids.add(product.id):ids.delete(product.id);localStorage.setItem('sanliang-detail-saved',JSON.stringify([...ids]));}catch{}syncSaved();notify(saved?'已收藏':'已取消收藏');};syncSaved();
$('.back').onclick=e=>{const ref=document.referrer;try{const url=new URL(ref);if(url.origin===location.origin&&['/','/index.html','/search.html'].includes(url.pathname)){e.preventDefault();history.back();}}catch{}};
function renderViewer(){const img=$('.viewer-image img');img.src=imagePath(photoIndex);img.alt=photos[photoIndex].alt;$('.viewer-controls span').textContent=(photoIndex+1)+' / '+photos.length;fitCatalogImage(img,photoIndex);}
function showPhoto(i){photoIndex=((i%photos.length)+photos.length)%photos.length;renderViewer();$('.photo-viewer').showModal();}
$('.gallery-photo').onclick=()=>showPhoto(photoIndex);
$('.close-viewer').onclick=()=>$('.photo-viewer').close();
$('.previous-photo').onclick=()=>{photoIndex=(photoIndex+photos.length-1)%photos.length;renderViewer();};
$('.next-photo').onclick=()=>{photoIndex=(photoIndex+1)%photos.length;renderViewer();};
$('.photo-viewer').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('.previous-photo').click();if(e.key==='ArrowRight')$('.next-photo').click();});
$('.photo-count').onclick=()=>{photoIndex=(photoIndex+1)%photos.length;const img=$('.gallery-photo img');img.src=imagePath(photoIndex);img.alt=photos[photoIndex].alt;$('.gallery-photo').classList.toggle('alternate-photo',photoIndex!==0);$('.photo-count').textContent=(photoIndex+1)+'/'+photos.length;};
document.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>showPhoto(Number(b.dataset.photo)));
$('.view-photos').onclick=()=>$('#photos').scrollIntoView({behavior:'smooth',block:'start'});
$('.view-details').onclick=()=>showPhoto(Math.min(2,photos.length-1));
document.querySelectorAll('.condition-option').forEach((b,i)=>{b.dataset.condition=product.variants[i].condition;b.querySelector('span:last-child').textContent=product.variants[i].condition;b.onclick=()=>{applyVariant(i);};});
$('.expand-photos').onclick=()=>{const b=$('.expand-photos'),expanded=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(expanded));$('.photos').classList.toggle('expanded',expanded);$('.expanded-photos').hidden=!expanded;if(expanded&&!$('.expanded-photos').childElementCount){for(let i=0;i<photos.length;i++){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','查看'+photos[i].alt);const img=document.createElement('img');img.src=imagePath(i);img.alt=photos[i].alt;button.append(img);button.onclick=()=>showPhoto(i);$('.expanded-photos').append(button);}}b.firstChild.textContent=expanded?'收起详情':'展开详情';};
$('.expand-faq').onclick=()=>{const b=$('.expand-faq'),expanded=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(expanded));$('.faq').classList.toggle('expanded',expanded);b.firstChild.textContent=expanded?'收起问题':'点击展开';};
const sheetContents={
 delivery:{title:'物流信息',html:'<p>快递：免运费</p><p>24小时发货 · 后日达</p><p>实际送达时间以订单中的物流信息为准。</p>'},
 services:{title:'商品服务',html:'<p>7天无理由退换</p><p>发货超时赔付</p><p>防伪包装</p>'},
 coupons:{title:'选择优惠券',html:'<button data-coupon="cash">¥1000 优惠券 · 满5000可用</button><button data-coupon="shipping">包邮券 · 满5000可用</button>'},
 support:{title:'联系客服',html:'<p>咨询商品：LV Nano Speedy M81085</p><p>客服会话尚未接入。</p>'},
 cart:{title:'购物车',html:'<p>当前没有已加入购物车的商品。</p>'},
 exchange:{title:'商品置换',html:'<p>LV 路易威登 Nano Speedy 老花迷你枕头包</p><p>置换服务尚未接入。</p>'},
 purchase:{title:'确认商品信息',html:'<p>LV 路易威登 Nano Speedy 老花迷你枕头包</p><dl><dt>货号</dt><dd>M81085</dd><dt>价格</dt><dd>¥6697</dd></dl><p class="selected-condition"></p><p>下单与支付服务尚未接入。</p>'},
 report:{title:'鉴别报告说明',html:'<p>报告编码：589465577</p><p>外观 98 · 五金 96 · 氧化 97 · 成色 99</p><p>报告内容来自该商品的设计稿。</p>'},
 variants:{title:'成色选项',html:'<p>当前提供的商品样例支持以下成色选项：</p><button data-select-condition="97新">97新</button><button data-select-condition="7成新">7成新</button><button data-select-condition="6成新">6成新</button>'}
};
function openSheet(name){if(name==='purchase'){location.href='order.html?id='+encodeURIComponent(product.id)+'&condition='+encodeURIComponent(condition);return;}const content=sheetContents[name];if(!content)return;$('#sheet-title').textContent=content.title;$('.sheet-content').innerHTML=content.html;if(name==='purchase'){$('.sheet-content>p').textContent=product.name;const dd=$('.sheet-content').querySelectorAll('dd');dd[0].textContent=product.model||'未提供';dd[1].textContent='¥'+selectedVariant.price;$('.selected-condition').textContent='已选成色：'+condition;}if(name==='variants'){const buttons=$('.sheet-content').querySelectorAll('button');buttons.forEach((b,i)=>{b.dataset.selectCondition=product.variants[i].condition;b.textContent=product.variants[i].condition;});}if(name==='report')$('.sheet-content').textContent='当前成色：'+condition+'。'+selectedVariant.wear+'；五金：'+selectedVariant.hardware+'。成色信息为演示配置。';if(name==='support'||name==='exchange')$('.sheet-content>p').textContent=product.name;$('.sheet-content').querySelectorAll('[data-coupon]').forEach(b=>b.onclick=()=>{b.classList.toggle('selected');b.setAttribute('aria-pressed',b.classList.contains('selected'));notify(b.classList.contains('selected')?'已选用优惠券':'已取消选用');});$('.sheet-content').querySelectorAll('[data-select-condition]').forEach(b=>b.onclick=()=>{document.querySelector('[data-condition="'+b.dataset.selectCondition+'"]').click();$('.sheet').close();});$('.sheet').showModal();}
document.querySelectorAll('[data-sheet]').forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));$('.all-variants').onclick=$('.for-sale').onclick=()=>openSheet('variants');$('.close-sheet').onclick=()=>$('.sheet').close();$('.sheet').onclick=e=>{if(e.target===$('.sheet')){const r=e.target.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)e.target.close();}};
$('.share').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);notify('已复制商品链接');}catch{notify('请复制浏览器地址栏中的商品链接');}};
// The report grows with its text; decorative assets no longer set its content height.
const reportCard=$('.report-card'),reportContent=document.createElement('div');reportContent.className='report-content';
const reportSummary=document.createElement('div');reportSummary.className='report-summary';
reportSummary.append($('.report-stamp'),$('.report-product'));
const reportGradeRow=document.createElement('div');reportGradeRow.className='report-grade-row';
const reportGradeCopy=document.createElement('div');reportGradeCopy.className='report-grade-copy';reportGradeCopy.append($('.report-grade-label'),$('.report-condition-note'));
reportGradeRow.append($('.report-grade'),reportGradeCopy,$('.report-help'));reportSummary.append(reportGradeRow,$('.report-scores'));
const reportParameterPanel=document.createElement('div');reportParameterPanel.className='report-parameter-panel';reportParameterPanel.append($('.report-parameters-title'),$('.report-parameters'));
reportContent.append(reportSummary,reportParameterPanel);reportCard.append(reportContent);
function syncReportSize(){const width=$('.report-viewport').clientWidth;if(!width)return;const scale=width/352;$('.report-section').style.setProperty('--report-scale',scale);$('.report-viewport').style.height=(reportCard.offsetHeight*scale)+'px';}
const reportObserver=new ResizeObserver(entries=>{for(const e of entries){if(e.target.classList.contains('product-page'))$('.product-page').style.setProperty('--page-scale',e.contentRect.width/375);}syncReportSize();});
reportObserver.observe($('.report-viewport'));reportObserver.observe(reportCard);reportObserver.observe($('.product-page'));syncReportSize();

let selectedVariant=product.variants[0];
function applyVariant(index){
 selectedVariant=product.variants[index];condition=selectedVariant.condition;
 document.querySelectorAll('.condition-option').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
 if(window.RollingNumber){RollingNumber.update($('.product-price span'),selectedVariant.price,{integerDigits:Math.max(...product.variants.map(v=>String(v.price).length)),duration:780,respectReducedMotion:false})}else{$('.product-price span').textContent=selectedVariant.price;}
 $('.variant-parameters').textContent='成色：'+condition+' · '+selectedVariant.wear+' · 五金：'+selectedVariant.hardware+' · 样例编号：'+selectedVariant.inventory;
 $('.report-scores').querySelectorAll('dd').forEach((el,i)=>el.textContent=Math.max(0,selectedVariant.grade-[1,3,2,0][i]));$('.report-parameters').querySelectorAll('dd')[5].textContent=product.conditionPart?selectedVariant.hardware:(selectedVariant.grade>=90?'轻微划痕':selectedVariant.grade>=70?'可见划痕':'划痕氧化');$('.report-grade strong').textContent=selectedVariant.grade;$('.report-grade-label').textContent=condition;$('.report-condition-note').textContent=selectedVariant.wear;
}
document.title=product.name+' · 三良中古';$('.summary h2').textContent=product.name;$('.model-name').textContent=product.subtitle;
const params=$('.parameter-row').querySelectorAll('dd');[product.model||'未提供',displaySize(product.size),product.brand,product.year].forEach((v,i)=>params[i].textContent=v);
$('.original-price').hidden=false;$('.original-price').textContent='原价 ¥'+(product.originalPrice||(product.id==='nano-speedy'?7697:Math.round(product.basePrice*1.15)));$('.views').hidden=false;$('.bestseller-badge').hidden=false;$('.bestseller-icon').hidden=false;
$('.photo-count').textContent='1/'+photos.length;
$('.gallery-photo img').src=imagePath(0);$('.gallery-photo img').alt=product.name;
if(product.id!=='nano-speedy'){
 $('.gallery-photo').classList.add('catalog-photo');
 $('.report-section').hidden=false;
 $('.all-variants span').textContent='3款';$('.for-sale span').textContent='成色';
 $('.condition-options').querySelectorAll('img').forEach(img=>img.src=imagePath(0));
 $('.condition-options').querySelectorAll('.photo-crop').forEach(el=>el.classList.add('catalog-thumb'));
 document.querySelectorAll('.photos>[data-photo]').forEach((b,i)=>{b.dataset.photo=String(i%photos.length);b.classList.add('catalog-photo');b.querySelector('img').src=imagePath(i);b.querySelector('img').alt=product.name;b.onclick=()=>showPhoto(i);if(i>=photos.length)b.hidden=true;else b.hidden=false;});
}
const info=document.createElement('p');info.className='variant-parameters';info.hidden=true;$('.fulfillment').append(info);
const note=document.createElement('p');note.className='demo-pricing-note';note.textContent='商品参数、成色及价格含演示数据，实际以商品信息为准';note.hidden=true;$('.summary').append(note);
applyVariant(Math.max(0,product.variants.findIndex(v=>v.condition===new URLSearchParams(location.search).get('condition'))));

$('.report-product').textContent=product.name+' '+(product.model||'');
$('.report-code').textContent='演示报告：'+(product.model||product.id);
$('.report-guarantee').textContent='一物一验 · 商品鉴别信息';
const reportValues=$('.report-parameters').querySelectorAll('dd');
[product.model,displaySize(product.size),product.brand,product.color||'黑色',product.year,product.conditionPart?selectedVariant.hardware:(selectedVariant.grade>=90?'轻微划痕':selectedVariant.grade>=70?'可见划痕':'划痕氧化')].forEach((v,i)=>reportValues[i].textContent=v||'—');

const photoFitObservers=new WeakMap();
function fitCatalogImage(img,index){if(!product.photoBounds)return;const fit=()=>{const b=product.photoBounds[index%photos.length];if(!b||!img.naturalWidth)return;const parent=img.parentElement,w=parent.clientWidth,h=parent.clientHeight;if(!w||!h)return;let scale=(parent.classList.contains('gallery-photo')?1:.92)*Math.min(w/(b[2]-b[0]),h/(b[3]-b[1]));if(parent.matches('.photos .photo-top,.photos .photo-front')){let contentHeight=h*.92;document.querySelectorAll('.photos .photo-top,.photos .photo-front').forEach(slot=>{const box=product.photoBounds[Number(slot.dataset.photo)];if(box)contentHeight=Math.min(contentHeight,slot.clientWidth*.92*(box[3]-box[1])/(box[2]-box[0]));});scale=contentHeight/(b[3]-b[1]);}Object.assign(img.style,{position:'absolute',inset:'auto',clipPath:`inset(${b[1]*scale}px ${(img.naturalWidth-b[2])*scale}px ${(img.naturalHeight-b[3])*scale}px ${b[0]*scale}px)`,width:img.naturalWidth*scale+'px',height:img.naturalHeight*scale+'px',maxWidth:'none',maxHeight:'none',left:((w-(b[2]-b[0])*scale)/2-b[0]*scale)+'px',top:((h-(b[3]-b[1])*scale)/2-b[1]*scale)+'px'});};img.onload=fit;photoFitObservers.get(img)?.disconnect();const observer=new ResizeObserver(fit);photoFitObservers.set(img,observer);observer.observe(img.parentElement);fit();}
if(product.photoBounds){
 if(photos.length>=3)$('.photos').classList.add('three-view');
 document.querySelectorAll('.photos>[data-photo]').forEach((b,slot)=>{const i=product.id==='nano-speedy'?[1,2,0][slot]:slot;b.hidden=i>=photos.length;if(b.hidden)return;b.querySelector('img').src=imagePath(i);b.querySelector('img').alt=photos[i].alt;b.dataset.photo=String(i);b.onclick=()=>showPhoto(i);b.setAttribute('aria-label','查看'+photos[i].alt);});
 document.querySelectorAll('.photos>[data-photo]').forEach(b=>{if(!b.hidden)fitCatalogImage(b.querySelector('img'),Number(b.dataset.photo))});
 $('.gallery-photo').classList.add('catalog-photo');fitCatalogImage($('.gallery-photo img'),0);document.querySelectorAll('.condition-photo img').forEach(img=>fitCatalogImage(img,0));
 $('.photo-count').onclick=()=>{photoIndex=(photoIndex+1)%photos.length;const img=$('.gallery-photo img');img.src=imagePath(photoIndex);img.alt=photos[photoIndex].alt;fitCatalogImage(img,photoIndex);$('.photo-count').textContent=(photoIndex+1)+'/'+photos.length;};
}
if(product.photoBounds){$('.expand-photos').addEventListener('click',()=>{$('.expanded-photos').querySelectorAll('button').forEach((b,i)=>{b.style.position='relative';b.style.overflow='hidden';fitCatalogImage(b.querySelector('img'),i);});});}

if(product.description){const copy=document.createElement('p');copy.className='category-product-description';copy.textContent=product.description;$('.summary').append(copy);const style=document.createElement('style');style.textContent='.category-product-description{font:400 11px/1.8 DetailNoto,sans-serif;color:#888;margin-top:12px;overflow-wrap:anywhere}';document.body.append(style);}

if(product.conditionPart){$('.report-scores').querySelectorAll('dt')[1].textContent=product.conditionPart;$('.report-scores').querySelectorAll('dt')[2].textContent='完整';$('.report-parameters').querySelectorAll('dt')[5].textContent=product.conditionPart;}
