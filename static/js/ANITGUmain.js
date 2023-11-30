document.addEventListener('DOMContentLoaded', function() {

    var uploadButton = document.getElementById('upload-button');
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.style.display = 'none'; // Ocultar el input real

    // Abre el diálogo de selección de archivos cuando se hace clic en el botón
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        var file = fileInput.files[0];
        // Aquí puedes añadir validación del archivo si es necesario
        uploadFile(file);
    });

    // Función para subir el archivo
    function uploadFile(file) {
        var formData = new FormData();
        formData.append('pdf', file);

        fetch('/upload', { // Esta URL deberá ser la ruta a tu servidor backend que maneja la carga
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if(data.success) {
                // Aquí puedes manejar una redirección o mostrar un mensaje de éxito
                console.log('Archivo subido y convertido con éxito');
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
        var file = dt.files[0];

        uploadFile(file);
    }

});
