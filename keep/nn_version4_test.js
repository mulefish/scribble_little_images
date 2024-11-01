import assert from 'assert';
import { sigmoid, sigmoidDerivative, initializeWeights, trainNeuralNetwork } from './nn_version4_library.js';

describe('Neural Network Library', function () {
    
    it('should calculate the sigmoid function correctly', function () {
        assert.strictEqual(sigmoid(0), 0.5);
        assert(sigmoid(2) > 0.5);
        assert(sigmoid(-2) < 0.5);
    });

    it('should calculate the sigmoid derivative correctly', function () {
        assert.strictEqual(sigmoidDerivative(0.5), 0.25);
        assert(sigmoidDerivative(1) > 0);
    });

    it('should initialize weights with random values between 0 and 1', function () {
        const weights = initializeWeights(5);
        assert.strictEqual(weights.length, 5);
        weights.forEach(weight => {
            assert(weight >= 0 && weight <= 1, `Expected weight in range [0,1], got ${weight}`);
        });
    });

    it('should train the neural network and output a model', function () {
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

});
