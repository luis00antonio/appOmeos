var db;
var list = document.querySelector('ul');
var lectorChar = document.querySelector('#lectorChar');
var keyP; 
var keyP2;
var busca = document.getElementById("buscador");
var preg = document.getElementById("pregunta");

window.onload = () => {
    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);
    DBOpenRequest.onerror = (event) => {
    	console.log('No se ha podido abrir la base de datos.');
    };
    DBOpenRequest.onsuccess = (event) => {
    	db = event.target.result;
    	displayData();
    };

    function displayData() {
        var transaction = db.transaction(['favoritos'], 'readonly');
        transaction.onerror = () => {
        	console.log('error en la transacción');
        };
        var objectStore = transaction.objectStore('favoritos');
        var myIndex = objectStore.index('remedio');

        myIndex.openCursor().onsuccess = (event) => {
        	var cursor = event.target.result;
        	if(cursor) {
                var ids = cursor.value.id;
                var rem = cursor.value.remedio;
                var dil = cursor.value.dilucion;
                var num = cursor.value.numero;
                var keyP = cursor.primaryKey
                par = ids + dil + num;                
                var listItem = document.createElement('li');
                listItem.innerHTML = '<a href="preparar.html?id=' + ids + '&num=' + num + '&dil=' + dil + '">'
                                   + rem + ", " + num + "-" + dil + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                   + '</a>'
                                   + '<a href="javascript:;" onclick="eliminarFav(' 
                                   + keyP
                                   + ');" role="button"><img src="img/iconos/basura-32.png" alt="basura" type="img/png" style="float: right;">'
                                   + '</a>';
                list.appendChild(listItem);
                cursor.continue();
            } else {
                console.log('Todos los remedios mostrados.');
            }
        };
    };

    // Manejador del buscador
    var filtrar = () => {
    	var transaction = db.transaction(['favoritos'], 'readonly');
    	var objectStore = transaction.objectStore('favoritos');
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
            if(cursor) 
        	   cursor.continue();
        	}
        };  
    };
    lectorChar.addEventListener('keyup', filtrar);
};

// botón eliminar favoritos
function eliminarFav(keyP) {
    keyP2 = keyP;
    busca.style.display = "none";
    preg.style.display = "flex";   
};

function eliminar() {
    const request = db.transaction(['favoritos'], 'readwrite').objectStore('favoritos').delete(keyP2);
    request.onsuccess = (event) => {
    }
    window.location.reload();
}; 

function restablecer() {
    busca.style.display = "inline-flex";
    preg.style.display = "none"
};