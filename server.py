import os
from flask import Flask, render_template, request, jsonify
import base64

app = Flask(__name__)

# Ensure the images directory exists
images_dir = os.path.join(app.static_folder, 'images')
os.makedirs(images_dir, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/politics')
def politics():
    return render_template('politics.html')


@app.route('/save_image', methods=['POST'])
def save_image():
    data_url = request.form['imageData']
    filename = request.form['filename']
    header, encoded = data_url.split(",", 1)
    image_data = base64.b64decode(encoded)

    # Save the image to the images directory
    file_path = os.path.join(images_dir, f"{filename}.png")
    with open(file_path, "wb") as f:
        f.write(image_data)
    
    return "Image saved successfully!"

@app.route('/get_images', methods=['GET'])
def get_images():
    # List all .png files in the images directory
    images = [
        {"filename": f, "title": os.path.splitext(f)[0]}
        for f in os.listdir(images_dir)
        if f.endswith('.png')
    ]
    return jsonify(images)

if __name__ == '__main__':
    app.run(debug=True)
