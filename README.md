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

If you want to join the project feel free to fork and edit it!
