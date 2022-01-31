//アイテム追加ボタンを押したときの処理
async function addToDo() {
    const item = document.querySelector("#ToDoItem").value;//formの文字列取得
    if (item === "") {//itemがからだったら何もしない
        return
    }
    const ToDoList = await window.dataapi.getlist();//preloadを介してmainjsでStoreのデータを取得 
    ToDoList.push(item);//今回追加されたものを追加
    await window.dataapi.setlist(ToDoList);//preloadを介してmainjsでStoreのデータを保存
    listview();
}
//Storeデータをmain.jsからとってきて表示する処理
async function listview() {
    const ul = document.querySelector("#ToDolist");//id=ToDolistを取得する
    const clone = ul.cloneNode(false); //ul要素の中身以外を拝借
    const ToDoList = await window.dataapi.getlist();
    let i = 0;
    for (const item of ToDoList) {
        const li = document.createElement("li");//li elementを作る
        const todotext = document.createTextNode(item);//itemをテキストノードにする
        li.appendChild(todotext);//liにtodotextを入れる
        li.dataset.id = i;
        li.onclick = todo_delete;
        clone.appendChild(li);//ulに作ったliを入れる
        i = i + 1;//indexを1進める
    }
    ul.parentNode.replaceChild(clone, ul); //入れ替える


}

//li要素がクリックされたとき
async function todo_delete(event) {
    const del_index = event.target.dataset.id;//data-idを取り出す
    const ToDoList = await window.dataapi.getlist();
    ToDoList.splice(del_index, 1);
    await window.dataapi.setlist(ToDoList);//preloadを介してmainjsでStoreのデータを保存
    listview();
}
//メインプロセスからのipcを受け取る
window.dataapi.on("todo_all_delete", () => {
    listview();
});
//起動時初期化用
listview();