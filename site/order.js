const $=s=>document.querySelector(s),query=new URLSearchParams(location.search);
const product=SanliangProducts[query.get('id')]||SanliangProducts['nano-speedy'];
const index=Math.max(0,product.variants.findIndex(v=>v.condition===query.get('condition'))),variant=product.variants[index];
let address=null;try{const a=JSON.parse(localStorage.getItem('sanliang-address')||'null');if(a&&['name','phone','district','street'].every(k=>typeof a[k]==='string'&&a[k].trim()))address=a;}catch{}
function money(n){return '<small>¥</small>'+Number(n).toFixed(2).split('.')[0]+'.<small>'+Number(n).toFixed(2).split('.')[1]+'</small>';}
function toast(s){$('.toast').textContent=s;$('.toast').classList.add('visible');clearTimeout(toast.t);toast.t=setTimeout(()=>$('.toast').classList.remove('visible'),2800);}
$('.back').href='product.html?id='+encodeURIComponent(product.id)+'&condition='+encodeURIComponent(variant.condition);
$('.back').onclick=e=>{if(document.referrer.startsWith(location.origin+'/product.html')){e.preventDefault();history.back();}};
$('#product-photo').src=product.orderPhoto?.src||product.photos[0];$('#product-photo').alt=product.name;
if(product.orderPhoto){const {size,bounds}=product.orderPhoto;const [x,y,right,bottom]=bounds;const scale=77/Math.max(right-x,bottom-y);Object.assign($('#product-photo').style,{position:'absolute',clipPath:`inset(${y*scale}px ${(size[0]-right)*scale}px ${(size[1]-bottom)*scale}px ${x*scale}px)`,width:size[0]*scale+'px',height:size[1]*scale+'px',maxWidth:'none',left:((89-(right-x)*scale)/2-x*scale)+'px',top:((89-(bottom-y)*scale)/2-y*scale)+'px'});}

$('.product-info h2').textContent=product.name;$('.brand').textContent='品牌：'+product.brand;$('.condition').textContent=variant.condition;
$('.item-price').innerHTML=money(variant.price);document.querySelectorAll('.total').forEach(e=>e.innerHTML=money(variant.price));
function renderAddress(){const yes=!!address;$('.address').classList.toggle('has-address',yes);$('.address').setAttribute('aria-label',yes?'修改收货地址':'填写收货地址');$('.address-empty').hidden=yes;$('.address-filled').hidden=!yes;$('.modify').hidden=!yes;if(yes){$('.district').textContent=address.district;$('.street').textContent=address.street;$('.contact').textContent=address.name+'  '+address.phone;}}
renderAddress();
const panel=$('#panel'),body=$('#panel-body');function show(title,markup){$('#panel-title').textContent=title;body.innerHTML=markup;panel.showModal();}
function editAddress(){location.href='addresses.html?id='+encodeURIComponent(product.id)+'&condition='+encodeURIComponent(variant.condition);}
$('.address').onclick=editAddress;
$('.invoice').onclick=()=>{const b=$('.invoice');b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'));};
const labels={coupon:'优惠券',gift:'礼物包装',note:'订单备注',stock:'如遇缺货',agreement:'用户商品服务协议',breakdown:'金额明细'};
function openPanel(name){if(name==='coupon')show(labels[name],'<p>当前商品暂无可用优惠券。</p>');if(name==='breakdown')show(labels[name],'<p>商品金额：¥'+variant.price.toFixed(2)+'</p><p>运费：¥0.00</p><p>优惠：¥0.00</p><p>合计：¥'+variant.price.toFixed(2)+'</p>');if(name==='agreement')show(labels[name],'<p>此处为本地订单流程演示。正式商品服务协议尚未接入，勾选仅用于演示页面交互。</p><p>本页面不会创建真实订单或发起扣款。</p>');if(name==='gift'||name==='stock'){const list=name==='gift'?['无需包装','普通礼物包装（免费）']:['缺货时电话和我沟通','缺货时取消订单'];show(labels[name],list.map((v,i)=>'<button class="choice" data-choice="'+i+'">'+v+'</button>').join(''));body.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const text=list[+b.dataset.choice];if(name==='gift')$('#gift-value').textContent=text;else $('.stock-value').firstChild.textContent=text;panel.close();});}if(name==='note'){show(labels[name],'<label>订单备注<textarea maxlength="150" id="note" placeholder="可填写对本次订单的要求"></textarea></label><button class="submit">保存</button>');$('#note').value=$('#note-value').dataset.note||'';body.querySelector('.submit').onclick=()=>{const n=$('#note').value.trim();$('#note-value').textContent=n||'请选择';$('#note-value').dataset.note=n;panel.close();};}}
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));$('.support').onclick=()=>show('联系客服','<p>客服会话尚未接入。</p>');
function pay(friend){if(!address){toast('请先填写收货地址');editAddress();return;}if(!$('#agreement').checked){toast('请先阅读并勾选用户商品服务协议');$('#agreement').focus();return;}show(friend?'找人付':'确认支付','<p class="checkout-name"></p><p>已选成色：'+variant.condition+'</p><p>应付金额：¥'+variant.price.toFixed(2)+'</p><p>当前为本地演示，支付服务尚未接入，未创建真实订单。</p>');$('.checkout-name').textContent=product.name;}
$('.pay').onclick=()=>pay(false);$('.friend').onclick=()=>pay(true);
panel.onclick=e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)panel.close();}};
new ResizeObserver(entries=>{for(const e of entries)e.target.style.setProperty('--status-scale',Math.min(1,e.contentRect.width/375));}).observe($('.status'));

window.addEventListener('pageshow',()=>{try{address=JSON.parse(localStorage.getItem('sanliang-address')||'null');}catch{address=null;}renderAddress();});
