this["JST"] = this["JST"] || {};

this["JST"]["browser-events-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<tbody>\n  ';
 for(var index in eventList){ ;
__p += '\n  <tr>\n    <td>\n      <a id="browser-event-' +
((__t = ( index )) == null ? '' : __t) +
'" class="event" onclick="Controls.showSelectedEvent(\'' +
((__t = ( index )) == null ? '' : __t) +
'\')">' +
((__t = ( eventList[index] )) == null ? '' : __t) +
'</a>\n    </td>\n  </tr>\n  ';
 } ;
__p += '\n</tbody>';

}
return __p
};

this["JST"]["browser-files-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<tbody>\n  ';
 for(var index in fileList){ ;
__p += '\n  <tr>\n    <td>\n      <a id="browser-file-' +
((__t = ( index )) == null ? '' : __t) +
'" class="file" onclick="Controls.showSelectedFile(\'' +
((__t = ( index )) == null ? '' : __t) +
'\')">' +
((__t = ( fileList[index] )) == null ? '' : __t) +
'</a>\n    </td>\n  </tr>\n  ';
 } ;
__p += '\n</tbody>';

}
return __p
};

this["JST"]["controls"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="btn-row">\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" data-toggle="modal" data-target="#open-files" title="Open File">\n      <i class="fa fa-folder-open"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav disabled" id="prev-event-button" onclick="Controls.prevEvent()" title="Previous Event">\n      <i class="fa fa-step-backward"></i>\n    </button>\n    <button type="button" class="btn btn-nav disabled" id="next-event-button" onclick="Controls.nextEvent()" title="Next Event">\n      <i class="fa fa-step-forward"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" onclick="Controls.resetControls()" title="Return to Start View">\n      <i class="fa fa-home"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" onclick="Controls.zoom(0.5)" title="Zoom In [Shift + Up Arrow]">\n      <i class="fa fa-search-plus"></i>\n    </button>\n    <button type="button" class="btn btn-nav" onclick="Controls.zoom(-0.5)" title="Zoom Out [Shift + Down Arrow]">\n      <i class="fa fa-search-minus"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" onclick="Controls.setAngle(\'xy\')" title="XY Plane">\n      <i class="fa fa-car"></i>\n    </button>\n    <button type="button" class="btn btn-nav" onclick="Controls.setAngle(\'yz\')" title="YZ plane">\n      <i class="fa fa-bicycle"></i>\n    </button>\n    <button type="button" class="btn btn-nav" onclick="Controls.setAngle(\'xz\')" title="XZ plane">\n      <i class="fa fa-plane"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" id="perspective" class="btn btn-nav active" onclick="Controls.setPerspective()" title="Perspective Projection">\n      <i class="fa fa-cube"></i>\n    </button>\n    <button type="button" id="orthographic" class="btn btn-nav" onclick="Controls.setOrthographic()" title="Orthographic Projection">\n      <i class="fa fa-stop"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" data-toggle="modal" data-target="#settings" title="Settings">\n      <i class="fa fa-gear"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" data-toggle="modal" data-target="#about" title="About">\n      <i class="fa fa-info"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" onclick="Controls.printImage()" title="Print Image to File">\n      <i class="fa fa-file-image-o"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" id="animate" class="btn btn-nav" title="Start/Stop Animation [Shift + A]">\n      <i class="fa fa-film"></i>\n    </button>\n  </div>\n  <!--\n  <div class="btn-group" role="group">\n    <button type="button" id="record" class="btn btn-nav" onclick="ispy.toggleRecording();" title="Start/Stop Recording">\n      <i class="fa fa-video-camera"></i>\n    </button>\n  </div>\n  -->\n  <div class="btn-group" role="group">\n    <button type="button" id="stereo" class="btn btn-nav" data-toggle="modal" data-target="#stereo-modal" title="Stereo View">\n      <i class="fa fa-binoculars"></i>\n    </button>\n  </div>\n  <div class="btn-group" role="group">\n    <button type="button" class="btn btn-nav" onclick="Controls.exportModel()" title="Export 3D Model (obj format)">\n      <i class="fa fa-upload"></i>\n    </button>\n    <button type="button" class="btn btn-nav" data-toggle="modal" data-target="#import-model" title="Import 3D Model (obj format)">\n      <i class="fa fa-download"></i>\n    </button>\n  </div>\n</div>';

}
return __p
};

