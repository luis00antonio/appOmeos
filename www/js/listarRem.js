var db;
var list = document.querySelector('ul');
var lectorChar = document.querySelector('#lectorChar');
const hoy = Date.now();
const fecha = new Date(hoy);
if (fecha.getMonth() < 7) {
window.onload = () => {
    console.log("Se carga la página.");
    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)  

    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);

    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result;
        displayData();
    };
    function displayData() {
        list.innerHTML = '';
        var transaction = db.transaction(['ourStore'], 'readonly');
        var objectStore = transaction.objectStore('ourStore');
        var myIndex = objectStore.index('remedio');
        const request = myIndex.openCursor();
        request.onsuccess = (event) => {
            var cursor = event.target.result;
            if(cursor) {
                var rem = cursor.value.remedio;
                var ids = cursor.value.id;
                var listItem = document.createElement('li');
                listItem.innerHTML = '<a href="cuadrosDilucion.html?id=' + ids + '">'
                                   + rem + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                   + '<img src="img/iconos/flecha.png" style="float: right; margin-top: 6px;" alt="flecha" type="img/png">'
                                   + '</a>';
                listItem.setAttribute("id", ids);
                list.appendChild(listItem);
                cursor.continue();
            } else {
                console.log('Todos los remedios mostrados.');
            }
        };
    };

}
// Manejador del buscador
var filtrar = () => {
    var transaction = db.transaction(['ourStore'], 'readonly');
    var objectStore = transaction.objectStore('ourStore');
    var myIndex = objectStore.index('remedio');
    var texto = lectorChar.value.toLowerCase();

    myIndex.openCursor().onsuccess = (event) => {
        var cursor = event.target.result;
        if(cursor) {
            var rem = cursor.value.remedio;
            var remMin = rem.toLowerCase();
            var id = cursor.value.id;
            if(remMin.startsWith(texto) === true) {
                location.hash = "#" + id;
                document.getElementById('lectorChar').focus();
                cursor = false;
            }
            if(cursor) {
                cursor.continue();
            }
        }
    };  
};
lectorChar.addEventListener('keyup', filtrar);
} else {
    console.log('estoy aqui');
    var mensj = 'App caducada. Instale la nueva versión';
    list.innerHTML = '';
    var listItem = document.createElement('li');
    listItem.innerHTML = '<div class="cajaBot"><a href="https://play.google.com/store/apps/details?id=www.omeos.es&hl=es&gl=US"><div class="boton"><img class="iconos" src="img/iconos/gPlay.png" type="img/png">'
                        + mensj + '</div></a>';
    list.appendChild(listItem);
}
