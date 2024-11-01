import { test } from 'node:test';
import assert from 'node:assert';
import { sigmoid, sigmoidDerivative, initializeWeights, trainNeuralNetwork } from './nn_version4_library.js';

test('Sigmoid function should calculate correctly', () => {
    assert.strictEqual(sigmoid(0), 0.5);
    assert(sigmoid(2) > 0.5);
    assert(sigmoid(-2) < 0.5);
});

// test('Sigmoid derivative should calculate correctly', () => {
//     assert.strictEqual(sigmoidDerivative(0.5), 0.25);
//     assert(sigmoidDerivative(1) > 0);
// });

// test('Weights should initialize with random values between 0 and 1', () => {
//     const weights = initializeWeights(5);
//     assert.strictEqual(weights.length, 5);
//     weights.forEach(weight => {
//         assert(weight >= 0 && weight <= 1, `Expected weight in range [0,1], got ${weight}`);
//     });
// });

// test('Neural network training should output a model', () => {
//     const X = [0.1, 0.2, 0.3, 0.4];
//     const y = [0, 1, 0, 1];
//     const options = { learningRate: 0.1, epochs: 10, hiddenLayerSize: 3 };
    
//     const model = trainNeuralNetwork(X, y, options);
//     assert('weightsInputToHidden' in model);
//     assert('biasesHidden' in model);
//     assert('weightsHiddenToOutput' in model);
//     assert('biasOutput' in model);
    
//     assert.strictEqual(model.weightsInputToHidden.length, options.hiddenLayerSize);
//     assert.strictEqual(model.biasesHidden.length, options.hiddenLayerSize);
// });