this["JST"]["file-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div id="files" role="dialog" class="modal">\n  <div class="modal-dialog">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Open Event</h4>\n      </div>\n      <div class="modal-body">\n        <table class="table black" width="100%" id="browser-table">\n          <tr>\n            <th class="browser-header bordered black" width="50%">Files</th>\n            <th class="browser-header bordered black">Events</th>\n          </tr>\n          <tr>\n            <td class="bordered">\n              <table class="table table-hover black" id="browser-files"></table>\n            </td>\n            <td class="bordered">\n              <table class="table table-hover black" id="browser-events"></table>\n            </td>\n          </tr>\n        </table>\n      </div>\n      <div class="modal-footer">\n        <div class="bordered" id="selected-event"> </div>\n        <div id="event-buttons">\n          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n          <button type="button" id="load-event" class="btn btn-default disabled" onclick="$(\'#files\').modal(\'hide\'); ispy.loadEvent();">Load</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["group-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>\n  <div class="div-group-name">\n    <div class="row-visibility-toggle">\n      <div><i class="fa fa-chevron-circle-down"></i></div>\n      <p >' +
((__t = ( name )) == null ? '' : __t) +
'</p>\n    </div>\n    <div class="all-visibility-toggle"><i class="fa fa-circle-o"></i></div>\n    <div class="display-info"><i class="fa fa-info"></i></div>\n  </div>\n  <ul></ul>\n</div>\n';

}
return __p
};

this["JST"]["info-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div role="dialog" class="modal exit">\n  <div class="modal-dialog">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close exit" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">' +
((__t = ( name)) == null ? '' : __t) +
'</h4>\n        <div class="modal-ingress">' +
((__t = ( description )) == null ? '' : __t) +
'</div>\n      </div>\n      <div class="modal-body">\n        <dl>\n          ';
 _.each(instances, function(instance){ ;
__p += '\n          <dt class="instance-name">' +
((__t = ( instance.name )) == null ? '' : __t) +
'</dt>\n          <dd class="instance-description"> ' +
((__t = ( instance.description )) == null ? '' : __t) +
'</dd>\n          ';
 }); ;
__p += '\n        </dl>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default exit" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["instance-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>\n  <div class="div-instance-name">\n    <div class="visibility-toggle">\n      <div class="color-toggle"><i class="fa fa-circle-thin"></i></div>\n      <p>' +
((__t = ( name )) == null ? '' : __t) +
'</p>\n    </div>\n    ';
 if(data){ ;
__p += '\n    <div class="display-data"><i class="fa fa-th-large"></i></div>\n    ';
 } ;
__p += '\n  </div>\n</div>';

}
return __p
};

