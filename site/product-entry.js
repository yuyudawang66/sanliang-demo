// Legacy product bookmarks enter the same animated application as homepage cards.
if(location.pathname.endsWith('/product.html')){
 const target=new URL('index.html',location.href);
 target.searchParams.set('product',new URLSearchParams(location.search).get('id')||'nano-speedy');
 const grade=new URLSearchParams(location.search).get('condition');if(grade)target.searchParams.set('condition',grade);
 location.replace(target.href);
}
