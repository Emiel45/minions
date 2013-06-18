var Minion = $import('Minion');
var Food = $import('Food');
var Vector = $import('Vector');

$class(

    function Life() {
        this.info = $("#info");
        this.info.hide();
        this.info.draggable();
        this.info.resizable();

        this.infoText = $('<pre />').addClass('scrollable');
        this.info.append(this.infoText);

        this.selectedMinion = undefined;

        this.canvas = document.getElementById('screen');
        this.ctx = this.canvas.getContext('2d');

        this.buffer = document.createElement('canvas');
        this.buffer.width = this.canvas.width;
        this.buffer.height = this.canvas.height;
        this.bufferCtx = this.buffer.getContext('2d');

        this.minions = new Array();
        this.food = new Array();
    },

    function registerEvent(element, event) {
        if(event.name.toLowerCase().substring(0, 2) != 'on') {
            console.error("Panic!");
            return;
        }

        $(element).bind(event.name.toLowerCase().substring(2), $bind(this, event));
    },

    function init() {
        for(var i = 0; i < 100; i++) {
            this.food[i] = new Food();
            this.food[i].position.random(this.canvas.width, this.canvas.height).floor();
            console.log(this.food[i]);
        }

        this.minions.push(new Minion());

        this.registerEvent(this.canvas, this.onMouseDown);
        this.registerEvent(document,    this.onMouseMove);
        this.registerEvent(document,    this.onMouseUp);
        this.registerEvent(document,    this.onKeyDown);

        this.renderTimer = setInterval($bind(this, this.render), 1000/60);
    },

    function render() {
        this.update();

        this.bufferCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
        for(var i in this.food) {
            this.food[i].render(this.bufferCtx);
        }

        for(var i in this.minions) {
            this.minions[i].render(this.bufferCtx);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.buffer, 0, 0);
    },

    function update() {
        var newMinions = new Array();
        for(var i in this.minions) {
            var minion = this.minions[i];
            minion.update();
            
            if(!minion.dead) {
                newMinions.push(minion);
            }

            if(minion.position.x > this.canvas.width) minion.position.x -= this.canvas.width;
            if(minion.position.y > this.canvas.height) minion.position.y -= this.canvas.height;
            if(minion.position.x < 0) minion.position.x = this.canvas.width - minion.position.x;
            if(minion.position.y < 0) minion.position.y = this.canvas.height - minion.position.y;

            this.collideMinionWithFood(minion);
            this.collideMinionWithMinion(minion);
        }
        this.minions = newMinions;

        if(this.selectedMinion) {
            var minion = this.selectedMinion;
            this.info.show();

            var debugText = "";

            // var properties = Object.keys(minion);
            // for(var i in properties) {
            //     var property = properties[i];
            //     debugText += property + ": " + minion[property] + "\n";
            // }

            debugText = JSON.stringify(minion, undefined, 2);

            this.infoText.text(debugText);
        } else {
            this.info.hide();
        }
    },

    function collideMinionWithFood(minion) {
        minion.closestFoodDistance = 9001;
        for(var i in this.food) {
            var foodDistance = this.food[i].position.distance(minion.position);
            if(foodDistance < 8) {
                minion.eat();
                this.food[i].position.random(this.canvas.width, this.canvas.height).floor();
            }

            if(foodDistance < minion.closestFoodDistance) {
                minion.closestFoodDistance = foodDistance;
                minion.closestFood = this.food[i].position;
            }
        }
    },

    function collideMinionWithMinion(minion) {
        minion.closestMinionDistance = 9001;

        for(var i in this.minions) {
            var minionDistance = this.minions[i].position.distance(minion.position);

            if(minionDistance < minion.closestMinionDistance) {
                minion.closestMinionDistance = minionDistance;
                minion.closestMinion = this.minions[i].position;
            }
        }
    },

    function onMouseDown(e) {
        e.preventDefault();
        var x = e.clientX - this.canvas.offsetLeft;
        var y = e.clientY - this.canvas.offsetTop;

        var mousePos = new Vector(x, y);
        var minionClicked = false;

        for(var i in this.minions) {
            var minion = this.minions[i];
            if(minion.position.distance(mousePos) < 8) {
                this.selectedMinion = minion;
                minionClicked = true;
            }
        }

        if(!minionClicked) {
            var minion = new Minion();
            minion.position.set(x, y);

            this.minions.push(minion);
        }
    },

    function onMouseMove(e) {
        e.preventDefault();
        var x = e.clientX - this.canvas.offsetLeft;
        var y = e.clientY - this.canvas.offsetTop;
    },

    function onMouseUp(e) {
        e.preventDefault();
        var x = e.clientX - this.canvas.offsetLeft;
        var y = e.clientY - this.canvas.offsetTop;
    },

    function onKeyDown(e) {
        if(e.target.tagName.toLowerCase() == 'input') return true;

        switch(e.charCode) {
        case 97: // 'a'
            break;
        }

        switch(e.keyCode) {
        case 37: // left
            if(this.selectedMinion) {
                this.selectedMinion.turn(0.1);
            }
            break;

        case 39: // right
            if(this.selectedMinion) {
                this.selectedMinion.turn(-0.1);
            }
            break;
        }
    }
);