import numpy as np
from PIL import Image
import os
import pickle

# Initialize parameters
input_size = 784
hidden_size = 512  # Increased hidden layer size for better learning
output_size = 10
learning_rate = 0.01  # Adjusted learning rate for potentially faster convergence
epochs = 2000  # Increased number of epochs

# Initialize weights and biases
np.random.seed(0)
W1 = np.random.randn(hidden_size, input_size) * 0.01
b1 = np.zeros((hidden_size, 1))
W2 = np.random.randn(output_size, hidden_size) * 0.01
b2 = np.zeros((output_size, 1))

data_dir = 'static/small_images/'
grist = {
    1: ["1p.png", "1sawa.png", "1p2.png", "1p3.png", "1p4.png"   ], 
    2: ["2p.png", "2sawa.png", "2p2.png", "2p3.png", "2p4.png"], 
    3: ["3p.png", "3sawa.png", "3p2.png", "3p3.png", "3p4.png"], 
    4: ["4p.png", "4sawa.png", "4p2.png", "4p3.png", "4p4.png"], 
    5: ["5p.png", "5sawa.png", "5p2.png", "5p3.png", "5p4.png"], 
    6: ["6p.png", "6sawa.png", "6p2.png", "6p3.png", "6p4.png"], 
    7: ["7p.png", "7sawa.png", "7p2.png", "7p3.png", "7p4.png"], 
    8: ["8p.png", "8sawa.png", "8p2.png", "8p3.png", "8p4.png"], 
    9: ["9p.png", "9sawa.png", "9p2.png", "9p3.png", "9p4.png"]
}

# Image preprocessing function
def preprocess_image(img_path):
    img = Image.open(img_path).convert('L').resize((28, 28))  # Convert to grayscale and resize to 28x28
    img_array = np.array(img).reshape(784, 1) / 255.0  # Flatten and normalize
    return img_array

X = []
Y = []

# Load and preprocess the images, applying one-hot encoding
for label, files in grist.items():
    for file in files:
        img_path = os.path.join(data_dir, file)
        img_array = preprocess_image(img_path)
        X.append(img_array)
        
        one_hot_label = np.zeros((10, 1))  # Shape change to be column vector
        one_hot_label[label] = 1
        Y.append(one_hot_label)

# Stack X and Y arrays for training
X = np.hstack(X)
Y = np.hstack(Y)

# Save preprocessed data for reuse
with open('training_data.pkl', 'wb') as f:
    pickle.dump((X, Y), f)

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

# Training the model with added debugging information
for epoch in range(epochs):
    Z1, A1, Z2, A2 = forward_propagation(X)
    backward_propagation(X, Y, Z1, A1, A2)
    
    # Calculate loss
    if epoch % 100 == 0:
        loss = -np.sum(Y * np.log(A2 + 1e-8)) / X.shape[1]  # Adding small epsilon to avoid log(0)
        print(f'Epoch {epoch}, Loss: {loss:.4f}')

# Save weights and biases after training
np.save('W1.npy', W1)
np.save('b1.npy', b1)
np.save('W2.npy', W2)
np.save('b2.npy', b2)
