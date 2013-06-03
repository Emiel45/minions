$class(

    function Vector(x, y) {
        if(x && y) {
            this.x = x; 
            this.y = y;
        } else {
            this.x = 0;
            this.y = 0;
        }
    },

    function set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    function add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    },

    function sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    },

    function mul(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    },

    function normalize() {
        var len = this.len();
        this.x /= len;
        this.y /= len;
        return this;
    },

    function floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    },

    function random(x, y) {
        this.x = Math.random() * x;
        this.y = Math.random() * y;
        return this;
    },

    function distance(other) {
        return this.clone().sub(other).len();
    },

    function clone() {
        return new Vector(this.x, this.y);
    },

    function len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    function toString() {
        return "Vector { " + this.x.toFixed(2) + ", " + this.y.toFixed(2) + " }";
    }

);