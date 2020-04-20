var express = require('express');
var mdAutenticacion = require('../middleware/autenticacion');


var hospitalesRoute = express(); // inicializa variables .... 


// importando esquemas de hospitales  

var Hospital = require ('../model/hospitales');

// obtener todos los Hospitales 
hospitalesRoute.get('/', (request,response, next) =>{

    
    //paginacion 
    // los objetos que esten en el query hacen relacion a objetos en la ruta ... 
    var paginacion = request.query.desde || 0;
    paginacion = Number(paginacion);

    // popullate => sirve para traer toda la informacion de determinado campo ..... si tiene una relacion directa con otro campo .... 
    Hospital.find({})
            .skip(paginacion)
            .limit(5)
            .populate('usuario', 'nombre email')
            .exec( (err, hospital) => {
                if (err) {
                    return response.status(500).json ({
                        ok: false,
                        messaje: 'Error base de datos',
                        errors: err
                    });
                }
                

                Hospital.countDocuments({}, (err, count) => {
                   
                    response.status(200).json({
                        totalHospitales: count,
                        ok: true,
                        Hospitales: hospital
                    });  
                });             
            });
})


//  Obtener Hospital por ID 

hospitalesRoute.get('/:id', (req, res) => { 
 
    var id = req.params.id; 

    Hospital.findById(id)    
    .populate('usuario', 'nombre img email')         
    .exec((err, hospital) => { 
 
            if (err) {                 
                return res.status(500).json({                     
                    ok: false,                     
                    mensaje: 'Error al buscar hospital',                     
                    errors: err                 
                });             
            } 
            if (!hospital) {                 
                return res.status(400).json({                     
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',                     
                    errors: { message: 'No existe un hospital con ese ID' }                 
                });             
            } 
                    res.status(200).json({                 
                        ok: true,                 
                        hospital: hospital            
                     }); 
         
                }) 
        })


// crear hospital 

// llamamos a la funcion mdAutenticacion.verificarToken para hacer la validacion del token esto se debe llamar por cada funcion 
// que necesite una validacion de token ... 

hospitalesRoute.post( '/', mdAutenticacion.verificarToken, (req, res) => {
   
    console.log(req.path);
    console.log(req.usuario._id);
    console.log(req.body);

    var body = req.body;
   
    var hospital = new Hospital ({
        nombre: body.nombre,
        usuario: req.usuario._id
        });

        hospital.save((err, hospitalResponse) => {
       
        if (err) {
            return res.status(400).json ({
                ok: false,
                messaje: 'Error crear hospital',
                errors: err
            });
        }

        console.log(hospitalResponse)

        res.status(201).json({
            ok: true,
            body: hospitalResponse
        });

    });

    
    
});


// Actualizar usuario 

hospitalesRoute.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    console.log(req);
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id , (err, hospital) => {

        if (err) {
            return res.status(500).json ({
                ok: false,
                messaje: 'Error buscar hospital',
                errors: err
            });
        }

        if (!hospital){
            return res.status(400).json ({
                ok: false,
                messaje: 'el hospital con id '+id+' no EXISTE!!!',
                errors: {messaje: 'No EXISTE     el hospital'}
            });
        }

        hospital.nombre = body.nombre === undefined || body.nombre === null ? usuario.nombre : body.nombre;
        hospital.usuario =  req.usuario._id;

        hospital.save ((err, hospitalUpdate) => {

            if (err){
                return res.status(400).json ({
                    ok: false,
                    messaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                usuario: hospitalUpdate
            });

        });
    });   
});



// Borrar usuario 

hospitalesRoute.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove (id , (err, hospitalDelete) => {
        
        if (!hospitalDelete){
            return res.status(500).json({
                ok: true,
                messaje: 'No existe ningun hospital con ese id',
                error: { messaje: 'No existe un hospital con ese Id '}
            })
        }

        if (err){
            return res.status(500).json({
                ok: true,
                messaje: 'Error al borrar hospital de DB',
                error: err
            })
        }

        res.status(200).json({
            ok: true,
            messaje: hospitalDelete
        });

    });

});

// forma de exportar cualquier clase o componente que se requiera 

module.exports = hospitalesRoute;