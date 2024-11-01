import { test } from 'node:test';
import assert from 'node:assert';
import { sigmoid, sigmoidDerivative, initializeWeights, trainNeuralNetwork } from './nn_version4_library.js';
import { predict } from './nn_version4_predict.js';


const modelName = 'nn_version4_model.json';

// Mock model data for testing
const mockModel = {
    weightsInputToHidden: [0.5, 0.5, 0.5, 0.5, 0.5],
    biasesHidden: [0.1, 0.1, 0.1, 0.1, 0.1],
    weightsHiddenToOutput: [0.3, 0.3, 0.3, 0.3, 0.3],
    biasOutput: 0.2,
};

test('Predict function should return values within expected range for numeric input', () => {
    const numericInputs = [-100, -1, 0, 0.1, 0.5, 1, 1.1, 100];
    
    numericInputs.forEach(input => {
        const result = predict(input, mockModel);
        assert(result >= 0 && result <= 1, `Expected result between 0 and 1, got ${result} for input ${input}`);
    });
});

test('Predict function should handle non-numeric input gracefully', () => {
    const nonNumericInput = 'Kittycat';
    
    try {
        const result = predict(nonNumericInput, mockModel);
        // If predict runs, we check for NaN as the output
        assert(Number.isNaN(result), `Expected NaN, but got ${result}`);
    } catch (error) {
        // If predict throws an error, it should be because of non-numeric input
        assert(error instanceof TypeError, 'Expected TypeError for non-numeric input');
    }
});

test('Predict function should handle edge values correctly', () => {
    const edgeInputs = [0, 1];
    
    edgeInputs.forEach(input => {
        const result = predict(input, mockModel);
        assert(result >= 0 && result <= 1, `Expected result between 0 and 1, got ${result} for input ${input}`);
    });
});

// + ----- LIBRARY TESTS FOLLOW--------------------------------------------------------- 

test('Sigmoid function should calculate correctly', () => {
    assert.strictEqual(sigmoid(0), 0.5);
    assert(sigmoid(2) > 0.5);
    assert(sigmoid(-2) < 0.5);
});

test('Sigmoid derivative produces expected values within [0, 1] range and edge cases', () => { 
    assert.strictEqual(sigmoidDerivative(0.5), 0.25); // Typical midpoint of sigmoid
    assert(sigmoidDerivative(0.9) > 0);  // Within (0, 1), should be positive
    assert(sigmoidDerivative(0.1) > 0);  // Within (0, 1), should be positive
    assert.strictEqual(sigmoidDerivative(1), 0);  // Edge case, derivative is zero
    assert.strictEqual(sigmoidDerivative(0), 0);  // Edge case, derivative is zero
});
test('Weights should initialize with random values between 0 and 1', () => {
    const weights = initializeWeights(5);
    assert.strictEqual(weights.length, 5);
    weights.forEach(weight => {
        assert(weight >= 0 && weight <= 1, `Expected weight in range [0,1], got ${weight}`);
    });
});

test('Neural network training should output a model', () => {
    const X = [0.1, 0.2, 0.3, 0.4];
    const y = [0, 1, 0, 1];
    const options = { learningRate: 0.1, epochs: 10, hiddenLayerSize: 3 };
    
    const model = trainNeuralNetwork(X, y, options);
    assert('weightsInputToHidden' in model);
    assert('biasesHidden' in model);
    assert('weightsHiddenToOutput' in model);
    assert('biasOutput' in model);
    
    assert.strictEqual(model.weightsInputToHidden.length, options.hiddenLayerSize);
    assert.strictEqual(model.biasesHidden.length, options.hiddenLayerSize);
});
