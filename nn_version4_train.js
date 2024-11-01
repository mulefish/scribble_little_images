import fs from 'fs';
import { sigmoid, sigmoidDerivative, initializeWeights, trainNeuralNetwork, saveModel } from './nn_version4_library.js';

// Input data (group 'a' and 'b')
const a = [
    0.3249, 0.4363, 0.5934, 0.4594, 0.2602, 0.4560, 0.3685, 0.0838, 0.4377, 0.2216,
    0.5672, 0.1461, 0.0459, 0.4923, 0.0897, 0.4956, 0.2553, 0.4555, 0.0294, 0.1729
];
const b = [
    0.8171, 0.8641, 0.6152, 0.8968, 0.8943, 0.6404, 0.8505, 0.8741, 0.8317, 0.7947,
    0.8303, 0.8179, 0.7470, 0.8194, 0.8517, 0.7424, 0.9805, 0.6999, 0.7093, 0.6436
];

// Labels (0 for 'a' and 1 for 'b')
const X = [...a, ...b];
const y = [...Array(a.length).fill(0), ...Array(b.length).fill(1)];

// Hyperparameters
const learningRate = 0.1;
const epochs = 1000;
const hiddenLayerSize = 5; // Number of neurons in the hidden layer

// Set training options
const options = {
    learningRate,
    epochs,
    hiddenLayerSize,
};

// Train the neural network
const trainedModel = trainNeuralNetwork(X, y, options);

// Save trained model to a file
saveModel(trainedModel, 'trained_model_3_layers.json');
console.log("Training complete. Model saved to 'trained_model_3_layers.json'.");
