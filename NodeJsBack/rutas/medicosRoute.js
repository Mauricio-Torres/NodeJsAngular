var express = require('express');
var mdAutenticacion = require('../middleware/autenticacion');


var medicoRoute = express(); // inicializa variables .... 


// importando esquemas de medicoes  

var Medico = require ('../model/medico');

// obtener todos los medicoes 
medicoRoute.get('/', (request,response, next) =>{

     //paginacion 
    // los objetos que esten en el query hacen relacion a objetos en la ruta ... 
    var paginacion = request.query.desde || 0;
    paginacion = Number(paginacion);

    // populate => si no se envian los parametros trae toda la informacion de la tabla a la que se lo relacion 
    Medico.find({}).skip(paginacion)
                   .limit(5)
                   .populate('usuario', 'nombre email')
                   .populate('hospital')
                   .exec( (err, medico) => {
                        if (err) {
                            return response.status(500).json ({
                                ok: false,
                                messaje: 'Error base de datos',
                                errors: err
                            });
                        }
                        
                        Medico.count( {}, (err, count)=>{

                            response.status(200).json({
                                ok: true,
                                medicos: medico,
                                totalMedico: count
                            });  
                        });    
                    });
})

// obtener medico por id 

medicoRoute.get('/:id', (request,response, next) =>{

    var id = request.params.id; 

    Medico.findById(id)    
    .populate('usuario', 'nombre img email')
    .populate('hospital')         
    .exec((err, medico) => { 
 
            if (err) {                 
                return response.status(500).json({                     
                    ok: false,                     
                    mensaje: 'Error al buscar medico',                     
                    errors: err                 
                });             
            } 

            if (!medico) {                 
                return response.status(400).json({                     
                    ok: false,
                    mensaje: 'El medico con el id ' + id + ' no existe',                     
                    errors: { message: 'No existe un medico con ese ID' }                 
                });             
            } 
            response.status(200).json({                 
                ok: true,                 
                medico: medico            
                }); 
        }) 
  })


// crear medico 

// llamamos a la funcion mdAutenticacion.verificarToken para hacer la validacion del token esto se debe llamar por cada funcion 
// que necesite una validacion de token ... 

medicoRoute.post( '/', mdAutenticacion.verificarToken, (req, res) => {
   
    var body = req.body;
   
    var medico = new Medico ({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
        });

        medico.save((err, medicoResponse) => {
       
        if (err) {
            return res.status(400).json ({
                ok: false,
                messaje: 'Error crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            body: medicoResponse
        });

    });

    
    
});


// Actualizar usuario 

medicoRoute.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    console.log(req);
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id , (err, medico) => {

        if (err) {
            return res.status(500).json ({
                ok: false,
                messaje: 'Error buscar medico',
                errors: err
            });
        }

        if (!medico){
            return res.status(400).json ({
                ok: false,
                messaje: 'el medico con id '+id+' no EXISTE!!!',
                errors: {messaje: 'No EXISTE     el medico'}
            });
        }

        medico.nombre = body.nombre === undefined || body.nombre === null ? usuario.nombre : body.nombre;
        medico.usuario =  req.usuario._id;
        medico.hospital =  body.hospital;

        medico.save ((err, medicoUpdate) => {

            if (err){
                return res.status(400).json ({
                    ok: false,
                    messaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                medico: medicoUpdate
            });

        });
    });   
});



// Borrar usuario 

medicoRoute.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove (id , (err, medicoDelete) => {
        
        if (!medicoDelete){
            return res.status(500).json({
                ok: true,
                messaje: 'No existe ningun medico con ese id',
                error: { messaje: 'No existe un medico con ese Id '}
            })
        }

        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error al borrar medico de DB',
                error: err
            })
        }

        res.status(200).json({
            ok: true,
            messaje: medicoDelete
        });

    });

});

// forma de exportar cualquier clase o componente que se requiera 

module.exports = medicoRoute;