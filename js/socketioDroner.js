// Archivo que se encarga de la comunicacion con el servidor de señalozacion y llama a las funciones necesarias de webRTC
//del droner
var arDrone;
var intervalo;

// conexion de Socket.io al servidor de señalizacion
var socket = io.connect("10.10.0.150");

socket.emit('create'); // Creamos conexion con el servidor

 
// Recibimos respuesta del servidor de sala creada y llamamos a getUserMedia
socket.on('created', function (){
	callGetUserMedia();
	startArDrone();
	//console.log('Droner ready.');
});


socket.on('join remote', function (){
	//console.log('Un "remote" se ha unido.');
	if (arDrone.isArDroneConnected) {
		createPeerConnection(true);
		intervalo = setInterval(arDrone.updateAndSend, 15); // intervalo de envio de los valores
		//requestAnimationFrame( arDrone.updateAndSend); // intervalo de envio de los valores
	} else {
		console.log("ArDrone is not connected, not creating RTCPeerConnection. Relaunch the app.");
	}
});


function sendMessage(message){
	//console.log('Enviando mensaje: ', message);
	socket.emit('message', message);
}

// Mensajes de log que envia el Servidor
socket.on('log', function (array){
	console.log.apply(console, array);
});


function startArDrone() {
	arDrone = new arDrone("10.10.0.150", 17000, 15000, 11000, 19000); //Conexion con el Drone
	arDrone.start();
}