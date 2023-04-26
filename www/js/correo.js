const sendMail = document.getElementById('mail');

function enviarCorreo() {
	const asunto = document.getElementById('fasunto').value;
	console.log(asunto);
	const body = document.getElementById('ftexto').value;
	document.getElementById('fasunto').value="";
	document.getElementById('ftexto').value="";
	sendMail.setAttribute(
		'href',
		'mailTo:omeos2023@gmail.com?subject=' + asunto + '&body=' + body
	);
	asunto.value="";
	body.value="";
}