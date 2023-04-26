var eligeDil = 'X';
var eligeNum = 4;
var eligeToma = '1';
var id;
var rem;
var toma;

window.onload = () => {
    var seccion1 = document.getElementById("seccion1");
    var seccion2 = document.getElementById("seccion2");
    screenPosition1 = seccion1.getBoundingClientRect();
    screenPosition2 = seccion2.getBoundingClientRect();
    var bottomInicial1 = Math.abs(screenPosition1.bottom);
    var upInicial1 = Math.abs(screenPosition1.top);
    var bottomInicial2 = Math.abs(screenPosition2.bottom);
    var upInicial2 = Math.abs(screenPosition2.top);
    var divisor1 = (bottomInicial1-upInicial1)/90;
    var divisor2 = (bottomInicial2-upInicial2)/8;
    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*) 

    var list = document.querySelector('h1');

    var DBOpenRequest = window.indexedDB.open('remediosDB', 1);

    DBOpenRequest.onsuccess = (event) => {
        db = DBOpenRequest.result; 
        var paramstr = window.location.search.substr(1); 
        var paramarr = paramstr.split ("&");
        var params = {};

        for ( var i = 0; i < paramarr.length; i++) {
            var tmparr = paramarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        if (params['id']) {
            var id = params['id'];
            insertarH1(id);
        } else {
            console.log('No se envió el parámetro variable');
        }    
    };

    function insertarH1(id) {
        ids = parseInt(id);
        list.innerHTML = '';
        var transaction = db.transaction(['ourStore'], 'readonly');
        transaction.oncomplete = (event) => {
            console.log('Transacción completada');
        };
        transaction.onerror = (event) => {
            console.log('Transacción errónea debida al error: ' + transaction.error );
        };
        var objectStore = transaction.objectStore('ourStore');
        var storeRequest = objectStore.get(ids);
        storeRequest.onsuccess = (event) => {
            const myRecord = storeRequest.result;
            list.innerHTML = myRecord.remedio;
        };
    };

    document.getElementById("eligeDil").onscroll = () => {
        screenPos2 = seccion2.getBoundingClientRect();
        var bott2 = Math.abs(screenPos2.bottom);
        var result2 = (bottomInicial2-bott2)/divisor2;
        var round2 = Math.round(result2);
        var current_element2 = seccion2.children[round2];
        current_element_id2 = seccion2.children[round2].id;
        if (current_element_id2 != eligeDil) {
            eligeDil = current_element_id2;
        }
        //console.log(eligeDil);
        //console.log(rem);
    };
    document.getElementById("eligeNum").onscroll = () => {
        screenPos1 = seccion1.getBoundingClientRect();
        var bott1 = Math.abs(screenPos1.bottom);
        var result1 = (bottomInicial1-bott1)/divisor1;
        var round1 = Math.round(result1);
        var current_element1 = seccion1.children[round1];
        current_element_id1 = seccion1.children[round1].id;
        if (current_element_id1 != eligeNum) {
            eligeNum = current_element_id1;
        }
        //console.log(eligeNum);
        //console.log(rem);
    };     
};

function prep () {
    // leemos la url
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var id = urlParams.get('id');

    // ahora metemos el id en la url
    var enlace = document.getElementById("botPrep");
    enlace.href = 'preparar-en.html?id=' + id + '&num=' + eligeNum + '&dil=' + eligeDil;
};

function prepCapt() {
    // leemos la url
    const valoresCapt = window.location.search;
    const urlParamsCapt = new URLSearchParams(valoresCapt);
    var id = urlParamsCapt.get('id');
    var capt = 'Si';

    // ahora metemos el id  y la variable capt en la url
    var enlaceCapt = document.getElementById("botPrepCapt");
    enlaceCapt.href = 'impregnando-en.html?id=' + id + '&num=' + eligeNum + '&dil=' + eligeDil + '&capt=' + capt;
};

function addFav() {
    // abrimos la base de datos
    var DBOpenRequest = window.indexedDB.open("remediosDB", 1);
    DBOpenRequest.onsuccess = (event) => {
        var db = DBOpenRequest.result;
        getData();  
    };
    function getData() {
        var valores = window.location.search;
        var urlParams = new URLSearchParams(valores);
        id = urlParams.get('id');
        ids = parseInt(id);
        // abrimos una transacción de solo lectura
        var transaction = db.transaction(["ourStore"], "readonly");
        transaction.oncomplete = (event) => {
            console.log('Transacción completada');
            addData();
        };
        transaction.onerror = (event) => {
            console.log('Transacción no abierta debido al error: ');
        };
        // abrimos el almacén de datos y el índice
        var objectStore = transaction.objectStore('ourStore');
        var storeRequest = objectStore.get(ids);
        storeRequest.onsuccess = (event) => {
            const myRecord = storeRequest.result;
            rem = myRecord.remedio;
        }; 
    };
    
    function addData() {
        var visto = document.getElementById("visto");
        var vis2 = document.getElementById("vis2");
        // Creamos el nuevo objeto listo para insertar
        // pero primero los leemos de la url y del select
        //... y ahora leemos el select

        // ahora definimos el objeto que vamos a meter en el almacén 'favoritos'
        const newItem = [{
            "clave" : ids + eligeDil + eligeNum,
            "id" : ids,
            "remedio" : rem,
            "numero" : eligeNum,
            "dilucion": eligeDil
        }];

        var transaction = db.transaction('favoritos', "readwrite");
        transaction.oncomplete = (event) => {
            visto.style.display = "block";
            setTimeout(function(){
                visto.style.display = "none";
            }, 5000);
        };  
        transaction.onerror = (event) => {
            visto.style.display = "block";
            vis2.innerHTML = '<img class="iconos" src="img/iconos/cerrar.png" alt="X" type="img/png">Duplicate remedy';
            setTimeout(function(){
                visto.style.display = "none";
                vis2.innerHTML = '<img class="iconos" src="img/iconos/visto.png" alt="V" type="img/png">Saved in Favourites';
            }, 5000);
        };
        var objectStore = transaction.objectStore('favoritos');
        var objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = (event) => {
            console.log('transacción exitosa');
        };
    };
};

