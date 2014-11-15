Phase.js
========

**Disclaimer: Phase.js is not a production ready framework. It's still a work in progress**

Phase.js is a framework for building JavaScript applications. It works in modules
that registers itself with the dependency. If the dependency's of your module isn't
loaded yet it will put it on a stack and wait till all the modules that it need is 
loaded, and than it will execute.

Here is an example:

```javascript
phase.module('bar', ['foo'], function(scope){
    alert('i am ready');
});

phase.module('foo', [], function(scope){
    scope.doAwesomeStuff = function(){
        //Do awesome stuff here
    } 
});

```

This will display 'i am ready' despite the order of the code. If you delete the 
foo module then bar will not run.

Routing
----
It is very easy to write a route with Phase.js. Phase.js takes care of attaching controllers and loading the templates.

Here is how you write a simple route:

```javascript
phase.routes({
    "home": {
        url: 'views/home.html',
        controller: 'HomeController'
    }
});

```

This will route all the routes going to #/home and load the views/home.html view.
As you may noticed we didn't define a HomeController. We can do this by using phase.controller();

Here is how to setup a controller:

```javascript
phase.controller('HomeController', function(){
    //Your awesome code here
});
```

The routing system will hit that controller when the route matches.
Finnaly we have to run the application you can simply do that by using phase.run(domObject);
The domObject is the content you want to be dynamicly changed

```javascript
phase.run(document.getElementById('content'));
```

Well that's all the basics!
If you want to join the project feel free to fork and edit it!
