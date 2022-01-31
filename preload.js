const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
    'dataapi', {
    getlist: () => ipcRenderer.invoke("getlist"),
    setlist: (data) => ipcRenderer.invoke("setlist", data),
    on: (channel, func) => { //rendererでの受信用
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
}); 
