const $=s=>document.querySelector(s);let historyTerms;try{const stored=localStorage.getItem('sanliang-search-history');const parsed=stored?JSON.parse(stored):['香奈儿包','香奈儿围巾','香奈儿耳钉'];historyTerms=Array.isArray(parsed)?parsed.filter(x=>typeof x==='string').slice(0,12):[];}catch{historyTerms=[];}
const discoveries=[['香奈儿墨镜','香奈儿 flap','dior墨镜','香奈儿 单肩包','gucci墨镜','香奈儿鞋'],['中古包包','CHANEL 单肩包','Cartier 戒指','COACH 手提包','香奈儿围巾','CELINE 单肩包']];let discoveryIndex=0;const templates=[...document.querySelectorAll('.rank-list .rank-row')].map(e=>e.cloneNode(true));
function notify(text){$('.message').textContent=text;$('.message').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('.message').classList.remove('show'),2400);}
function persist(){try{localStorage.setItem('sanliang-search-history',JSON.stringify(historyTerms));}catch{}}
function chip(text){const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=text;b.title=text;b.onclick=()=>runSearch(text);return b;}
function renderHistory(){const el=$('#history');el.replaceChildren(...historyTerms.map(chip));if(!historyTerms.length){const note=document.createElement('p');note.className='history-empty';note.textContent='暂无搜索记录';el.append(note);}}
function renderDiscovery(){$('.discovery-chips').replaceChildren(...discoveries[discoveryIndex].map(chip));}
function recommended(){setSuggestions(false);$('.results').hidden=true;$('.popular').hidden=false;$('.history-section').hidden=false;$('.discovery-section').hidden=false;$('.query-field input').value='';}
function runSearch(term){term=term.trim();if(!term){notify('请输入搜索关键词');$('.query-field input').focus();return;}setSuggestions(false);$('.query-field input').value=term;historyTerms=[term,...historyTerms.filter(x=>x!==term)].slice(0,12);persist();renderHistory();$('.history-section').hidden=true;$('.discovery-section').hidden=true;$('.popular').hidden=true;$('.results').hidden=false;$('.results h2').textContent='搜索结果';const tokens=SanliangSuggestions.normalizeSearch(term).split(/\s+/).filter(Boolean);const matches=templates.filter(row=>tokens.every(t=>SanliangSuggestions.normalizeSearch(row.dataset.term).includes(t)));$('#results-list').replaceChildren(...matches.map(t=>{const c=t.cloneNode(true);c.onclick=()=>{try{sessionStorage.setItem('sanliang-search-return',JSON.stringify({term:$('.query-field input').value,scroll:window.scrollY}));}catch{}location.href='index.html?product='+encodeURIComponent(c.dataset.product);};return c;}));$('.no-results').hidden=matches.length>0;}
$('#query-form').onsubmit=e=>{e.preventDefault();runSearch($('.query-field input').value);};$('.query-field input').oninput=e=>{if(e.isComposing)return;updateSuggestions();};$('.query-field input').addEventListener('compositionend',updateSuggestions);$('.query-field input').addEventListener('focus',()=>{if($('.query-field input').value.trim())updateSuggestions();});$('.clear-history').onclick=()=>{historyTerms=[];persist();renderHistory();notify('已清除搜索历史');};$('.refresh').onclick=()=>{discoveryIndex=(discoveryIndex+1)%discoveries.length;renderDiscovery();};$('.camera').onclick=()=>notify('当前为前端预览，拍照搜索尚未接入');$('.more').onclick=()=>{notify('已展示设计稿中的全部六件热门商品');$('.rank-list').scrollIntoView({behavior:'smooth',block:'nearest'});};$('.reset-search').onclick=()=>{recommended();$('.query-field input').focus();};document.querySelectorAll('.rank-list .rank-row').forEach(b=>b.onclick=()=>{location.href='index.html?product='+encodeURIComponent(b.dataset.product);});renderHistory();renderDiscovery();

const initialSearchIcon=$('.query-field>img').getAttribute('src');
const initialStatus=$('.search-status img').getAttribute('src');
const initialBackIcon=$('.back img').getAttribute('src');
function setSuggestions(active){
 $('.search-page').classList.toggle('is-suggesting',active);
 $('.suggestions').hidden=!active;$('.clear-query').hidden=!active;$('.camera').hidden=active;
 $('.suggestion-indicator').hidden=!active;
 $('.search-status img').src=active?'assets/search-suggestions/system-status.svg':initialStatus;
 $('.query-field>img').src=active?'assets/search-suggestions/icon-search.svg':initialSearchIcon;
 $('.back img').src=active?'assets/search-suggestions/icon-back.svg':initialBackIcon;
 if(active){$('.history-section').hidden=true;$('.discovery-section').hidden=true;$('.popular').hidden=true;$('.results').hidden=true;}
}
function updateSuggestions(){
 const term=$('.query-field input').value.trim();if(!term){recommended();return;}
 setSuggestions(true);
 const result=SanliangSuggestions.recommend(term);
 $('.brand-match').hidden=result.brand!=='CHANEL';
 $('.suggestion-list').replaceChildren(...result.items.map(item=>{
  const b=document.createElement('button');b.type='button';b.className='suggestion-row';
  if(item.keyword){
   const k=document.createElement('span');k.className='suggestion-keyword';k.textContent=item.keyword;
   const c=document.createElement('span');c.className='suggestion-category';c.textContent=item.category;b.append(k,c);
  }else{
   b.classList.add('suggestion-text-row');const i=item.text.toLowerCase().indexOf(item.highlight.toLowerCase());
   if(i<0){b.textContent=item.text;}else{
    b.append(document.createTextNode(item.text.slice(0,i)));
    const mark=document.createElement('span');mark.className='suggestion-keyword';mark.textContent=item.text.slice(i,i+item.highlight.length);b.append(mark,document.createTextNode(item.text.slice(i+item.highlight.length)));
   }
  }
  b.onclick=()=>{runSearch(item.query);$('.query-field input').blur();};return b;
 }));
 $('.suggestion-empty').hidden=result.items.length>0;
}
$('.clear-query').onclick=()=>{recommended();$('.query-field input').focus();};
$('.brand-match').onclick=()=>{runSearch('CHANEL');$('.query-field input').blur();};
$('.back').addEventListener('click',e=>{if($('.search-page').classList.contains('is-suggesting')||!$('.results').hidden){e.preventDefault();recommended();$('.query-field input').blur();}});

// Restore the search result when returning from the product page.
try{const returned=JSON.parse(sessionStorage.getItem('sanliang-search-return')||'null');sessionStorage.removeItem('sanliang-search-return');if(returned&&typeof returned.term==='string'){runSearch(returned.term);requestAnimationFrame(()=>window.scrollTo(0,Number(returned.scroll)||0));}}catch{}
window.addEventListener('pageshow',e=>{if(e.persisted){try{sessionStorage.removeItem('sanliang-search-return');}catch{}}});
