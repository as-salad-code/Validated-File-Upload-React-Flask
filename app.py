import os
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import datetime
from flask_cors import cross_origin

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg','zip'}
MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB
TIME_FORMAT = '%H:%M'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def valid_date(date_str):
    try:
        datetime.datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False

def valid_time(time_str):
    try:
        datetime.datetime.strptime(time_str, TIME_FORMAT)
        return True
    except ValueError:
        return False

def scan_file(file_path):
    try:
        clamscan_path = r'C:\Users\Sharvari\Downloads\clamav-1.3.0.win.x64\clamav-1.3.0.win.x64\clamscan.exe'
        result = subprocess.run([clamscan_path, '--no-summary', '--stdout', file_path], capture_output=True, text=True)
        if "OK" in result.stdout:
            print("File is safe:", file_path)
            return True
        else:
            print("ClamAV found issues in file:", file_path)
            print("ClamAV Scan Result:", result.stdout)
            return False
    except Exception as e:
        print(f"Error scanning file: {e}")
        return False

@app.route('/upload', methods=['POST'])
@cross_origin(origins='*')
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Unsupported file type'}), 400

    if file.content_length > MAX_FILE_SIZE:
        return jsonify({'error': 'File size exceeds the maximum limit of 1MB'}), 400

    appointment_date = request.form.get('date')
    if not valid_date(appointment_date):
        return jsonify({'error': 'Invalid date format. Date should be in YYYY-MM-DD format'}), 400

    appointment_time = request.form.get('time')
    if not valid_time(appointment_time):
        return jsonify({'error': 'Invalid time format. Time should be in HH:MM format'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Scan the uploaded file
    if scan_file(file_path):
        return jsonify({'message': 'File uploaded and scanned successfully'}), 200
    else:
        os.remove(file_path)
        return jsonify({'error': 'File is infected'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