this["JST"]["modals"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="open-files" role="dialog" class="modal">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Open File</h4>\n      </div>\n      <div class="modal-body">\n        <div>\n          <button id="open-web-files" type="button" class="btn btn-default" onclick="Controls.showFiles(\'web\')">Open file(s) from the Web</button>\n        </div>\n        <p>\n          Open local file(s): <input type="file" id="local-files" onchange="Controls.showFiles(\'local\')" multiple/>\n        </p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="files" role="dialog" class="modal">\n  <div class="modal-dialog">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Open Event</h4>\n      </div>\n      <div class="modal-body">\n        <table class="table black" width="100%" id="browser-table">\n          <tr>\n            <th class="browser-header bordered black" width="50%">Files</th>\n            <th class="browser-header bordered black">Events</th>\n          </tr>\n          <tr>\n            <td class="bordered">\n              <table class="table table-hover black" id="browser-files"></table>\n            </td>\n            <td class="bordered">\n              <table class="table table-hover black" id="browser-events"></table>\n            </td>\n          </tr>\n        </table>\n      </div>\n      <div class="modal-footer">\n        <div class="bordered" id="selected-event">Selected event</div>\n        <div id="event-buttons">\n          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n          <button type="button" id="load-event" class="btn btn-default disabled" onclick="Controls.loadSelectedEvent()">Load</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="settings" role="dialog" class="modal">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Settings</h4>\n      </div>\n      <div class="modal-body">\n        <p>\n          Invert colors: <input id=\'invert-colors\' type=\'checkbox\' onclick=\'Controls.invertColors(this.checked)\'>\n        </p>\n        <p>\n          Hide axes: <input id=\'show-axes\' type=\'checkbox\' onclick=\'Controls.toggleAxes(this.checked)\'>\n        </p>\n        <p>\n          Show information dialogs: <input id=\'show-info\' type=\'checkbox\' onclick=\'Controls.toggleInfoDialogs(this.checked)\'>\n        </p>\n        <p>\n          Show display statistics: <input id=\'show-stats\' type=\'checkbox\' onclick=\'Controls.toggleStats(this.checked)\'>\n        </p>\n        <p>\n          Set maximum frame rate: <span id=\'fr\'></span> fps\n          <input type=\'range\' min=\'1\' max=\'60\' value=\'30\' id=\'fps-slider\' step=\'1\' oninput="Controls.setFrameRate(value)">\n        </p>\n        <div id="renderer-info"></div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="about" role="dialog" class="modal">\n  <div class="modal-dialog">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">About</h4>\n      </div>\n      <div class="modal-body">\n        <p>\n        <h4>iSpy-WebGL <span id="version"></span></h4>\n        </p>\n        <p>\n          A browser-based event display for the <a target="_blank" href="http://cern.ch/cms">CMS experiment</a> at the LHC using WebGL.\n        </p>\n        <p>\n          <a href="mailto:ispy-developers@cern.ch">Questions/comments/problems</a></p>\n        <p>\n          <a target="_blank" href="https://github.com/cms-outreach/ispy-webgl">Code</a> and\n          <a target="_blank" href="https://github.com/cms-outreach/ispy-webgl/issues">Issues</a>\n        </p>\n        <p>Contributors: L. Barnard, M. Hategan, C. Logren, T. McCauley, P. Nguyen, M. Saunby</p>\n        <!-- Need to update\n        <p>Reference: <a target="_blank" href="http://iopscience.iop.org/1742-6596/396/2/022022/">J.Phys.Conf.Ser. 396 (2012) 022022</a></p>\n        -->\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="stereo-modal" role="dialog" class="modal">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Set to Stereo View</h4>\n      </div>\n      <div class="modal-body">\n        <p>\n          This view is specifically designed for use in a\n          <a href="https://www.google.com/get/cardboard/" target="_blank">Google Cardboard</a> viewer\n          and therefore requires a viewer and a suitable mobile phone.\n        </p>\n        <p>\n          To use with the viewer, rotate the phone to landscape, press the button below, and insert into the viewer. The view automatically\n          pans forward in the direction of view. To exit, tap the screen.\n        </p>\n        <button type="button" class="btn btn-default" data-dismiss="modal" onclick="Controls.setStereo()">Start</button>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div id="import-model" role="dialog" class="modal">\n  <div class="modal-dialog modal-sm">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">Import 3D Model</h4>\n      </div>\n      <div class="modal-body">\n        <p>\n          Select a 3D model to load.\n        </p>\n        <p>\n          Currently only .obj format is supported.\n          If an additional .mtl is available and loaded it will be used as well.\n        </p>\n        <p>\n          <i>Nota bene</i>: a large complicated 3D model may take minutes to load.\n        </p>\n        <input type="file" id="import-file" onchange="Controls.importModel(\'import-file\')" multiple/>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["object-data-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div role="dialog" class="modal exit">\n  <div class="modal-dialog">\n    <div class="modal-content bordered black">\n      <div class="modal-header">\n        <button type="button" class="close exit" data-dismiss="modal"><i class="fa fa-times"></i><span class="sr-only">Close</span></button>\n        <h4 class="modal-title black">' +
((__t = ( data.name)) == null ? '' : __t) +
'</h4>\n      </div>\n      <div class="modal-body">\n\n        <table class="table black" width="100%" id="browser-table">\n          <thead>\n            <tr>\n              <th class="browser-header bordered black" width="50%">Type</th>\n              <th class="browser-header bordered black">Value</th>\n            </tr>\n          </thead>\n          <tbody>\n            ';
 for(var i = 0; i < data.types.length; ++i){ ;
__p += '\n            <tr>\n              <td class="bordered">' +
((__t = ( data.types[i][0])) == null ? '' : __t) +
'</td>\n              <td class="bordered">' +
((__t = ( data.collection[i])) == null ? '' : __t) +
'</td>\n            </tr>\n            ';
 } ;
__p += '\n          </tbody>\n        </table>\n\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default exit" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["table-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="table-container">\n  <table id="collection-table">\n    <thead>\n      <tr>\n        ';
 var dataSort; ;
__p += '\n        ';
 _.each(data.types, function(type){ ;
__p += '\n        ';
   dataSort = type[1] === "double" ? "float" : type[1]; ;
__p += '\n          <th data-sort="' +
((__t = ( dataSort )) == null ? '' : __t) +
'">\n            <i class="i-no-sorted fa fa-sort"></i> ' +
((__t = ( type[0] )) == null ? '' : __t) +
'\n          </th>\n        ';
 }); ;
__p += '\n      </tr>\n    </thead>\n    <tbody>\n      ';
 var id, objectID; ;
__p += '\n      ';
 _.each(data.collection, function(c, index){ ;
__p += '\n      ';
   id = data.key.concat(index); ;
__p += '\n      ';
   objectID = data.objectIDs !== undefined ? data.objectIDs[index] : undefined; ;
__p += '\n        <tr id="' +
((__t = ( id )) == null ? '' : __t) +
'" data-object-id="' +
((__t = ( objectID )) == null ? '' : __t) +
'">\n          ';
 _.each(c, function(value){ ;
__p += '\n          <td>' +
((__t = ( value )) == null ? '' : __t) +
'</td>\n          ';
 }); ;
__p += '\n        </tr>\n      ';
 }); ;
__p += '\n    </tbody>\n  </table>\n</div>';

}
return __p
};

this["JST"]["tools"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
};

this["JST"]["tree-view"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="tree-container">\n  <div class="catalogue"></div>\n</div>';

}
return __p
};