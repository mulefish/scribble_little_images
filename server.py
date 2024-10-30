import os
from flask import Flask, render_template, request
import base64

app = Flask(__name__)

# Ensure the images directory exists
os.makedirs(os.path.join(app.static_folder, 'images'), exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_image', methods=['POST'])
def save_image():
    data_url = request.form['imageData']
    filename = request.form['filename']
    header, encoded = data_url.split(",", 1)
    image_data = base64.b64decode(encoded)

    # Save the image to the images directory
    file_path = os.path.join(app.static_folder, 'images', f"{filename}.png")
    with open(file_path, "wb") as f:
        f.write(image_data)
    
    return "Image saved successfully!"

if __name__ == '__main__':
    app.run(debug=True)
