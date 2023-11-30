from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configuración
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')  # Ruta actualizada
ALLOWED_EXTENSIONS = {'pdf'}

# Asegurarse de que es un archivo permitido
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Revisar si la petición tiene el archivo parte
        if 'pdf' not in request.files:
            return redirect(request.url)
        pdf = request.files['pdf']
        # Si el usuario no selecciona un archivo, el navegador podría
        # enviar una parte vacía sin nombre de archivo
        if pdf.filename == '':
            return redirect(request.url)
        if pdf and allowed_file(pdf.filename):
            filename = secure_filename(pdf.filename)
            pdf.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify(success=True)  # Responde con JSON de éxito
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
