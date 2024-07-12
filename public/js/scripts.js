
document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notesGrid'); // Contenedor donde se mostraran las notas
    const createNoteBtn = document.getElementById('createNote'); // Boton para crear una nueva nota
    const noteForm = document.getElementById('noteForm'); // Formulario para crear/editar notas
    const noteId = document.getElementById('noteId'); // Campo oculto para almacenar el ID de la nota actual
    const title = document.getElementById('title'); // Campo para el titulo de la nota
    const content = document.getElementById('content'); // Campo para el contenido de la nota
    const tags = document.getElementById('tags'); // Campo para las etiquetas de la nota
    const saveNoteBtn = document.getElementById('saveNote'); // Boton para guardar la nota
    const cancelBtn = document.getElementById('cancel'); // Botn para cancelar la edicion
    const deleteNoteBtn = document.getElementById('deleteNote'); // Boton para eliminar la nota

    const apiUrl = '/notas'; // URL base de la API para las notas

    // Funcion para obtener y mostrar todas las notas
    const fetchNotes = async () => {
        const response = await fetch(apiUrl); // Se realiza una solicitud GET a la API
        const notes = await response.json(); // Se parsea la respuesta JSON
        notesGrid.innerHTML = ''; // Se limpia el contenedor de notas
        notes.forEach(note => {
            // Creacion de un div para cada nota y lo llenamos con su informacion respectiva
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.content}</p>
                <p>Etiquetas: ${note.tags.join(', ')}</p>
                <p>Creado: ${new Date(note.createdAt).toLocaleString()}</p>
                <p>Última Modificación: ${new Date(note.updatedAt).toLocaleString()}</p>
                <button class="editNoteBtn" data-id="${note.id}">Editar</button>
            `;
            notesGrid.appendChild(noteDiv); // Agregamos el div al contenedor de notas
        });
        attachEditEventListeners(); // Se agregan los listeners a los botones de edicion despues de generar las notas
    };

    // Funcion para cargar los datos de una nota en el formulario de edicion
    const editNote = (id) => {
        fetch(`${apiUrl}/${id}`) // Se hace una solicitud GET para obtener la nota por su ID
            .then(response => response.json()) // Parseamos la respuesta JSON
            .then(note => {
                // Se llenan los campos del formulario con los datos de la nota
                noteId.value = note.id;
                title.value = note.title;
                content.value = note.content;
                tags.value = note.tags.join(', ');
                document.getElementById('formTitle').textContent = 'Editar Nota';
                saveNoteBtn.textContent = 'Actualizar';
                deleteNoteBtn.style.display = 'inline-block'; // Mostrar el boton de eliminar
            });
    };

    // Agregar event listeners a los botones de edicion
    const attachEditEventListeners = () => {
        const editNoteButtons = document.querySelectorAll('.editNoteBtn'); // Se eligen todos los botones de edicion
        editNoteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id; // Obtenemos el ID de la nota del atributo data-id
                editNote(id); // Se llama a la funcion editNote con el ID
            });
        });
    };

    // Manejo del evento de envio del formulrio
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenimos el envio del formulario por defecto
        const noteData = {
            title: title.value, // Obtenemos el titulo del formulario
            content: content.value, // Obtenemos el contenido del formulario
            tags: tags.value.split(',').map(tag => tag.trim()) // Se convierten las etiquetas en un array
        };
        const method = noteId.value ? 'PUT' : 'POST'; // Se determina si es una actualizacion o una nueva nota
        const url = noteId.value ? `${apiUrl}/${noteId.value}` : apiUrl; // Construimos la URL para la solicitud
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData) // Se mandan los datos de la nota como JSON
        });
        if (response.ok) {
            fetchNotes(); // La lista de notas se actualiza despues de guardar o actualizar
            noteForm.reset(); // Se resetea el formulario
            document.getElementById('formTitle').textContent = 'Crear Nota';
            saveNoteBtn.textContent = 'Guardar';
            deleteNoteBtn.style.display = 'none'; // Se esconde el boton de eliminar
        }
    });

    // Manejo del boton de cancelar
    cancelBtn.addEventListener('click', () => {
        noteForm.reset(); // Se reinicia el formulario
        document.getElementById('formTitle').textContent = 'Crear Nota';
        saveNoteBtn.textContent = 'Guardar';
        deleteNoteBtn.style.display = 'none'; // Se oculta el boton de eliminar
    });

    // Manejo del boton de eliminar
    deleteNoteBtn.addEventListener('click', async () => {
        if (noteId.value) {
            const response = await fetch(`${apiUrl}/${noteId.value}`, { method: 'DELETE' }); // Se hace una solicitud DELETE
            if (response.ok) {
                fetchNotes(); // Actualizamos la lista de notas despues de eliminar
                noteForm.reset(); // Se reinicia el formulario
                document.getElementById('formTitle').textContent = 'Crear Nota';
                saveNoteBtn.textContent = 'Guardar';
                deleteNoteBtn.style.display = 'none'; // Se oculta el boton de eliminar
            }
        }
    });

    // Manejo del boton para crear una nueva nota
    createNoteBtn.addEventListener('click', () => {
        noteForm.reset(); // Se reinicia el formulario
        document.getElementById('formTitle').textContent = 'Crear Nota';
        saveNoteBtn.textContent = 'Guardar';
        deleteNoteBtn.style.display = 'none'; // Se oculta el boton de eliminar
    });

    fetchNotes(); // Inicializamos la lista de notas al cargar la pagina
});


