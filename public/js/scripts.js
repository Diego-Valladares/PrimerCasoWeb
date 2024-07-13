document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notesGrid'); // Contenedor donde se muestran las notas
    const noteFormContainer = document.getElementById('noteFormContainer'); // Contenedor del formulario
    const createNoteBtn = document.getElementById('createNoteBtn'); // Boton para crear una nueva nota
    const noteForm = document.getElementById('noteForm'); // Formulario para crear/editar notas
    const noteId = document.getElementById('noteId'); // Campo oculto para almacenar el ID de la nota actual
    const title = document.getElementById('title'); // Campo para el titulo de la nota
    const titleError = document.getElementById('titleError'); // Mensaje de error para el titulo
    const content = document.getElementById('content'); // Campo para el contenido de la nota
    const tags = document.getElementById('tags'); // Campo para las etiquetas de la nota
    const tagsError = document.getElementById('tagsError'); // Mensaje de error para las etiquetas
    const saveNoteBtn = document.getElementById('saveNote'); // Boton para guardar la nota
    const cancelBtn = document.getElementById('cancel'); // Boton para cancelar la edicion
    const deleteNoteBtn = document.getElementById('deleteNote'); // Boton para eliminar la nota
    const searchInput = document.getElementById('searchInput'); // Campo de busqueda

    const apiUrl = '/notas'; // URL base de la API para las notas

    // Funcion para obtener y mostrar todas las notas
    const fetchNotes = async (searchTerm = '') => {
        try {
            const response = await fetch(apiUrl); // Se realiza una solicitud GET a la API
            const notes = await response.json(); // Se parsea la respuesta JSON
            notesGrid.innerHTML = ''; // Se limpia el contenedor de notas
            const filteredNotes = notes.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            filteredNotes.forEach(note => {
                // Creacion de un div para cada nota y se llena con su informacion respectiva
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note';
                noteDiv.innerHTML = `
                    <h2>${note.title}</h2>
                    <p>${note.content}</p>
                    <p>Etiquetas: ${note.tags.join(', ')}</p>
                    <p>Creado: ${new Date(note.createdAt).toLocaleString()}</p>
                    <p>Ultima Modificacion: ${new Date(note.updatedAt).toLocaleString()}</p>
                    <button class="editNoteBtn" data-id="${note.id}">Editar</button>
                `;
                notesGrid.appendChild(noteDiv); // Se agrega el div al contenedor de notas
            });
            attachEditEventListeners(); // Se agregan listeners a los botones de edicion despues de generar las notas
        } catch (error) {
            console.error('Error al obtener las notas:', error);
        }
    };

    // Agregar event listeners a los botones de edicion
    const attachEditEventListeners = () => {
        const editNoteButtons = document.querySelectorAll('.editNoteBtn'); // Seleccionar todos los botones de edicion
        editNoteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id; // Se obtiene el ID de la nota del atributo data-id
                window.location.href = `/edit/${id}`; // Redirigir a la pagina de edicion con el ID de la nota
            });
        });
    };

    // Logica para la pagina de edicion
    if (window.location.pathname.includes('/edit/')) {
        const noteId = window.location.pathname.split('/').pop(); // Obtener el ID de la nota de la URL
        const apiUrl = `/notas/${noteId}`; // URL de la API para obtener la nota especifica

        // Obtener la nota y llenar el formulario
        fetch(apiUrl)
            .then(response => response.json())
            .then(note => {
                document.getElementById('noteId').value = note.id;
                document.getElementById('title').value = note.title;
                document.getElementById('content').value = note.content;
                document.getElementById('tags').value = note.tags.join(', ');
                console.log('Nota cargada para edicion:', note);
            });

        // Manejo del evento de envio del formulario para actualizar la nota
        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el envio del formulario por defecto

            // Validar la longitud del titulo
            if (title.value.length >= 200) {
                titleError.textContent = 'El titulo no puede exceder los 200 caracteres.';
                titleError.style.display = 'block';
                return;
            } else {
                titleError.style.display = 'none';
            }

            // Validar la longitud de cada etiqueta
            const tagsArray = tags.value.split(',').map(tag => tag.trim());
            const invalidTag = tagsArray.find(tag => tag.length >= 100);
            if (invalidTag) {
                tagsError.textContent = 'La etiqueta no puede exceder los 100 caracteres.';
                tagsError.style.display = 'block';
                return;
            } else {
                tagsError.style.display = 'none';
            }

            const noteData = {
                title: title.value, // Se obtiene el titulo del formulario
                content: content.value, // Se obtiene el contenido del formulario
                tags: tagsArray // Convertir las etiquetas en un array
            };

            try {
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData) // Enviar los datos de la nota como JSON
                });
                if (response.ok) {
                    alert('Nota actualizada correctamente.');
                    console.log('Nota actualizada:', noteData);
                    window.location.href = '/'; // Redirigir a la pagina principal despues de guardar
                } else {
                    const errorData = await response.json();
                    console.error('Error al actualizar la nota:', errorData);
                    alert('Error al actualizar la nota.');
                }
            } catch (error) {
                console.error('Error al actualizar la nota:', error);
                alert('Error al actualizar la nota.');
            }
        });

        // Manejo del boton de eliminar
        deleteNoteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(apiUrl, { method: 'DELETE' }); // Hacer una solicitud DELETE
                if (response.ok) {
                    alert('Nota eliminada correctamente.');
                    console.log('Nota eliminada:', noteId);
                    window.location.href = '/'; // Redirigir a la pagina principal despues de eliminar
                } else {
                    const errorData = await response.json();
                    console.error('Error al eliminar la nota:', errorData);
                    alert('Error al eliminar la nota.');
                }
            } catch (error) {
                console.error('Error al eliminar la nota:', error);
                alert('Error al eliminar la nota.');
            }
        });

        // Manejo del boton de cancelar
        cancelBtn.addEventListener('click', () => {
            window.location.href = '/'; // Redirigir a la pagina principal
        });
    } else {
        // Logica para la pagina principal
        // Manejo del evento de envio del formulario para crear una nueva nota
        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el envio del formulario por defecto

            // Validar la longitud del titulo
            if (title.value.length >= 200) {
                titleError.textContent = 'El titulo no puede exceder los 200 caracteres.';
                titleError.style.display = 'block';
                return;
            } else {
                titleError.style.display = 'none';
            }

            // Validar la longitud de cada etiqueta
            const tagsArray = tags.value.split(',').map(tag => tag.trim());
            const invalidTag = tagsArray.find(tag => tag.length >= 100);
            if (invalidTag) {
                tagsError.textContent = 'La etiqueta no puede exceder los 100 caracteres.';
                tagsError.style.display = 'block';
                return;
            } else {
                tagsError.style.display = 'none';
            }

            const noteData = {
                title: title.value, // Se obtiene el titulo del formulario
                content: content.value, // Se obtiene el contenido del formulario
                tags: tagsArray // Convertir las etiquetas en un array
            };
            const method = noteId.value ? 'PUT' : 'POST'; // Determinar si es una actualizacion o una nueva nota
            const url = noteId.value ? `${apiUrl}/${noteId.value}` : apiUrl; // Construir la URL para la solicitud

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData) // Enviar los datos de la nota como JSON
                });
                if (response.ok) {
                    alert('Nota guardada correctamente.');
                    console.log('Nota creada/actualizada:', noteData);
                    fetchNotes(); // Se actualiza la lista de notas despues de guardar o actualizar
                    noteForm.reset(); // Reiniciar el formulario
                    titleError.style.display = 'none'; // Ocultar el mensaje de error
                    tagsError.style.display = 'none'; // Ocultar el mensaje de error
                    noteId.value = ''; // Reiniciar el campo noteId
                    document.getElementById('formTitle').textContent = 'Crear Nota';
                    saveNoteBtn.textContent = 'Guardar';
                    deleteNoteBtn.style.display = 'none'; // Ocultar el boton de eliminar
                    noteFormContainer.style.display = 'none'; // Ocultar el formulario
                    createNoteBtn.style.display = 'inline-block'; // Mostrar el boton de crear nota
                } else {
                    const errorData = await response.json();
                    console.error('Error al crear/actualizar la nota:', errorData);
                    alert('Error al crear/actualizar la nota.');
                }
            } catch (error) {
                console.error('Error al crear/actualizar la nota:', error);
                alert('Error al crear/actualizar la nota.');
            }
        });

        // Manejo del boton de cancelar
        cancelBtn.addEventListener('click', () => {
            noteForm.reset(); // Reiniciar el formulario
            titleError.style.display = 'none'; // Ocultar el mensaje de error
            tagsError.style.display = 'none'; // Ocultar el mensaje de error para las etiquetas
            noteId.value = ''; // Reiniciar el campo noteId
            document.getElementById('formTitle').textContent = 'Crear Nota';
            saveNoteBtn.textContent = 'Guardar';
            deleteNoteBtn.style.display = 'none'; // Ocultar el boton de eliminar
            noteFormContainer.style.display = 'none'; // Ocultar el formulario
            createNoteBtn.style.display = 'inline-block'; // Mostrar el boton de crear nota
        });

        // Manejo del boton para crear una nueva nota
        createNoteBtn.addEventListener('click', () => {
            noteFormContainer.style.display = 'block'; // Mostrar el formulario
            createNoteBtn.style.display = 'none'; // Ocultar el boton de crear nota
            noteForm.reset();
            titleError.style.display = 'none'; // Ocultar el mensaje de error
            tagsError.style.display = 'none'; // Ocultar el mensaje de error para las etiquetas
            noteId.value = ''; // Reiniciar el campo noteId
            document.getElementById('formTitle').textContent = 'Crear Nota';
            saveNoteBtn.textContent = 'Guardar';
            deleteNoteBtn.style.display = 'none'; // Ocultar el boton de eliminar
        });

        // Manejo del evento de busqueda
        searchInput.addEventListener('input', () => {
            fetchNotes(searchInput.value);
        });

        fetchNotes(); // Inicializar la lista de notas al cargar la pagina
    }
});



