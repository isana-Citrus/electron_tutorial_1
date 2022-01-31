const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
    'dataapi', {
    getlist: () => ipcRenderer.invoke("getlist"),
    setlist: (data) => ipcRenderer.invoke("setlist", data),
    on_todo_all_del: (func) => {
        ipcRenderer.on("todo_all_delete", (event, ...args) => func(...args));
    }
    //on: (channel, func) => {ipcRenderer.on(channel, (event, ...args) => func(...args));},

}); 
