ispy-webgl
==========

This is a browser-based event display for the <a href="http://cern.ch/cms" target="_blank">CMS experiment</a> at the LHC that uses
three.js, bootstrap.js, and jQuery.

Beta version is here:

<a target="_blank" href="http://cern.ch/ispy-webgl">http://cern.ch/ispy-webgl</a>

For more information on the input data format:

http://cms-outreach.github.io/ispy

Contributors: Luke Barnard, Mihael Hategan, Carita Logrén, Thomas McCauley, Phong Nguyen, Michael Saunby

(Older) Reference: J.Phys.Conf.Ser. 396 (2012) 022022 http://iopscience.iop.org/1742-6596/396/2/022022

Documentation
-------------

These are "guidelines" for developers, please follow this. The application is structured in modules,
 and apart from obvious reasons modularity is essential to be able to maintain two versions (ispy-webgl, ispy-edu) of it.

> **Note!** All HTML and CSS should be kept fully compatible with bootstrap!

### js/

Contains all JavaScript modules related to the application. All modules should have a clear, 
preferably consistent API, and they should not leak variables to global scope. Modules
should not be unnecessarily aware of the surrounding world, and they should be as much self-maintaining
as possible.

JavaScript modules are written in closure style. Exceptions to this are object-like modules (Scene.js, 
Detector.js, Event.js), which are written in class style. 

In the following there are the JavaScript files in the same order as they appear in index.html.
Module can use some other module's API functions, if it is "below" the firs module. Otherwise use event triggering. 

##### ispy-config.js

Initialization of ispy variables. ispy variables should not be defined anywhere else! 

##### Loader.js

For loading external data

##### TreeView.js

For creating and using tree-view. Uses Backbone, and is mainly self-maintaining. 

##### TableView.js

For creating and using table-view. Uses Backbone, but lacks models and collections,
and requires external data-input.

##### Plotter.js

For plotting THREE objects out of geometry and event data. All instances in ispy.event_description
and ispy.detector_description should have a function ('fn') for plotting in Plotter.js.

##### Scene.js

For maintaining and using THREE scene. Other modules should be able to touch the scene only
 via this module's API. 

##### Detector.js

ATM only for creating Detector to the scene.

##### Event.js

For adding and managing events and event data. 

##### Controls.js

All UI events are circulated through this module. This should be the only module (apart from TreeView.js
 and TableView.js) that has a proper access to the HTML (i.o.w. no other module should be able to make
 changes to the HTML; only find some _very_ consistent elements, and only, if it is _absolutely_ necessary).  

##### app.js

For nudging the application to life!

### css/

Contains stylesheets for application. lib/ folder contains fonts, and in ispy-webgl also Bootstrap.

### views/

Contains an independent Underscore template for all template-requiring views. Contains also views 
for controls and all modals. Templates are pre-compiled with Grunt into template.js, which in turn is included
as a script file in index.html. Templating is implemented on client side to reduce the traffic on server side. 

Templates work with following (configured in Gruntfile.js in project directory):
- escape: {{- }} 
- evaluate: {{  }} **Note!** Wrap every line of code between these! Newlines are not allowed.
- interpolate: {{= }}

### node_modules/

Templates need to be pre-compiled with Grunt. Directory contains required grunt modules for Grunt to work. Grunt is
configured in Gruntfile in project directory. 

> **Note!** [Grunt](http://gruntjs.com) itself needs to be installed separately!

### geometry/

Contains the geometry data for drawing the detector.

### data/

Contains zipped event data that user can select to be displayed. 