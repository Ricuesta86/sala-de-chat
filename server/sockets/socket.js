const { io } = require('../server');
const { Usuario } = require('../classes/Usuarios');
const { crearMensaje } = require('../util/utilidades');


let usuario = new Usuario();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        client.join(data.sala);

        usuario.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuario.getPersonasPorSala(data.sala));

        callback(usuario.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuario.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonado el chat` });

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuario.getPersonasPorSala());

    });

});