const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// enumeracion para alojar solo los roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// eliminamos la contraseña para que no sea regresada.
// se utiliza function para poder acceder al "this"
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

// hay que decirle al esquema que utilice un plugin en particular para este schema
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} Debe ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);