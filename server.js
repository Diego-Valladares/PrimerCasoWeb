const express = require('express'); // Liberia de express
const bodyParser = require('body-parser'); // Libreria para parsear los 
const { v4: uuidv4 } = require('uuid'); // Libreria para generar IDs unicos
const path = require('path'); // Libreria para manejar rutas de archivos

const app = express();
const PORT = process.env.PORT || 3000; //  Perto de la aplicacion

app.use(bodyParser.json()); // Para parsear o salvar las notas en formato .json
app.use(express.static('public')); // Para leer archivos estaticos desde la carpeta 'public'

// Req el archivo index.html en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir el archivo edit.html en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Server is active on PORT: `+PORT);
});

