const express = require('express'); // Se importa la libreria de express
const { v4: uuidv4 } = require('uuid'); // Se importa la libreria para generar IDs unicos
const path = require('path'); // Se importa la libreria para manejar rutas de archivos

const app = express();
const PORT = process.env.PORT || 3000; // Se define el puerto del servidor

app.use(express.json()); // Middleware para parsear el JSON en las peticiones
app.use(express.static(path.join(__dirname, 'public'))); // Middleware para servir archivos estáticos desde la carpeta 'public'

// Array para almacenar las notas en memoria
let notes = [];

// Endpoint para obtener todas las notas
app.get('/notas', (req, res) => {
    res.json(notes); // Se envian las notas en formato JSON
});

// Endpoint para obtener una nota por su ID
app.get('/notas/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note); // Si se encuentra la nota, se responde con la nota
    } else {
        res.status(404).json({ error: 'Notas no encontradas' }); // Si no se encuentra, se responde con un error 404
    }
});

// Endpoint para crear una nueva nota
app.post('/notas', (req, res) => {
    const { title, content, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'El titulo y el contenido son obligatorios' }); // Validacion de campos obligatorios
    }
    const newNote = {
        id: uuidv4(), // Se genera un ID unico
        title,
        content,
        tags: tags || [], // Se asigna un array vacio si no se proporcionan etiquetas
        createdAt: new Date(), // Se asigna la fecha de creacion
        updatedAt: new Date()  // Se asigna la fecha de ultima modificacion
    };
    notes.push(newNote); // Se agrega la nueva nota al array
    console.log('Nota creada:', newNote); // Log para depuracion
    res.status(201).json(newNote); // Se responde con la nueva nota creada
});

// Endpoint para actualizar una nota existente
app.put('/notas/:id', (req, res) => {
    const { title, content, tags } = req.body;
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        if (!title || !content) {
            return res.status(400).json({ error: 'El titulo y el contenido son obligatorios' }); // Validacion de campos obligatorios
        }
        note.title = title; // Se actualiza el titulo
        note.content = content; // Se actualiza el contenido
        note.tags = tags || note.tags; // Se actualizan las etiquetas si se proporcionan
        note.updatedAt = new Date(); // Se actualiza la fecha de ultima modificacion
        console.log('Nota actualizada:', note); // Log para depuracion
        res.json(note); // Se responde con la nota actualizada
    } else {
        res.status(404).json({ error: 'Nota no encontrada' }); // Si no se encuentra, se responde con un error 404
    }
});

// Endpoint para eliminar una nota por su ID
app.delete('/notas/:id', (req, res) => {
    notes = notes.filter(n => n.id !== req.params.id); // Se filtra el array para eliminar la nota
    console.log(`Nota con ID ${req.params.id} eliminada`); // Log para depuracion
    res.status(204).send(); // Se responde con un estado 204 (sin contenido)
});

// Obtener el archivo index.html en la ruta raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener el archivo edit.html en la ruta /edit/:id
app.get('/edit/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is active on PORT: ${PORT}`);
});
