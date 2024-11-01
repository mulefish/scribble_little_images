import { promises as fs } from 'fs';
import { sigmoid } from './nn_version4_library.js';

// Asynchronously load the model
async function loadModel(filename = 'trained_model_3_layers.json') {
    const data = await fs.readFile(filename, 'utf-8');
    return JSON.parse(data);
}

function predict(input, model) {
    const { weightsInputToHidden, biasesHidden, weightsHiddenToOutput, biasOutput } = model;

    // Forward pass to hidden layer
    const hiddenLayerOutputs = weightsInputToHidden.map((weight, j) => 
        sigmoid(weight * input + biasesHidden[j])
    );

    // Forward pass to output layer
    const output = sigmoid(
        hiddenLayerOutputs.reduce((sum, hiddenOutput, j) => 
            sum + hiddenOutput * weightsHiddenToOutput[j], biasOutput
        )
    );

    // Output is interpreted as the probability of class "b"
    return output;
}

async function runPredictions() {
    // Load the trained model
    const model = await loadModel();

    // Test examples
    const examples = [
        -100, -1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.9999, 1, 1.1, 100, "Kittycat"
    ];

    // Print predictions
    examples.forEach(example => {
        const probabilityB = predict(example, model);
        const probabilityA = 1 - probabilityB;
        console.log(`Input: ${example}`);
        console.log(`  Probability of class 'a': ${(probabilityA * 100).toFixed(2)}%`);
        console.log(`  Probability of class 'b': ${(probabilityB * 100).toFixed(2)}%`);
    });
}

// Run the predictions
runPredictions().catch(error => {
    console.error('Error loading the model or making predictions:', error);
});