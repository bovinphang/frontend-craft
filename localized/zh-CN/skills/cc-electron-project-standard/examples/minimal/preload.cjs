const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',Object.freeze({setTitle:title=>ipcRenderer.invoke('document:set-title',{title})}));
