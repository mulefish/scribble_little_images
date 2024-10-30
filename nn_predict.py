import numpy as np
from PIL import Image
import pickle

# Load the training data
with open('training_data.pkl', 'rb') as f:
    X, Y = pickle.load(f)

# Load the trained model weights and biases
W1 = np.load('W1.npy')
b1 = np.load('b1.npy')
W2 = np.load('W2.npy')
b2 = np.load('b2.npy')

def preprocess_image(img_path):
    img = Image.open(img_path).convert('L').resize((28, 28))
    img_array = np.array(img).reshape(784, 1) / 255.0
    return img_array

def relu(Z):
    return np.maximum(0, Z)

def softmax(Z):
    expZ = np.exp(Z - np.max(Z))
    return expZ / expZ.sum(axis=0, keepdims=True)

def forward_propagation(X):
    Z1 = W1.dot(X) + b1
    A1 = relu(Z1)
    Z2 = W2.dot(A1) + b2
    A2 = softmax(Z2)
    return Z1, A1, Z2, A2

def predict(image):
    _, _, _, A2 = forward_propagation(image)
    return A2

# Predict on a new image
new_image_path = 'static/small_images/6p.png'

new_img_array = preprocess_image(new_image_path)
probabilities = predict(new_img_array)

# Print out the path and name of the incoming image
print(f"Incoming image: {new_image_path}")

# Print out the probabilities for each class
for i, prob in enumerate(probabilities.flatten()):
    print(f"Class {i}: {prob * 100:.2f}%")

# Get the prediction with highest confidence
confidence = np.max(probabilities)
prediction = np.argmax(probabilities)
print(f"Predicted digit: {prediction} with {confidence * 100:.2f}% confidence")
