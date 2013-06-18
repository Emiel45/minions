/**
 * Webapp entry point.
 * Copyright (c) 2013 Emiel Tasseel, All rights reserved.
 */

(function(window) {

    var Life = $import("Life", function() {
        var life = window.life = new Life();
        life.init();

        life.renderTimer = setInterval(function() {
        	life.render();
        }, 1000/60);
    });

})(window);