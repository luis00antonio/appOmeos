var db;
var list = document.querySelector('ul');
var lectorChar = document.querySelector('#lectorChar');

window.onload = () => {
    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);
    DBOpenRequest.onerror = (event) => {
    	console.log('No se ha podido abrir la base de datos.');
    };
    DBOpenRequest.onsuccess = (event) => {
    	db = event.target.result;
    	console.log('Base de datos');
    	console.log(db.name);
    	console.log('abierta');
    	displayData();
    };

    function displayData() {
        var transaction = db.transaction(['favoritos'], 'readonly');
        transaction.onerror = () => {
        	console.log('error en la transacción');
        };
        console.log(transaction);
        var objectStore = transaction.objectStore('favoritos');
        var myIndex = objectStore.index('remedio');
        console.log(myIndex.name);
        console.log(myIndex.objectStore);

        myIndex.openCursor().onsuccess = (event) => {
        	console.log(list);
        	var cursor = event.target.result;
        	if(cursor) {
                var ids = cursor.value.id;
                var rem = cursor.value.remedio;
                var dil = cursor.value.dilucion;
                var num = cursor.value.numero;
                console.log(rem);
                var listItem = document.createElement('li');
                listItem.innerHTML = '<a href="preparar-en.html?id=' + ids + '&num=' + num + '&dil=' + dil + '">'
                                   + rem + ", " + num + "-" + dil
                                   + '<img src="img/iconos/flecha.png" style="float: right; margin-top: 6px;">'
                                   + '</a>';
                list.appendChild(listItem);
                console.log('elemento imprimido');
                console.log(listItem);
                cursor.continue();
            } else {
                console.log('Todos los remedios mostrados.');
            }
        };
    };

    // Manejador del buscador
    var filtrar = () => {
    	console.log('entro en filtrar');
    	var transaction = db.transaction(['favoritos'], 'readonly');
    	var objectStore = transaction.objectStore('favoritos');
        var myIndex = objectStore.index('remedio');
        console.log(myIndex);
        var texto = lectorChar.value.toLowerCase();
        console.log(texto);

        myIndex.openCursor().onsuccess = (event) => {
        	var cursor = event.target.result;
        	if(cursor) {
        		var rem = cursor.value.remedio;
        		var remMin = rem.toLowerCase();
        		console.log(remMin);
        		var id = cursor.value.id;
        		console.log(id);
        		if(remMin.startsWith(texto) === true) {
        			location.hash = "#" + id;
        			console.log('encontrado!!');
        			console.log(rem);
        			document.getElementById('lectorChar').focus();
        			cursor = false;
        		}
        	cursor.continue();
        	}
        };  
    };
    lectorChar.addEventListener('keyup', filtrar);
};