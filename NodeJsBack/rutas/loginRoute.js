var express = require('express');
var bcrypt = require('bcryptjs'); // encriptar datos usuario 
var jwt = require ('jsonwebtoken'); // genera tokens para login
var SEMILLA = require('../config/constantes').SEMILLA; 

// google
var ClientId = require('../config/constantes').ClientId;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client (ClientId);

// inicializar el express 
var loginRoute = express();

// importando esquemas de usuarios 
var Usuario = require ('../model/usuario');
var mdAutenticacion = require('../middleware/autenticacion')

// renovasr token 
loginRoute.get('/renuevatoken', mdAutenticacion.verificarToken, (req, res) =>{
    var token = jwt.sign({usuario: req.usuario}, SEMILLA, {expiresIn: 14400})
    
    res.status(200).json({
        ok: true,
        token: token
    });
});


// inicio de GOOGLE 
async function verify (token){

    const ticket = await client.verifyIdToken({

        idToken :token,
        audience: ClientId
    });

    const payload = ticket.getPayload();
    // const userId = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


loginRoute.post ('/google', async (req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token).catch( e => {
       
        return res.status(403).json({
            ok:false,
            messaje: 'Ingreso no valido '
        });
    });

    Usuario.findOne({email: googleUser.email}, (err, user) => {
        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error DB login Usuario',
                error: err
            });
        }

        if (user){
           
            if (user.google === false){
                return res.status(400).json({
                    ok: false,
                    messaje: 'El usuario debe usar su autenticacion normal',
                });
            } else {

                
                // crear token 
                // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
                // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
                var token = jwt.sign({usuario: user}, SEMILLA, {expiresIn: 14400})
                console.log( obtenerMenu(user.role))
                return res.status(201).json({
                    ok:true,
                    usuario: user,
                    id: user._id,
                    token: token,
                    menu: obtenerMenu(user.role)
                });
            }  
            
        } else {
            
            // si el usuario no existe se crea en la DB
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDb)=> {

                // crear token 
                // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
                // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
                var token = jwt.sign({usuario: usuarioDb}, SEMILLA, {expiresIn: 14400})
                console.log( obtenerMenu(usuarioDb.role))
                res.status(201).json({
                    ok:true,
                    usuario: usuarioDb,
                    id: usuarioDb._id,
                    token: token,
                    menu: obtenerMenu(usuarioDb.role)
                });

            });           
        }
    });

});





// validadndo servicio login 
// crea token para continuar con las demas funciones de la aplicacion ... 

loginRoute.post ('', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioLoguead) => {
       
        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error DB login Usuario',
                error: err
            });
        }

        if (!usuarioLoguead){
            return res.status(400).json({
                ok: true,
                messaje: 'Error Credenciales Incorrectas - email',
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioLoguead.password)){
            return res.status(400).json({
                ok: true,
                messaje: 'Error Credenciales Incorrectas - password',
            });
        }

        // para no enviar el pass al front no debe conocerlo .... 
        usuarioLoguead.password = ':)'

        // crear token 
        // se genera a traves de sing se envia el usuario, una llave cualquiera string [firma con la que se valida el token],
        // y el tiempo donde debe expirar o terminar 144400 representa a 4 horas
        var token = jwt.sign({usuario: usuarioLoguead}, SEMILLA, {expiresIn: 14400})

        res.status(201).json({
            ok:true,
            usuario: usuarioLoguead,
            id: usuarioLoguead._id,
            token: token,
            menu: obtenerMenu(usuarioLoguead.role)
        });

    });

});

function obtenerMenu (role) {

    var menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            {titulo: 'Dashboard', path: '/dashboard' },
            {titulo: 'ProgresBar', path: '/progress' },
            {titulo: 'Graficas', path: '/graficas1' },
            {titulo: 'Promesas', path: '/promesas' },
            {titulo: 'RxJs', path: '/rxjs' },
          ]
        },
        {
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            //{titulo: 'Usuarios', path: '/usuarios' },
            {titulo: 'Hospitales', path: '/hospitales' },
            {titulo: 'Medicos', path: '/medicos' }
          ]
        }
      ];

      if (role === 'ADMIN_ROLE') {
          // unishift agrega al inicio el nuevo dato
        menu[1].submenu.unshift({titulo: 'Usuarios', path: '/usuarios' });
      }

      return menu;

    }

// forma de exportar cualquier clase o componente que se requiera 

module.exports = loginRoute;