/**
 * A class system for Javascript.
 * Copyright (c) 2013 Emiel Tasseel, All rights reserved.
 */

(function(window) {

    // Local fields.
    var _classes = { };

    function generateNamedFunction(name, f) {
        return eval("(function " + name + "() { return f.apply(this, arguments); })");
    }

    function getClassObj(className) {
        if(_classes[className]) return _classes[className];

        // Define class.
        var classObj = _classes[className] = generateNamedFunction(className, function() {
            if('__constructor' in classObj) {
                return classObj.__constructor.apply(this, arguments);
            } else {
                // Warn if class isn't loaded yet.
                console.error("Constructing an unloaded class!");
            }
        });
        classObj.name = className;
        classObj.imports = { };
        classObj.isLoaded = false;
        classObj.isConstructed = false;
        classObj.isLoadIssued = false;
        classObj.toString = function() { return "[class " + className + "]" };

        return classObj;
    }

    function $class(constructor, _) {
        // Retrieve class info from the constructor.
        var className = constructor.name;
        var classObj = getClassObj(className);

        // Attach the constructor.
        classObj.__constructor = constructor;

        // Attach all the functions.
        for(var i = 1; i < arguments.length; i++) {
            var functionObject = arguments[i];
            classObj.prototype[functionObject.name] = functionObject;
        }

        // Class is constructed.
        classObj.isConstructed = true;
    }

    function $import(className, callback) {
        var classObj = _classes[className];
        if(!classObj || (!_classes[className].isConstructed && !_classes[className].isLoadIssued)) {
            classObj = getClassObj(className);
            classObj.isLoadIssued = true;
            classObj.callback = callback;

            // Fetch the script corresponding to the class if it isn't loaded yet.
            $.get("js/" + className + ".js", "", function(data, textStatus, jqXHR) {
                // Detour $import.
                var $import_from_class = generateNamedFunction("$import", function(cn, cb) {
                    // Dynamic class load.
                    if(classObj.isLoaded) {
                        return $import(cn, cb);
                    }

                    // Static class load.
                    classObj.imports[cn] = false;
                    return getClassObj(cn);
                });

                // Load class using detourted $import and reference to itself.
                eval("(function($import, " + className + ") { " + data + " })($import_from_class, classObj)");

                // Ensure $class call for the class that's being loaded.
                if(!classObj.isConstructed) {
                    console.error("Tried to load class " + className + ", but no class found!");
                    return;
                }

                // Load imports.
                if(Object.keys(classObj.imports).length != 0) {
                    for(var importName in classObj.imports) {
                        console.log("[" + classObj.name + "] Loading " + importName + "...");
                        $import(importName, function(importedClass) {
                            console.log("[" + classObj.name + "] " + importedClass.name + " loaded!");
                            classObj.imports[importedClass.name] = true;

                            var loaded = true;
                            for(var i in classObj.imports) {
                                if(!classObj.imports[i]) loaded = false;
                            }

                            // When all imports all loaded, issue callback.
                            if(loaded) {
                                classObj.isLoaded = true;
                                classObj.callback(classObj);
                            }
                        });
                    }
                } else {
                    // No imports, issue callback immediately.
                    classObj.isLoaded = true;
                    classObj.callback(classObj);
                }
            }, "text");
        } else {
            if(callback) {
                callback.call(classObj, classObj);
            }
        }

        return classObj;
    }

    function $bind(instance, func) {
        return function() {
            return func.apply(instance, arguments);
        };
    }

    // Register public methods.
    window.$class = $class;
    window.$import = $import;
    window.$bind = $bind;

})(window);