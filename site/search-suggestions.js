(function(root){
 const categories=['单肩包','双肩包','斜挎包','手提包','耳钉','围巾','墨镜','手表','项链','帽子','衣服'];
 const brands=[
  {name:'香奈儿',latin:'CHANEL',aliases:['香奈儿','香奈尔','chanel'],categories},
  {name:'迪奥',latin:'DIOR',aliases:['迪奥','dior'],categories:['单肩包','手提包','马鞍包','耳钉','项链','香水','鞋']},
  {name:'古驰',latin:'GUCCI',aliases:['古驰','古奇','gucci'],categories:['单肩包','双肩包','手提包','腰带','围巾','墨镜','鞋']},
  {name:'路易威登',latin:'LV',aliases:['路易威登','路易斯威登','louis vuitton','lv'],categories:['单肩包','双肩包','斜挎包','手提包','钱包','围巾','鞋']},
  {name:'蔻驰',latin:'COACH',aliases:['蔻驰','coach'],categories:['单肩包','手提包','托特包','钱包','鞋']},
  {name:'卡地亚',latin:'Cartier',aliases:['卡地亚','cartier'],categories:['戒指','手镯','项链','耳钉','手表']},
  {name:'赛琳',latin:'CELINE',aliases:['赛琳','思琳','celine'],categories:['单肩包','手提包','腋下包','墨镜','腰带']},
  {name:'缪缪',latin:'MIUMIU',aliases:['缪缪','miumiu','miu miu'],categories:['手提包','单肩包','鞋','衣服','帽子']},
  {name:'普拉达',latin:'PRADA',aliases:['普拉达','prada'],categories:['单肩包','双肩包','手提包','墨镜','鞋']},
  {name:'爱马仕',latin:'HERMÈS',aliases:['爱马仕','hermes','hermès'],categories:['手提包','单肩包','丝巾','手镯','腰带']}
 ];
 const groups=[
  ['包','包包','手袋','背包','单肩包','双肩包','斜挎包','手提包','托特包','腋下包','钱包','马鞍包'],
  ['围巾','丝巾','羊毛围巾','羊绒围巾','披肩'],
  ['戒指','手镯','手链','项链','耳钉','耳环','首饰','饰品'],
  ['墨镜','太阳镜','眼镜'],['手表','腕表','机械表','石英表'],
  ['鞋','鞋子','运动鞋','休闲鞋','高跟鞋','靴子','皮鞋'],
  ['衣服','服装','外套','大衣','毛衣','连衣裙'],['帽子','棒球帽','渔夫帽','针织帽'],
  ['香水','香氛','淡香水'],['家居','中古家居','摆件','中古摆件','椅子','家具']
 ];
 const normalize=s=>s.trim().toLowerCase().replace(/\s+/g,' ');
 function recommend(value){
  const term=value.trim().replace(/\s+/g,' '), q=normalize(term);
  if(!q)return {brand:null,items:[]};
  const candidates=brands.flatMap(b=>b.aliases.map(alias=>({b,alias}))).sort((a,b)=>b.alias.length-a.alias.length);
  const exact=candidates.find(({alias})=>q.startsWith(alias));
  const partial=exact||candidates.find(({alias})=>alias.startsWith(q));
  if(partial){
   const {b,alias}=partial,suffix=exact?q.slice(alias.length).trim():'';
   const keyword=/[a-z]/i.test(term)?b.latin:b.name;
   const related=b.categories.filter(c=>!suffix||normalize(c).includes(suffix));
   return {brand:b.latin==='CHANEL'?'CHANEL':null,items:related.map(category=>({keyword,category,query:keyword+' '+category}))};
  }
  const matched=groups.find(g=>g.some(x=>normalize(x).includes(q)||q.includes(normalize(x))));
  if(!matched)return {brand:null,items:[]};
  const direct=matched.filter(x=>normalize(x).includes(q)&&normalize(x)!==q);
  const base=matched.includes(term)?term:matched.find(x=>q.includes(normalize(x)))||matched[0];
  const labels=[term,...direct,...brands.filter(b=>b.categories.some(c=>c.includes(base)||base.includes(c))).map(b=>b.name+' '+base),...matched.filter(x=>x!==term)];
  return {brand:null,items:[...new Set(labels)].slice(0,11).map(text=>({text,highlight:term,query:text}))};
 }
 function normalizeSearch(value){
  let q=normalize(value);
  const aliases=brands.flatMap(b=>b.aliases.map(alias=>({alias,name:b.latin==='LV'?'louis vuitton':b.latin.toLowerCase()}))).sort((a,b)=>b.alias.length-a.alias.length);
  const match=aliases.find(x=>q.includes(x.alias));
  if(match)q=q.replace(match.alias,match.name+' ');
  return q.trim().replace(/\s+/g,' ');
 }
 const api={recommend,normalizeSearch};if(typeof module==='object'&&module.exports)module.exports=api;else root.SanliangSuggestions=api;
})(typeof window==='object'?window:this);