function cambiarBotones() {
        // abrimos una transacción de solo lectura
        var transaction = db.transaction(["ourStore"], "readonly");
        transaction.oncomplete = (event) => {
            console.log('Transacción completada');
            addData();
        };
        transaction.onerror = (event) => {
            console.log('Transacción no abierta debido al error: ');
        };
        // abrimos el almacén de datos y el índice
        var objectStore = transaction.objectStore('ourStore');
        var storeRequest = objectStore.get(ids);
        storeRequest.onsuccess = (event) => {
            const myRecord = storeRequest.result;
            rem = myRecord.remedio;
        }; 
    var botonera = document.getElementById("botonera");
    var alarma = document.getElementById("alarma");
    botonera.style.display = "none";
    alarma.style.display = "block";

    var seccion3 = document.getElementById("seccion3");
    screenPosition3 = seccion3.getBoundingClientRect();
    var bottomInicial3 = Math.abs(screenPosition3.bottom);
    var upInicial3 = Math.abs(screenPosition3.top);
    var divisor3 = (bottomInicial3-upInicial3)/19;

    document.getElementById("eligeToma").onscroll = () => {
        screenPos3 = seccion3.getBoundingClientRect();
        var bott3 = Math.abs(screenPos3.bottom);
        var result3 = (bottomInicial3-bott3)/divisor3;
        var round3 = Math.round(result3);
        var current_element3 = seccion3.children[round3];
        current_element_id3 = seccion3.children[round3].id;
        if (current_element_id3 != eligeToma) {
            eligeToma = current_element_id3;
        }
    }; 
};

// Programar alarma
var id = 1, dialog;

callback = function () {
    cordova.plugins.notification.local.getIds(function (ids) {
        showToast('IDs: ' + ids.join(' ,'));
    });
};

showToast = function (text) {
    setTimeout(function () {
        if (device.platform != 'windows') {
            window.plugins.toast.showShortBottom(text);
        } else {
            showDialog(text);
        }
    }, 100);
};

showDialog = function (text) {
    if (dialog) {
        dialog.content = text;
        return;
    }
    dialog = new Windows.UI.Popups.MessageDialog(text);
    dialog.showAsync().done(function () {
        dialog = null;
    });
};

progToma = function () {
    var textoSalida = document.getElementById("textoSalida");
    var sound = device.platform == 'Android' ? 'file://audio/intro.mp3' : 'file://beep.caf';
    var now = new Date().getTime(),
    fecha = new Date(now + eligeToma*3600*1000);
    const diaToma = fecha.getDate();
    const mesToma = fecha.getMonth() + 1;
    const anoToma = fecha.getFullYear();
    const horaToma = fecha.getHours();
    const minutoToma = fecha.getMinutes();
    textoSalida.innerHTML = 'Alarm for the taking of: ' + rem + ' ' + eligeNum + ' ' + eligeDil + ' already scheduled, for the day ' +  anoToma + '/' + mesToma + '/' + diaToma + ' at ' + horaToma + ':' + minutoToma + '.';
    var mensaje = 'Taking of: ' + rem + ' ' + eligeNum + ' ' + eligeDil;
    var eligeTomaNum = parseInt(eligeToma);
    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Omeos',
        text: mensaje,
        at: fecha,
        sound: sound,
        icon: 'file://img/logo.png'
    }, callback);
};


document.addEventListener('deviceready', function () {

    cordova.plugins.notification.local.on('schedule', function (notification) {
        console.log('onschedule', arguments);
        //showToast('scheduled: ' + notification.id);
    });

    cordova.plugins.notification.local.on('update', function (notification) {
        console.log('onupdate', arguments);
        // showToast('updated: ' + notification.id);
    });

    cordova.plugins.notification.local.on('trigger', function (notification) {
        console.log('ontrigger', arguments);
        showToast('triggered: ' + notification.id);
    });

    cordova.plugins.notification.local.on('click', function (notification) {
        console.log('onclick', arguments);
        showToast('clicked: ' + notification.id);
    });

    cordova.plugins.notification.local.on('cancel', function (notification) {
        console.log('oncancel', arguments);
        // showToast('canceled: ' + notification.id);
    });

    cordova.plugins.notification.local.on('clear', function (notification) {
        console.log('onclear', arguments);
        showToast('cleared: ' + notification.id);
    });

    cordova.plugins.notification.local.on('cancelall', function () {
        console.log('oncancelall', arguments);
        // showToast('canceled all');
    });

    cordova.plugins.notification.local.on('clearall', function () {
        console.log('onclearall', arguments);
        // showToast('cleared all');
    });   
}, false);

app.initialize();