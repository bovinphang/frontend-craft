document.querySelector('#set').addEventListener('click',async()=>{
  try {await window.desktop.setTitle(document.querySelector('#title').value);document.querySelector('#result').textContent='Updated';}
  catch {document.querySelector('#result').textContent='Title rejected';}
});
