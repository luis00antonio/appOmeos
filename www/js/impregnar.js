var db, id, num, dil;

window.onload = () => {
	 // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

    var h3Impreg = document.getElementById("impreg");
    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);

	// leemos la url
	const valores = window.location.search;
	const urlParams = new URLSearchParams(valores);
	id = urlParams.get('id');
	num = urlParams.get('num');
	dil = urlParams.get('dil');

	DBOpenRequest.onsuccess = (event) => {
    	db = DBOpenRequest.result;  
        getData();
    };

    function getData() {
    	ids = parseInt(id);
    	h3Impreg.innerHTML = '';
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
    	var storeRequest = objectStore.get(ids);
        storeRequest.onsuccess = (event) => {
            const myRecord = storeRequest.result;
            rem = myRecord.remedio;
            h3Impreg.innerHTML = rem + "</br>" + num + dil;
        };    	
    };
    setTimeout(function(){window.location="yaImpreg.html?id=" + id + "&num=" + num + "&dil=" + dil;}, 15000);
}