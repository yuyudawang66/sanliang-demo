// Shared parameter sheet for every product route; content comes from the current catalog item.
const parameterDialog=document.createElement('dialog');
parameterDialog.className='parameter-sheet';parameterDialog.setAttribute('aria-labelledby','parameter-title');
parameterDialog.innerHTML='<header><h2 id="parameter-title">商品参数</h2><button aria-label="关闭商品参数"><img src="assets/parameters/icon-close.svg" width="16" height="16" alt=""></button></header><div class="parameter-content"><section class="parameter-core"><h3>核心参数</h3><div class="parameter-tiles"></div></section><section class="parameter-basic"><h3>基础参数</h3><dl></dl></section></div><div class="parameter-home"><img src="assets/product-detail/svg/system-home-indicator.svg" width="375" height="34" alt=""></div>';
document.body.append(parameterDialog);
function showParameters(){
 const isLV=product.brand==='LV'||product.brand==='LOUIS VUITTON',isNano=product.id==='nano-speedy';
 const scarf=product.id.includes('scarf'),ring=product.id.includes('cartier');
 const material=product.material||'皮革',feature=product.feature|| (ring?'精细抛光':scarf?'柔软亲肤':isLV?'耐磨抗刮':'细腻柔软');
 const tiles=parameterDialog.querySelector('.parameter-tiles');tiles.replaceChildren();
 for(const [value,label]of [[isNano?'涂层帆布...':material, product.parameterRows?.[0]?.[0]||'面料材质'],[feature+'...', '功能']]){const tile=document.createElement('div'),v=document.createElement('p'),l=document.createElement('p');v.textContent=value;v.title=value;l.textContent=label;tile.append(v,l);tiles.append(tile)}
 const rows=product.parameterRows||[['面料材质',isNano?'棉帆布 75.2%\n牛皮 18.6%\n织物 6.2%':material],['适用季节',isNano?'春季  夏季':'四季'],['类型',ring?'饰品':scarf?'配饰':'箱包'],['服饰工艺',isLV?'印花、车缝':ring?'抛光、镶嵌':scarf?'织造、印花':'车缝、压纹'],['产地',isLV?'法国 / 西班牙':product.brand==='CHANEL'?'法国 / 意大利':'法国'],['厚度','常规款'],['品牌',isLV?'路易威登/LV':product.brand],['版型',isNano?'迷你枕头包':ring?'戒指':scarf?'长方形围巾':product.id==='flap'?'翻盖手提包':'手提肩背包'],['是否含填充物','否']];
 const dl=parameterDialog.querySelector('dl');dl.replaceChildren();for(const [label,value]of rows){const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);dl.append(div)}
 parameterDialog.showModal();document.documentElement.classList.add('parameters-open');
}
const parameterTrigger=document.querySelector('.parameter-row');parameterTrigger.setAttribute('role','button');parameterTrigger.setAttribute('tabindex','0');parameterTrigger.setAttribute('aria-haspopup','dialog');parameterTrigger.setAttribute('aria-label','查看商品参数');parameterTrigger.onclick=showParameters;parameterTrigger.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showParameters()}};
parameterDialog.querySelector('header button').onclick=()=>parameterDialog.close();
parameterDialog.addEventListener('click',e=>{if(e.target===parameterDialog){const r=parameterDialog.getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)parameterDialog.close()}});
parameterDialog.addEventListener('close',()=>document.documentElement.classList.remove('parameters-open'));
