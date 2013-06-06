var Neuron = $import('Neuron');

$class(
    function NeuronLayer(neuronCount, inputCount) {
        this.neurons = new Array(neuronCount);
        for(var i = 0; i < neuronCount; i++) {
            this.neurons[i] = new Neuron(inputCount);
        }
    },

    function updateValues(inputs) {
        for(var i = 0; i < this.neurons.length; i++) {
            var neuron = this.neurons[i];
            neuron.updateValue(inputs);
        }
    }
);