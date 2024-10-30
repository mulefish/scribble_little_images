from PIL import Image
import os

# Define the directory containing the images
data_dir = 'static/small_images/'

# Loop through each file in the directory
for file_name in os.listdir(data_dir):
    # Check if the file is a .png file
    if file_name.lower().endswith('.png'):
        file_path = os.path.join(data_dir, file_name)
        
        # Open the image and get its dimensions
        with Image.open(file_path) as img:
            width, height = img.size
            print(f"Image: {file_name}, Width: {width}, Height: {height}")
