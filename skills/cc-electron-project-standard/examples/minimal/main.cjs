const { app, BrowserWindow, ipcMain, protocol }=require('electron');
const fs=require('node:fs/promises');const path=require('node:path');
const {createSetTitle}=require('./boundary.cjs');
const trustedUrl='app://craft/index.html';
protocol.registerSchemesAsPrivileged([{scheme:'app',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
app.whenReady().then(()=>{
  const assets=new Map([[trustedUrl,['index.html','text/html']],['app://craft/renderer.js',['renderer.js','text/javascript']]]);
  protocol.handle('app',async request=>{
    const asset=request.method==='GET'&&assets.get(request.url);
    if(!asset)return new Response('Not found',{status:404});
    return new Response(await fs.readFile(path.join(__dirname,asset[0])),{headers:{'Content-Type':asset[1],'Content-Security-Policy':"default-src 'self'; script-src 'self'; object-src 'none'; connect-src 'none'"}});
  });
  const win=new BrowserWindow({webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  ipcMain.handle('document:set-title',createSetTitle({trustedContentsId:win.webContents.id,trustedUrl,setTitle:title=>win.setTitle(title)}));
  win.webContents.on('will-navigate',(event,url)=>{if(url!==trustedUrl)event.preventDefault();});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.on('closed',()=>ipcMain.removeHandler('document:set-title'));
  return win.loadURL(trustedUrl);
}).catch(()=>{console.error('Application initialization failed');app.quit();});
app.on('window-all-closed',()=>app.quit());
