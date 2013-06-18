var Vector = $import('Vector');
var Brain = $import('Brain');
var Input = $import('Input');

var MAX_VELOCITY = 2;
var FOOD_FACTOR = 0.0005;

$class(

    function Minion(life) {

        this.world = life;

        this.brain = new Brain(2, 8, 6, 3);
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.direction = Math.random() * 2 * Math.PI;

        this.foodLevel = 1.0;
        this.acceleration = 0;

        this.dead = false;
        this.closestFood = new Vector(0, 0);
        this.closestFoodDistance = 9001;
        this.closestFoodDirection = 0;

        this.closestMinion = null;
        this.closestMinionDistance = 9001;
        this.closestMinionDirection = 0;

        this.closestFoodDirectionInput = new Input();
        this.closestFoodDistanceInput = new Input();

        this.closestMinionDirectionInput = new Input();
        this.closestMinionDistanceInput = new Input();

        this.speedInput = new Input();

        this.foodLevelInput = new Input();
    },

    function render(ctx) {

        var colorLevel = Math.min(this.foodLevel / 5.0, 1.0);

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 4, 2 * Math.PI, false);
        ctx.fillStyle = '#' + ('0' + Math.round((1.0 - colorLevel) * 0xff).toString(16)).slice(-2) + ('0' + Math.round(colorLevel * 0xff).toString(16)).slice(-2) + '00';
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
        this.closestFoodDirection = -1 * Math.atan2(this.closestFood.y - this.position.y, this.closestFood.x - this.position.x) + Math.PI / 2;
        
        // this.direction = this.closestFoodDirection;

        // Objective: - = turn left, + = turn right
        var relativeDirection = (this.direction - this.closestFoodDirection);
        if(relativeDirection < Math.PI) relativeDirection += Math.PI * 2;
        if(relativeDirection > Math.PI) relativeDirection -= Math.PI * 2;

        this.closestFoodDirectionInput.value = relativeDirection;
        this.closestFoodDistanceInput.value = this.closestFoodDistance;


        if(this.closestMinion) {
            this.closestMinionDirection = -1 * Math.atan2(this.closestMinion.position.y - this.position.y, this.closestMinion.position.x - this.position.x) + Math.PI / 2;
            relativeDirection = (this.direction - this.closestMinionDirection);
            if(relativeDirection < Math.PI) relativeDirection += Math.PI * 2;
            if(relativeDirection > Math.PI) relativeDirection -= Math.PI * 2;

            this.closestMinionDirectionInput.value = relativeDirection;
            this.closestMinionDistanceInput.value = this.closestMinionDistance;
        } else {
            this.closestMinionDistanceInput.value = 1000.0;
            this.closestMinionDirectionInput.value = 0.0;
        }

        this.speedInput.value = this.velocity.len();
        this.foodLevelInput.value = this.foodLevel;

        var outputs = this.brain.compute([
            this.closestFoodDirectionInput, 
            this.closestFoodDistanceInput, 
            this.speedInput, 
            this.foodLevelInput, 
            this.closestMinionDistanceInput, 
            this.closestMinionDirection
        ]);
        
        var directionOutput = outputs[0];
        var accelerationOutput = outputs[1];
        var breedingThreshold = outputs[2];

        this.direction += directionOutput.value * 0.1;
        this.acceleration = (accelerationOutput.value + 1) / 2;

        var avariable = new Vector(Math.sin(this.direction), Math.cos(this.direction)).mul(this.acceleration);
        var bvariable = this.velocity.clone().add(avariable);
        if(bvariable.len() > MAX_VELOCITY) {
            bvariable = bvariable.normalize().mul(MAX_VELOCITY);
        }
        this.velocity.set(bvariable.x, bvariable.y);

        this.foodLevel -= this.velocity.len() * FOOD_FACTOR + FOOD_FACTOR;
        if(breedingThreshold > 0.5) {
            this.breed();
        }

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
        if(this.foodLevel > 5.0) this.foodLevel = 5.0;
    },

    function breed() {
        this.foodLevel -= 1.0;

        if(this.foodLevel > 0.0) {
            var otherMinion = this.getBreedingMinion();

            if(this.closestMinion) {
                this.world.minions.push(new Minion(this.world));
            }
        }
    },

    function die() {
        this.dead = true;
    }

);