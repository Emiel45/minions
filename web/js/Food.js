var Vector = $import('Vector');

$class(

    function Food() {
        this.position = new Vector();
    },

    function render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 4, 2 * Math.PI, false);
        ctx.fillStyle = '#691F01';
        ctx.fill();
        ctx.closePath();
    }

);