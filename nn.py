import numpy as np
from PIL import Image
import os

# Initialize parameters
input_size = 784       # For 28x28 pixel images (28*28 = 784)
hidden_size = 64       # Number of neurons in the hidden layer
output_size = 10       # Output classes (digits 0-9)
learning_rate = 0.01
epochs = 500

# Initialize weights and biases
np.random.seed(0)
W1 = np.random.randn(hidden_size, input_size) * 0.01
b1 = np.zeros((hidden_size, 1))
W2 = np.random.randn(output_size, hidden_size) * 0.01
b2 = np.zeros((output_size, 1))

# Define the data path and grist structure
data_dir = 'static/small_images/'
grist = {
    1: ["1p.png", "1sawa.png"], 
    2: ["2p.png", "2sawa.png"], 
    3: ["3p.png", "3sawa.png"], 
    4: ["4p.png", "4sawa.png"], 
    5: ["5p.png", "5sawa.png"], 
    6: ["6p.png", "6sawa.png"], 
    7: ["7p.png", "7sawa.png"], 
    8: ["8p.png", "8sawa.png"], 
    9: ["9p.png", "9sawa.png"]
}

# Function to preprocess images
def preprocess_image(img_path):
    img = Image.open(img_path).convert('L').resize((28, 28))  # Convert to grayscale and resize to 28x28
    img_array = np.array(img).reshape(784, 1) / 255.0  # Flatten and normalize
    return img_array

# Prepare training data and labels
X = []
Y = []

for label, files in grist.items():
    for file in files:
        img_path = os.path.join(data_dir, file)
        img_array = preprocess_image(img_path)
        X.append(img_array)
        
        # Create one-hot encoded label
        one_hot_label = np.zeros(10)
        one_hot_label[label] = 1
        Y.append(one_hot_label)

# Convert X and Y to numpy arrays and reshape X correctly
X = np.hstack(X)
Y = np.array(Y).T

# Activation functions
def relu(Z):
    return np.maximum(0, Z)

def softmax(Z):
    expZ = np.exp(Z - np.max(Z))
    return expZ / expZ.sum(axis=0, keepdims=True)

# Forward propagation
def forward_propagation(X):
    Z1 = W1.dot(X) + b1
    A1 = relu(Z1)
    Z2 = W2.dot(A1) + b2
    A2 = softmax(Z2)
    return Z1, A1, Z2, A2

# Backward propagation
def backward_propagation(X, Y, Z1, A1, A2):
    global W1, b1, W2, b2
    m = X.shape[1]
    dZ2 = A2 - Y
    dW2 = (1 / m) * dZ2.dot(A1.T)
    db2 = (1 / m) * np.sum(dZ2, axis=1, keepdims=True)
    dA1 = W2.T.dot(dZ2)
    dZ1 = dA1 * (Z1 > 0)
    dW1 = (1 / m) * dZ1.dot(X.T)
    db1 = (1 / m) * np.sum(dZ1, axis=1, keepdims=True)
    
    # Update weights and biases
    W1 -= learning_rate * dW1
    b1 -= learning_rate * db1
    W2 -= learning_rate * dW2
    b2 -= learning_rate * db2

# Training the model
for epoch in range(epochs):
    Z1, A1, Z2, A2 = forward_propagation(X)
    backward_propagation(X, Y, Z1, A1, A2)
    if epoch % 100 == 0:
        loss = -np.sum(Y * np.log(A2)) / X.shape[1]
        print(f'Epoch {epoch}, Loss: {loss:.4f}')

# Prediction function for a new image
def predict(image):
    _, _, _, A2 = forward_propagation(image)
    confidence = np.max(A2)
    prediction = np.argmax(A2)
    return prediction, confidence * 100

# Example usage for a new image (assuming it is a 28x28 grayscale image):
# new_image_path = 'path_to_your_test_image.png'
# new_img = Image.open(new_image_path).convert('L').resize((28, 28))
# new_img_array = np.array(new_img).flatten() / 255.0
# new_img_array = new_img_array.reshape(-1, 1)
# prediction, confidence = predict(new_img_array)
# print(f"Predicted digit: {prediction} with {confidence:.2f}% confidence")
