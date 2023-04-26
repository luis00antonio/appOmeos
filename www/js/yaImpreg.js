var db, id, num, dil, capt;

window.onload = () => {
	 // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

    var h3Impreg = document.getElementById("impreg");
    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);

    // reproducimos un sonido
    accionPlay();
    function accionPlay(){  
        document.getElementById('intro').play();    
    }    

	// leemos la url
	console.log("estoy en impregnar.js");
	const valores = window.location.search;
	console.log(valores);
	const urlParams = new URLSearchParams(valores);
	id = urlParams.get('id');
	console.log(id);
	num = urlParams.get('num');
	dil = urlParams.get('dil');
    capt = urlParams.get('capt');
	console.log(num);
	console.log(dil);

	DBOpenRequest.onsuccess = (event) => {
    	db = DBOpenRequest.result;  
        console.log('db vale: ');
        console.log(db.name);
        getData();
    };

    function getData() {
    	ids = parseInt(id);
    	h3Impreg.innerHTML = '';
    	console.log(ids);
    	// abrimos una transacción de solo lectura
    	var transaction = db.transaction(["ourStore"], "readonly");
    	transaction.oncomplete = (event) => {
    		console.log('Transacción completada');
    		console.log(transaction);
    	};
    	transaction.onerror = (event) => {
    		console.log('Transacción no abierta debido al error: ');
    		console.log(transaction.error);
    	};
    	// abrimos el almacén de datos y el índice
    	var objectStore = transaction.objectStore('ourStore');
    	console.log(objectStore);
    	var storeRequest = objectStore.get(ids);
        console.log('storeRequest vale: ');
        console.log(storeRequest);
        storeRequest.onsuccess = (event) => {
            const myRecord = storeRequest.result;
            console.log(myRecord);
            rem = myRecord.remedio;
            console.log('El remedio buscado es: ');
            console.log(rem);
            h3Impreg.innerHTML = rem + "</br>" + num + dil;
        };    	
    };
    if (capt == 'Si') {
        setTimeout(function(){window.location="yaCapt.html?id=" + id + "&num=" + num + "&dil=" + dil + "&capt=" + capt;}, 3000);
    }
}