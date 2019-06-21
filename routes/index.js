/**
 * index.js
 * Script donde se declara la dirección raiz (/). 
 * Autor: Oscar Martín Arcos Román
 */

// Declaración de requerimientos
const express = require('express');
const router = express.Router();
var cmd = require('node-cmd');

// Zoom API
var request = require("request");

// CMD - Python
var cmd = require('node-cmd');

// Página principal
router.get('/', (req, res) => {
    
    res.render('index', { title: 'Registro de seminarios' });

});

router.post('/', (req, res) => {
    
    let iden = req.body;
    let titulo = iden.titulo;
    let descripcion = iden.tema;
    let fecha = iden.fecha;
    let hora_inicio = iden.hora_inicio;
    let minuto_inicio = iden.minuto_inicio;
    let duracion = iden.duracion;
    let email = iden.email;
    let hora_minuto = hora_inicio+':'+minuto_inicio;

    req.checkBody('titulo', 'Titulo del seminario es requerido.').notEmpty();
    req.checkBody('descripcion', 'Descripción del seminario es requerido.').notEmpty();
    req.checkBody('fecha', 'Fecha del seminario es requerida.').notEmpty();
    req.checkBody('hora_inicio', 'Hora de inicio del  seminario es requerida.').notEmpty();
    req.checkBody('minuto_inicio', 'Minuto de inicio del seminario es requerido.').notEmpty();
    req.checkBody('duracion', 'Duración del seminario es requerido.').notEmpty();
    req.checkBody('email', 'Email de confirmación es requerido.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('index', { title: 'Registro de seminarios', errors: errors });
    } else {

        /** ZOOM API */
        var options = { method: 'POST',
            url: 'https://api.zoom.us/v2/users/FRESTRELLA@fundacioncarlosslim.org/meetings',
            headers: {
                authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IjUza1VyQllaVHBlMXNTcmt4eTNMMWciLCJleHAiOjI1MjQ2Mjk2MDAsImlhdCI6MTU1NzUwNjk0MH0.43DQlCBp_svL4GU5GndcS7S59yl7jJeofd6P9xvf9uE',
                'content-type': 'application/json' },
            body: { 
                topic: titulo,
                type: '2',
                start_time: fecha+'T'+hora_inicio+':'+minuto_inicio+':00',
                timezone: 'America/Mexico_City',
                duration: duracion,
                agenda: descripcion,
                settings: {
                    host_video: 'true',
                    participant_video: 'true',
                    cn_meeting: 'false',
                    join_before_host: 'false',
                    mute_upon_entry: 'true',
                    approval_type: '2',
                    audio: 'both' } 
            },
        json: true };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body.join_url);
            let url_join = body.join_url;
            let str_titulo = titulo.replace(/ /g, "_");
            let str_descripcion = descripcion.replace(/ /g, "_");
            var pyProcess = cmd.get('python3 /home/martin/Documentos/Zoom_Seminarios/mail/confirmacion.py ' + url_join + ' ' + fecha + ' ' + hora_minuto + ' ' + str_titulo + ' ' + str_descripcion + ' ' + duracion + ' ' + email, function(data, err, stderr) {
                if (!err) {
                    console.log("data from python script " + data)
                } else {
                    console.log("python script cmd error: " + err)
                }
            });

            req.flash('success_msg', 'Seminario registrado. Revise su E-mail paar más información.');
            res.redirect('/');

        });
    }

});

// Exportar modulo
module.exports = router;