document.addEventListener('DOMContentLoaded', function() {

    var uploadButton = document.getElementById('upload-button');
    var fileInput = document.getElementById('pdf-upload'); // Cambiamos para usar el input del formulario
    var submitButton = document.querySelector('input[type="submit"]');

    // Abre el diálogo de selección de archivos cuando se hace clic en el botón
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        // Muestra el botón de enviar cuando se selecciona un archivo
        if (fileInput.files.length > 0) {
            submitButton.style.display = 'block';
        }
    });

    // Intercepta el envío del formulario para hacer la carga con AJAX
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        var file = fileInput.files[0];
        if (file) {
            uploadFile(file);
        }
    });

    // Función para subir el archivo
    function uploadFile(file) {
        var formData = new FormData();
        formData.append('pdf', file);

        fetch('/', { // Asegúrate de que esta URL coincida con la configurada en tu servidor Flask
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                // Aquí puedes manejar una redirección o mostrar un mensaje de éxito
                console.log('Archivo subido con éxito');
            } else {
                // Manejo de errores del servidor
                console.error('Hubo un error en la carga del archivo');
            }
        })
        .catch(function(error) {
            // Manejo de errores de red
            console.error('Error en la red al intentar subir el archivo:', error);
        });
    }

    // Lógica para manejar el arrastrar y soltar
    var dropArea = document.querySelector('.upload-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        if (files.length) {
            fileInput.files = files;
            submitButton.style.display = 'block';
        }
        uploadFile(files[0]);
    }

});
