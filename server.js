const express = require('express'); // Libreria de express
const { v4: uuidv4 } = require('uuid'); // Libreria para generar IDs únicos
const path = require('path'); // Libreria para manejar rutas de archivos

const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor

app.use(express.json()); // Middleware para parsear el JSON en las peticiones
app.use(express.static('public')); // Middleware para ver archivos estaticos desde la carpeta 'public'

// Array para almacenar las notas en memoria
let notes = [];

// Endpoint para obtener todas las notas
app.get('/notas', (req, res) => {
    res.json(notes); // Se envian las notas en formato JSON
});

// Endpoint para obtener una nota por su ID, el ID es invisible para el usuario, pero el sistema si lo almacena
app.get('/notas/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note); // Si se encuentra la nota, se responde con la nota 
    } else {
        res.status(404).send('Nota no encontrada'); // Si no se encuentra, se responde con un error 404
    }
});

// Endpoint para crear una nueva nota
app.post('/notas', (req, res) => {
    const { title, content, tags } = req.body;
    // Se valida que el titulo y el contenido no esten vacios
    if (!title || !content) {
        return res.status(400).send('El titulo y el contenido son obligatorios');
    }
    // Se crea una nueva nota con los datos proporcionados
    const newNote = {
        id: uuidv4(), // Un ID unico por medio de la libreria
        title,
        content,
        tags: tags || [], // Si no se proporcionan etiquetas, se asigna un array vacio, porque no son obligatorias
        createdAt: new Date(), // Fecha de creacion 
        updatedAt: new Date()  // Fecha de ultima modificacion 
    };
    notes.push(newNote); // Se agrega la nueva nota al array
    res.status(201).json(newNote); // Se responde con la nueva nota creada
});

// Endpoint para actualizar una nota existente
app.put('/notas/:id', (req, res) => {
    const { title, content, tags } = req.body;
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        // Se actializan los campos de la nota
        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        note.updatedAt = new Date(); // Actualizamos la fecha de ultima modificacion
        res.json(note); // Se responde con la nota actualizada
    } else {
        res.status(404).send('Nota no encontrada'); // Si no se encuentra, respondemos con un error 404
    }
});

// Endpoint para eliminar una nota por su ID
app.delete('/notas/:id', (req, res) => {
    notes = notes.filter(n => n.id !== req.params.id); // Se filtra el array para eliminar la nota
    res.status(204).send(); // Respondemos con un estado 204 (sin contenido)
});

// Obtener el archivo index.html en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener el archivo edit.html en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Server is active on PORT: `+PORT);
});

