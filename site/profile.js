const toast=message=>{const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2200)};
const dialog=document.querySelector('dialog'),nameLabel=document.querySelector('#username'),input=dialog.querySelector('input');
try{nameLabel.textContent=localStorage.getItem('sanliang-profile-name')||'用户名'}catch{}
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=async()=>{const action=b.dataset.action;if(action==='编辑昵称'){input.value=nameLabel.textContent;dialog.showModal();return}if(action==='复制ID'){try{await navigator.clipboard.writeText('1569487564');toast('个人ID已复制')}catch{toast('个人ID：1569487564')}return}if(action==='消息'){toast('暂无新消息');return}toast(action+'页面暂未提供，当前为本地预览')});
dialog.addEventListener('close',()=>{if(dialog.returnValue==='save'&&input.value.trim()){nameLabel.textContent=input.value.trim();try{localStorage.setItem('sanliang-profile-name',nameLabel.textContent)}catch{}}});
document.querySelectorAll('nav a[href="#"]').forEach(a=>a.onclick=e=>{e.preventDefault();toast(a.textContent.trim()+'页面暂未接入')});
