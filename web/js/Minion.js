var Vector = $import('Vector');

var MAX_VELOCITY = 2;
var FOOD_FACTOR = 0.0005;

$class(

    function Minion() {
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.direction = Math.random() * 2 * Math.PI;

        this.foodLevel = 1.0;
        this.acceleration = 0.5;

        this.dead = false;
    },

    function render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 4, 2 * Math.PI, false);
        ctx.fillStyle = '#' + ('0' + Math.round((1.0 - this.foodLevel) * 0xff).toString(16)).slice(-2) + ('0' + Math.round(this.foodLevel * 0xff).toString(16)).slice(-2) + '00';
        ctx.fill();
        ctx.closePath();
    },

    function update() {
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