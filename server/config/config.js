// =====================
// PUERTO 
// =====================

process.env.PORT = process.env.PORT || 3000;

// =====================
// ENTORNO 
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// BASE DE DATOS 
// =====================

let urlDB;

if (process.env.NODE_ENV === 'deb') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://userAtlas:Pass_123456@cluster0-dy9mc.mongodb.net/cafe';
}

process.env.URLDB = urlDB;