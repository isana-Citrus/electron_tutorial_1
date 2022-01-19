const electron = require("electron");   //electron読み込んで
const { app, BrowserWindow } = electron;//electronからapp,BrowserWindowを取り出す
const path = require("path");           //pathも使う
let mainWindow;

//electron が準備終わったとき
app.on("ready", function () {
    //新しいウインドウを開く
    mainWindow = new BrowserWindow();
    //mainWindowでhtmlファイルを開く
    //"file://" + path.join(__dirname, 'index.html');>> file://作業ディレクトリ/index.html
    mainWindow.loadURL("file://" + path.join(__dirname, 'index.html'));

    //メインウインドウが閉じたらアプリが終了する
    mainWindow.on("closed", function () {
        app.quit();
    });
});