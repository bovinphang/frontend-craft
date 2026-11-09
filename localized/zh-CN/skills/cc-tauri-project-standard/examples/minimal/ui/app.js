document.querySelector('#read').addEventListener('click',async()=>{
  const result=document.querySelector('#result');
  try { result.textContent=await window.__TAURI__.core.invoke('read_document',{name:'hello.txt'}); }
  catch { result.textContent='Document unavailable'; }
});
