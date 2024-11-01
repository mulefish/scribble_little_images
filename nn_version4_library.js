import fs from 'fs';

function sigmoid(x) {
    // Sigmoid activation function
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
    // Derivative of sigmoid for backpropagation
    return x * (1 - x);
}

// Initialize weights and biases for each layer
function initializeWeights(size) {
    return Array.from({ length: size }, () => Math.random());
}

function trainNeuralNetwork(X, y, options) {
    // Training function
    const { learningRate, epochs, hiddenLayerSize } = options;

    let weightsInputToHidden = initializeWeights(hiddenLayerSize);
    let biasesHidden = initializeWeights(hiddenLayerSize);
    let weightsHiddenToOutput = initializeWeights(hiddenLayerSize);
    let biasOutput = Math.random();

    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalError = 0;

        for (let i = 0; i < X.length; i++) {
            const input = X[i];
            const target = y[i];

            // Forward pass
            const hiddenLayerOutputs = weightsInputToHidden.map((weight, j) => sigmoid(weight * input + biasesHidden[j]));
            const output = sigmoid(hiddenLayerOutputs.reduce((sum, hiddenOutput, j) => sum + hiddenOutput * weightsHiddenToOutput[j], biasOutput));

            // Calculate error
            const error = target - output;
            totalError += error ** 2;

            // Backpropagation
            const dOutput = error * sigmoidDerivative(output);
            const dWeightsHiddenToOutput = hiddenLayerOutputs.map(hiddenOutput => dOutput * hiddenOutput);
            const dBiasOutput = dOutput;
            const dHiddenLayerOutputs = weightsHiddenToOutput.map((weight, j) => dOutput * weight * sigmoidDerivative(hiddenLayerOutputs[j]));
            const dWeightsInputToHidden = dHiddenLayerOutputs.map(dHidden => dHidden * input);
            const dBiasesHidden = dHiddenLayerOutputs;

            // Update weights and biases
            weightsHiddenToOutput = weightsHiddenToOutput.map((weight, j) => weight + learningRate * dWeightsHiddenToOutput[j]);
            biasOutput += learningRate * dBiasOutput;
            weightsInputToHidden = weightsInputToHidden.map((weight, j) => weight + learningRate * dWeightsInputToHidden[j]);
            biasesHidden = biasesHidden.map((bias, j) => bias + learningRate * dBiasesHidden[j]);
        }

        // Optionally log progress
        if (epoch % 100 === 0) {
            console.log(`Epoch ${epoch}, Loss: ${(totalError / X.length).toFixed(4)}`);
        }
    }

    return { weightsInputToHidden, biasesHidden, weightsHiddenToOutput, biasOutput };
}

// Save model parameters to file
function saveModel(model, filename = 'trained_model.json') {
    fs.writeFileSync(filename, JSON.stringify(model));
}

export { sigmoid, sigmoidDerivative, initializeWeights, trainNeuralNetwork, saveModel };
