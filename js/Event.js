

(function() {

  var scene, currentEvent, currentCollections, data,
    descr, visible, styleData, colorData, r, g, b, alpha, RGBAColor;
  var objectIDs = [];

  ispy.Event = function(_event, _scene){
    scene = _scene;
    addEvent(_event);

    // Avoid multiple listeners for same event:
    $(ispy).off('change-table-displaying clicked-intersected');
    $(ispy).on({
      'change-table-displaying': toggleTableView,
      'clicked-intersected': collectData
    });

    return this;
  };

  ispy.Event.prototype = {
    constructor: ispy.Event,

    addObject: function(key, range){
      setCurrentVariables(key);
      return addObject(key, range);
    },

    removeObject: function(key){
      scene.remove(key);
    }
  };


  var addEvent = function(event) {
    // remove all but the geometry from the
    // scene before rendering
    var eventDescriptions = ispy.event_description;
    for(var key in eventDescriptions) {
      scene.remove(key);
    }

    TreeView.resetInstances([ispy.groups.Detector.name, ispy.groups.Imported.name]);

    // Clear the object_ids:
    for ( var key in objectIDs){
      objectIDs[key].length = 0;
    }

    currentEvent = event;

    // TODO:
    // remove selectors for last event
    // $("tr.Event").remove();

    var currentGroups = [];
    currentCollections = event.Collections;
    for(var key in eventDescriptions){
      data = currentCollections[key];
      if(!isAvailableData(data)){
        continue;
      }

      descr = eventDescriptions[key];

      visible = ! ispy.disabled[key] ? descr.on = true : descr.on = false;

      // Add a parent object for each group
      var group = descr.group;
      if(!_.contains(currentGroups, group)){
        currentGroups.push(group);
        var obj_group = new THREE.Object3D();
        // FIXME:
        obj_group.name = group.name;
        scene.add(obj_group);
      }

      var object = null;
      if(descr.type === ispy.TEXT){
        RGBAColor = 'rgba(200,200,200,1)';
        Plotter[descr.fn](data);
        object = true;
      } else {

        styleData = descr.style;
        colorData = styleData.color;
        r = colorData[0];
        g = colorData[1];
        b = colorData[2];
        alpha = styleData.opacity || 1;

        RGBAColor = 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',' + alpha + ')';

        object = addObject(key);
      }

      if(object){
        // FIXME:
        TreeView.addInstance(key, descr.name, "fixme", visible, RGBAColor, group.name, true);
      }

    }
    var currentTable = TableView.currentTable();
    if(currentTable && isAvailableData(currentCollections[currentTable])){
      toggleTableView(null, currentTable, true);
    }
  };

  var isAvailableData = function(data_){
    return !( ! data_ || data_.length === 0 );
  };


  var addObject = function(key, range){

    // To enable calling the function with only one parameter:
    range = typeof range !== 'undefined' ? range : {};

    switch(descr.type){
      case ispy.BOX:
        return addBox(key);
      case ispy.SOLIDBOX:
        return addSolidBox(key);
      case ispy.SCALEDSOLIDBOX:
        return addScaleSolidBox(key, range);
      case ispy.TRACK:
      case ispy.POLYLINE:
        return addTrack(key, range);
      case ispy.POINT:
        return addPoint(key);
      case ispy.SHAPE:
        return addShape(key, range);
      case ispy.LINE:
        return addLine(key, range);
    }
  };

  var addBox = function(key){

    var material = new THREE.LineBasicMaterial({
      color: new THREE.Color(r, g, b),
      transparent: alpha < 1.0,
      linewidth: styleData.linewidth,
      opacity: styleData.opacity
    });

    var geometry = new THREE.Geometry();

    var func = Plotter[descr.fn];
    for ( var i = 0; i < data.length; i++ ) {
      var box = func(data[i]);
      geometry.merge(box);
    }

    var line = new THREE.Line(geometry, material, THREE.LinePieces);
    line.name = key;
    line.visible = visible;
    return scene.addToGroup(descr.group.name, line);
  };

  var addSolidBox = function(key){

    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(r, g, b),
      transparent: alpha < 1.0,
      linewidth: styleData.linewidth,
      opacity: styleData.opacity
    });
    material.side = THREE.DoubleSide;

    var boxes = new THREE.Geometry();

    var func = Plotter[descr.fn];
    for ( var i = 0; i < data.length; i++ ) {
      var box = func(data[i]);
      boxes.merge(box);
    }

    var meshes = new THREE.Mesh(boxes, material);
    meshes.name = key;
    meshes.visible = visible;

    return scene.addToGroup(descr.group.name, meshes);
  };

  var addScaleSolidBox = function(key, range){

    if(!range.min && !range.max){
      range.selector = 0;
      range.min = 0.5;
      range.max = undefined;
    }

    var material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(r, g, b),
      transparent: alpha < 1.0,
      opacity: styleData.opacity
    });
    material.side = THREE.DoubleSide;

    var boxes = new THREE.Geometry();

    var func = Plotter[descr.fn];
    for ( var i = 0; i < data.length; i++ ) {
      func(data[i], boxes, descr.scale, range);
    }

    var meshes = new THREE.Mesh(boxes, material);
    meshes.name = key;
    meshes.visible = visible;

    return scene.addToGroup(descr.group.name, meshes);
  };

  var addTrack = function(key, range){

    if(!range.min && !range.max){
      range.selector = 0;
      range.min = undefined;
      range.max = undefined;
    }

    var objIDs = [];
    var extra = currentCollections[descr.extra];
    var assoc = currentEvent.Associations[descr.assoc];
    var tracks = Plotter[descr.fn](data, extra, assoc, styleData, range);
    var returnValue = null;
    tracks.forEach(function(t, i) {
      if(t !== undefined) {
        t.name = key;
        t.visible = visible;
        // originalIndex works as a link between the original
        // data and THREE objects:
        t.userData.originalIndex = i;

        objIDs.push(t.id);
        returnValue = scene.addToGroup(descr.group.name, t);
      } else {
        objIDs.push(undefined);
      }
    });
    if(descr.group === ispy.groups.Physics){
      objectIDs[key] = objIDs;
    }
    return returnValue;
  };

  var addPoint = function(key){

    var material = new THREE.PointCloudMaterial({
      color: new THREE.Color(r, g, b),
      size: styleData.size
    });
    var geometry = Plotter[descr.fn](data);
    var points = new THREE.PointCloud(geometry, material);

    points.name = key;
    points.visible = visible;
    return scene.addToGroup(descr.group.name, points);
  };

  var addShape = function(key, range){

    if(!range.min && !range.max){
      range.selector = 0;
      range.min = key === "METs_V1" ? 1.0 : 5.0;
      range.max = undefined;
    }
    var objIDs = [];
    var func = Plotter[descr.fn];
    var returnValue = null;
    for ( var i = 0; i < data.length; i++ ) {
      var shape = func(data[i], styleData, range);
      if ( shape !== null ) {
        shape.name = key;
        shape.visible = visible;
        // originalIndex works as a link between the original
        // data and THREE objects:
        shape.userData.originalIndex = i;
        objIDs.push(shape.id);
        returnValue = scene.addToGroup(descr.group.name, shape);
      } else {
        objIDs.push(undefined);
      }
    }
    if(descr.group === ispy.groups.Physics){
      objectIDs[key] = objIDs;
    }
    return returnValue;
  };

  var addLine = function(key, range){

    if(!range.min && !range.max){
      range.selector = 0;
      range.min = undefined;
      range.max = undefined;
    }

    var objIDs = [];

    var func = Plotter[descr.fn];
    var returnValue = null;
    for ( var i = 0; i < data.length; i++ ) {
      var lines = func(data[i], range);
      if(lines) {
        lines.forEach(function (l) {
          var line = new THREE.Line(l, new THREE.LineBasicMaterial({
            color: new THREE.Color(r, g, b),
            transparent: alpha < 1.0,
            linewidth: styleData.linewidth,
            opacity: styleData.opacity
          }));
          line.name = key;
          line.visible = visible;
          // originalIndex works as a link between the original
          // data and THREE objects:
          line.userData.originalIndex = i;
          objIDs.push(line.id);
          returnValue = scene.addToGroup(descr.group.name, line);
        });
      } else {
        objIDs.push(undefined);
      }

    }
    if(descr.group === ispy.groups.Physics){
      objectIDs[key] = objIDs;
    }
    return returnValue;
  };

  var setCurrentVariables = function(key){
    data = currentCollections[key];
    descr = ispy.event_description[key];
    styleData = descr.style;
    colorData = styleData.color;
    r = colorData[0];
    g = colorData[1];
    b = colorData[2];
    alpha = styleData.opacity;
    visible = ! ispy.disabled[key] ? descr.on = true : descr.on = false;
  };

  var toggleTableView = function(event, key, displaying){
    var tableData = {
      data: {
        key: key,
        objectIDs: objectIDs[key],
        types: currentEvent.Types[key],
        collection: currentCollections[key]
      }
    };
    if(displaying){
      TableView.create(tableData);
    } else {
      TableView.remove();
    }
  };

  var collectData = function(event, key, objectUserData) {

    var data = {
      name: ispy.event_description[key].name,
      types: currentEvent.Types[key],
      collection: currentCollections[key][objectUserData.originalIndex]
    };

    $(ispy).trigger('data-collected', data);

  };

  return ispy;

})();