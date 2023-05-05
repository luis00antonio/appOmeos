function enviarCorreo() {
	var asunto = document.getElementById('fasunto').value;
	var texto = document.getElementById('ftexto').value;
	window.plugins.socialsharing.shareViaEmail(
  		texto, // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
  		asunto,
  		['omeos2023@gmail.com'], // TO: must be null or an array
  		null, //['cc@person1.com'], //CC: must be null or an array
  		null, // BCC: must be null or an array
  		null, //['https://www.google.nl/images/srpr/logo4w.png','www/localimage.png'], // FILES: can be null, a string, or an array
  		onSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
  		onError // called when sh*t hits the fan
	);
    var onSuccess = function(result) {
       	console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
       	console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

   	var onError = function(msg) {
       	console.log("Sharing failed with message: " + msg);
    };
}	