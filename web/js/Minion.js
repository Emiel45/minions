var Vector = $import('Vector');
var Brain = $import('Brain');
var Input = $import('Input');

var MAX_VELOCITY = 2;
var FOOD_FACTOR = 0.0005;

$class(

    function Minion() {
        this.brain = new Brain(2, 8, 4, 2);
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.direction = Math.random() * 2 * Math.PI;

        this.foodLevel = 1.0;
        this.acceleration = 0;

        this.dead = false;
        this.closestFood = new Vector(0, 0);
        this.closestFoodDistance = 9001;
        this.closestFoodDirection = 0;

        this.relativeDirectionInput = new Input();
        this.closestFoodDistanceInput = new Input();
        this.speedInput = new Input();
        this.foodLevelInput = new Input();
    },

    function render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 4, 2 * Math.PI, false);
        ctx.fillStyle = '#' + ('0' + Math.round((1.0 - this.foodLevel) * 0xff).toString(16)).slice(-2) + ('0' + Math.round(this.foodLevel * 0xff).toString(16)).slice(-2) + '00';
        ctx.fill();
        ctx.closePath();

        var directionPosition = new Vector(Math.sin(this.direction), Math.cos(this.direction)).mul(5).add(this.position);
        ctx.beginPath();
        ctx.fillStyle = 'solid';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(directionPosition.x, directionPosition.y);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.closePath();
    },

    function update() {
        // this.direction %= Math.PI * 2;
        this.closestFoodDirection = -Math.atan2(this.closestFood.y - this.position.y, this.closestFood.x - this.position.x) + Math.PI / 2;
        // this.direction = this.closestFoodDirection;

        // Objective: - = turn left, + = turn right
        var relativeDirection = (this.direction - this.closestFoodDirection);
        if(relativeDirection < Math.PI) relativeDirection += Math.PI * 2;
        if(relativeDirection > Math.PI) relativeDirection -= Math.PI * 2;

        this.relativeDirectionInput.value = relativeDirection;
        this.closestFoodDistanceInput.value = this.closestFoodDistance;
        this.speedInput.value = this.velocity.len();
        this.foodLevelInput.value = this.foodLevel;

        var outputs = this.brain.compute([this.relativeDirectionInput, this.closestFoodDistanceInput, this.speedInput, this.foodLevelInput]);
        var directionOutput = outputs[0];
        var accelerationOutput = outputs[1];

        this.direction += directionOutput.value * 0.1;
        this.acceleration = (accelerationOutput.value + 1) / 2;

        var avariable = new Vector(Math.sin(this.direction), Math.cos(this.direction)).mul(this.acceleration);
        var bvariable = this.velocity.clone().add(avariable);
        if(bvariable.len() > MAX_VELOCITY) {
            bvariable = bvariable.normalize().mul(MAX_VELOCITY);
        }
        this.velocity.set(bvariable.x, bvariable.y);

        this.foodLevel -= this.velocity.len() * FOOD_FACTOR + FOOD_FACTOR;
        if(this.foodLevel < 0) {
            this.die();
        }

        this.position.add(this.velocity);
    },

    function turn(angle) {
        this.direction += angle;
        this.direction %= 2 * Math.PI;
    },

    function eat() {
        this.foodLevel += 0.5;
        if(this.foodLevel > 1.0) this.foodLevel = 1.0;
    },

    function die() {
        this.dead = true;
    }

);