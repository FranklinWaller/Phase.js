(function(global) {

    var private = {
        registerdModules: {},
        amountOfModules: 0,
        moduleScope: {},
        notReadyModules: {},
        dependencyCheck: function(module) {
            var dependencies = module.dependencies;

            //Loop through all the registered modules            
            for (var key in this.registerdModules) {

                //Check if any of the dependencies has been loaded
                if (dependencies.indexOf(this.registerdModules[key].name) > -1) {
                    //It has been loaded so delete it from the list
                    var index = dependencies.indexOf(this.registerdModules[key].name);
                    dependencies.splice(index, 1);
                }
            }           

            //Check if we still got dependency's to load
            if (typeof dependencies !== 'undefined' && dependencies.length > 0) {
                module.dependencies = dependencies;
                this.notReadyModules[module.name] = module;
            } else {
                //All the dependency's are good. The module is good to run.
                module.isReady = true;
            }
        },
        notReadyModulesCheck: function(module) {    
            
            console.log(this.notReadyModules);
            
            //if (typeof this.notReadyModules !== 'undefined' && this.notReadyModules.length > 0) { 
                //Loop through all the not ready modules
                for (var key in this.notReadyModules) {
                    //The dependency matches the new module
                    if (this.notReadyModules[key].dependencies.indexOf(module.name) > -1) {
                        
                        //Delete it from the list
                        var index = this.notReadyModules[key].dependencies.indexOf(module.name);
                        this.notReadyModules[key].dependencies.splice(index);

                        //Check if dependencies is empty
                        if (typeof this.notReadyModules[key].dependencies !== 'undefined' && this.notReadyModules[key].dependencies.length > 0) {
                            
                        }else{
                            //We got all the dependency's to run. Lets do it.
                            this.notReadyModules[key].isReady = true;
                            this.notReadyModules[key].func(public.currentScope);
                        }
                    }
                }
            //}

        },
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
        currentScope: {},
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
                func: func,
                isReady: false
            };

            if (dependencies.length !== 0) {

                private.dependencyCheck(newModule);
            } else {
                newModule.isReady = true;
            }

            //Registers the module and puts it on the stack
            private.registerdModules[name] = newModule;
            private.amountOfModules++;

            //For future purposes
            currentModule = newModule;

            //Create a private scope so the module can freely do things           
            private.notReadyModulesCheck(newModule);

            if (newModule.isReady) {
                func(this.currentScope);
            }

            //Put the scope together with the name in the stack
            private.moduleScope[name] = this.currentScope;

            //For future chaining
            return this;
        },
        check: function() {
            
        }
    };

    global.phase = public;

}(this));