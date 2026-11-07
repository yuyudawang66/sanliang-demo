// Only the outer page opens the presentation. In-frame routes keep the original app.
if(window.self===window.top&&!new URLSearchParams(location.search).has('unframed')){const target=new URL('showcase.html',location.href);target.search=location.search;target.hash=location.hash;location.replace(target.href)}
