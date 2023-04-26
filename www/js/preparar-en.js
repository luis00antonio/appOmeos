function prep () {
	// leemos la url
	const valores = window.location.search;
	const urlParams = new URLSearchParams(valores);
	var id = urlParams.get('id');

	var enlace = document.getElementById("botPrep");
	enlace.href = 'preparar.html?id=' + id + '&dil=' + eligeDil;
}

function start() {
	// leemos la URL
	const valores = window.location.search;
	const urlParams = new URLSearchParams(valores);
	var id = urlParams.get('id');
	var num = urlParams.get('num');
	var dil = urlParams.get('dil');

	// ahora metemos los parametros en la url
	var enlace = document.getElementById("botStart");
	enlace.href = 'impregnando-en.html?id=' + id + '&num=' + num + '&dil=' + dil;
}