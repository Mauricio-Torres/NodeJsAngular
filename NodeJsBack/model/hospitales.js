var mongoose = require('mongoose');
var uniqueValidate = require('mongoose-unique-validator');

var Schema = mongoose.Schema

var hospitalesSchema = new Schema (
    {
        nombre: {type: String, unique: true, required: [true, 'El nombre es requrido'] },
        img: {type: String, required: false },
        usuario: {type: Schema.Types.ObjectId, ref:'Usuario' }
    },
    
    { collection: 'hospitales' });

// validaciones para campo unico 
hospitalesSchema.plugin(uniqueValidate, {message:'El {PATH} debe se ùnico'})

// Usar el usuario fuera de esta clase ... 
module.exports = mongoose.model('Hospital',hospitalesSchema)