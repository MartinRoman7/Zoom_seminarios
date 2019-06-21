/**
 * server.js
 * Script principal para la ejecución del sistema.
 * 
 * Autor: Oscar Martín Arcos Román
 */

// Declaración de requerimientos
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

// Declaración de rutas 
var routes = require('./routes/index');

// Inicialización de app
var app = express();

// Motor de las vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Directorios estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Sesión express
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Inicio de passport
app.use(passport.initialize());
app.use(passport.session());

// Validador express
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Conexión con flash
app.use(flash());

// Variables globales
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Direcciones raiz
app.use('/', routes);

// Indicación de puerto
app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), function() {
    console.log('Servidor escuchando en puerto ' + app.get('port'));
});
