const electron = require("electron");   //electron読み込んで
const { app, BrowserWindow, ipcMain, Menu } = electron;//electronからapp,BrowserWindowを取り出す
const path = require("path");           //pathも使う
const Store = require('electron-store');//storeも読み込んでおく
//console.log(path.join(__dirname, 'preload.js'))
//console.log(app.getPath('userData'))
let mainWindow;
const Store_Data = new Store({ name: "data" });//Dataを格納しておくStore
//electron が準備終わったとき
app.on("ready", function () {
    //新しいウインドウを開く
    mainWindow = new BrowserWindow({
        width: 320,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    //mainWindowでhtmlファイルを開く
    //"file://" + path.join(__dirname, 'index.html');>> file://作業ディレクトリ/index.html
    mainWindow.loadURL("file://" + path.join(__dirname, 'index.html'));

    //メインウインドウが閉じたらアプリが終了する
    mainWindow.on("closed", function () {
        app.quit();
    });
});
// 全件削除処理
function todo_all_del() {
    Store_Data.delete('ToDoList');//ToDoListのデータを削除
    mainWindow.webContents.send("todo_all_delete");//mainWindowへipc通信を送信
}
// IPC通信(DataAPI関係)
//getlist(data取得処理)
ipcMain.handle('getlist', async (event, data) => {
    return Store_Data.get('ToDoList', []);//ToDoListがあれば取り出し、なければからのリストを返す
});

//getlist(data保存処理)
ipcMain.handle("setlist", async (event, data) => {
    Store_Data.set('ToDoList', data);       // 保存
});

/////////////////////
//MENUテンプレ
/////////////////////
// 実行環境がmacOSならtrue
const isMac = (process.platform === 'darwin');  // 'darwin' === macOS
const menu_temp = [
    {
        label: "ファイル",
        submenu: [
            {
                label: "アイテムを消す",
                click() {
                    todo_all_del();
                }
            },
            {
                label: "終了",
                accelerator: isMac ? "Command+Q" : "Ctrl+Q",//三項演算子というらしい
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//MacならMac用のメニューを先頭においておく
if (isMac) {
    menu_temp.unshift({
        label: app.name,
        role: "appMenu",
    });
}
//パッケージ化されてなければ開発者ツールを開けるようにする
if (!app.isPackaged) {
    menu_temp.push({
        label: "開発者ツール",
        submenu: [
            {
                label: "開発者ツール",
                accelerator: process.platform == "darwin" ? "Command+Shift+I" : "Ctrl+Shift+I",
                click(item, focusedwindow) {
                    focusedwindow.toggleDevTools();
                }
            },
            {
                label: "キャッシュを無視してリロード",
                accelerator: process.platform == "darwin" ? "Command+Alt+R" : "Ctrl+Alt+R",
                role: 'forceReload',
            }
        ]
    });
}
//メニューをセット
Menu.setApplicationMenu(Menu.buildFromTemplate(menu_temp));