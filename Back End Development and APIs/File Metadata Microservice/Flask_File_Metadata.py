from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return '''
    <html>
        <body>
            <h1>Upload de Arquivo</h1>
            <form action="/api/fileanalyse" method="post" enctype="multipart/form-data">
                <input type="file" name="upfile">
                <button type="submit">Upload</button>
            </form>
        </body>
    </html>
    '''

@app.route('/api/fileanalyse', methods=['POST'])
def fileanalyse():
    if 'upfile' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['upfile']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        return jsonify({
            "name": filename,
            "type": file.content_type,
            "size": file_size
        })
    else:
        return jsonify({"error": "File type not allowed"}), 400

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
