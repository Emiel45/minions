var NeuronLayer = $import('NeuronLayer');

$class(

    function Brain(hiddenLayerCount, neuronCount, inputCount, outputCount) {
        this.hiddenLayers = new Array(hiddenLayerCount);
        this.outputLayer = new NeuronLayer(outputCount, neuronCount);

        this.hiddenLayers[0] = new NeuronLayer(neuronCount, inputCount);
        for(var i = 1; i < hiddenLayerCount; i++) {
            this.hiddenLayers[i] = new NeuronLayer(neuronCount, neuronCount);
        }
    },

    function compute(inputs) {
        var currentInputs = inputs;
        for(var i = 0; i < this.hiddenLayers.length; i++) {
            this.hiddenLayers[i].updateValues(currentInputs);
            currentInputs = this.hiddenLayers[i].neurons;
        }
        this.outputLayer.updateValues(currentInputs);
        return this.outputLayer.neurons;
    }

);