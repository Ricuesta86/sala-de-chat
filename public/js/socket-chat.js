var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios.');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('entrarChat', usuario, function(resp) {
    console.log(resp);
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

socket.on('crearMensaje', function(mensaje) {
    console.log(mensaje);
});


socket.on('listaPersonas', function(mensaje) {
    console.log(mensaje);
});

socket.on('mensajePrivado', function(mensaje) {
    console.log(mensaje);
});