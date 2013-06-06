$class(
    function Neuron(inputCount) {
        this.inputWeights = new Array(inputCount);
        for(var i = 0; i < inputCount; i++) {
            this.inputWeights[i] = Math.random();
            if(Math.random() > 0.5) {
                this.inputWeights[i] *= -1;
            }
        }
        this.value = 0;
    },

    function updateValue(inputs) {
        var formattedValues = [];
        for(var i = 0; i < inputs.length; i++) {
            formattedValues.push(inputs[i].value);
        }

        var sum = 0;
        for(var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var inputWeight = this.inputWeights[i];

            sum += input.value * inputWeight;
        }
        this.value = this.calculateTreshold(sum);
    },

    function calculateTreshold(x) {
        if(x > 100) {
            return 1;
        }
        if(x < -100) {
            return -1;
        }
        var e = Math.exp(2*x);
        var result = (e-1) / (e+1);
        if((result < 0 && result > -0.2) || (result > 0 && result < 0.2)) {
            return 0;
        }
        return result;
    }
);