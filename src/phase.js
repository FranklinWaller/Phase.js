(function(global) {

    var private = {
        registerdModules: {},
        amountOfModules: 0,
        moduleScope: {},
        
        ajax: function(options) {
            var xmlhttp;
            var async = true;

            //Prepare the XMLHttpRequest Object for all browsers.
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            if (options.async !== null) {
                async = options.asyncs;
            }

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        //Everything is OK. Return the text.
                        options.success(xmlhttp);
                    } else {
                        options.error(xmlhttp);
                    }
                }
            };

            //Data can't be read as an object convert it to a http query
            var data = private.objToQuery(options.data);

            xmlhttp.open(options.method, options.url, async);
            xmlhttp.send(data);
        }
    };

    if (global.addEventListener) {
        global.addEventListener("hashchange", onHashChange, false);
    }

    else if (window.attachEvent) {
        global.attachEvent("onhashchange", onHashChange);//SEE HERE...
        //missed the on. Fixed thanks to @Robs answer.
    }

    //The events
    function onHashChange(e) {
        console.log(e);
    }

    var public = {
        currentModule: {},
        /**
         * Registers a new module to be used
         * 
         * @param {string} name
         * @param {array} dependencies
         * @param {function} func
         * @returns {_L1.public}
         */
        module: function(name, dependencies, func) {
            
            //Create a nice object of the module
            var newModule = {
                name: name,
                dependencies: dependencies,
                func: func
            };

            //Registers the module and puts it on the stack
            private.registerdModules[name] = newModule;
            private.amountOfModules++;
            
            //For future purposes
            currentModule = newModule;
            
            //Create a private scope so the module can freely do things
            var scope = {};
            func(scope);
            
            //Put the scope together with the name in the stack
            private.moduleScope[name] = scope;
            
            //For future chaining
            return this;
        },
        
        check: function(){
            console.log(private.moduleScope);
            console.log(private.registerdModules);
        }
    };

    global.phase = public;

}(this));