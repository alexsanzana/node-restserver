const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ===========================
// Obtener productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        });
});

// ===========================
// Obtener producto por ID
// ===========================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                })
            }

            res.json({
                ok: true,
                productos: productoBD
            })
        });

});


// ===========================
// Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        });

});


// ===========================
// Crear un nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, prodcutoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: prodcutoDB
        })

    });

});

// ===========================
// Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, prodcutoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!prodcutoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        prodcutoDB.nombre = body.nombre;
        prodcutoDB.precioUni = body.precioUni;
        prodcutoDB.descripcion = body.descripcion;
        prodcutoDB.disponible = body.disponible;
        prodcutoDB.categoria = body.categoria;

        prodcutoDB.save((err, prodcutoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: prodcutoGuardado
            })
        });

    });



});

// ===========================
// borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });

        });

    });

});


module.exports = app;