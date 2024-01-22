from flask import Flask, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/test")
def test():
    return {"Status": "ok"}

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filename = "received_photo.png"
        save_path = os.path.join('./', filename)
        file.save(save_path)
        return 'File saved successfully', 200

if __name__ == "__main__":
    app.run()