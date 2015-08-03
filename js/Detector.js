

(function(){

  var scene;

  ispy.Detector = function(_scene){

    scene = _scene;
    initDetector();
    importBeampipe();

    return this;
  };

  ispy.Detector.prototype = {
    constructor: ispy.Detector
  };

  var initDetector = function() {
    // Loading and rendering the actual geometry when WebGL is available
    // works well. With CanvasRenderer, not so well, so load and render
    // the geometry models.
    if(scene.hasWebGL){

      // TODO: $('#loading').modal('show');

      $.when(
        getScript("./geometry/eb.js"),
        getScript("./geometry/ee.js"),
        getScript("./geometry/hb.js"),
        getScript("./geometry/ho.js"),
        getScript("./geometry/hehf.js"),
        getScript("./geometry/pixel.js"),
        getScript("./geometry/tib.js"),
        getScript("./geometry/tob.js"),
        getScript("./geometry/tec.js"),
        getScript("./geometry/tid.js")
      ).done(function() {
          addDetector();
          // TODO: $('#loading').modal('hide');
        });
    } else {
      getScript("./geometry/models.js")
        .done(function() {
          addDetector();
        });
    }
  };

  var getScript = function(scr) {
    return $.ajax({url: scr, dataType: "script", cache: true});
  };

  var addDetector = function() {

    // Add a parent object
    var detector = ispy.groups.Detector.name;
    var obj_group = new THREE.Object3D();
    obj_group.name = detector;
    scene.add(obj_group);
    scene.addLight(detector);

    var styleData, colorData, r, g, b, alpha;

    for ( var key in ispy.detector_description ) {

      var data = ispy.detector.Collections[key];
      if ( ! data || data.length === 0 ) {
        continue;
      }

      var descr = ispy.detector_description[key];

      // If something is already disabled via the toggle then this
      // should override what comes from the description
      var visible = ! ispy.disabled[key] ? descr.on = true : descr.on = false;


      styleData = descr.style;
      colorData = styleData.color;
      r = colorData[0];
      g = colorData[1];
      b = colorData[2];
      alpha = styleData.opacity;

      var RGBAColor = 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',' + alpha + ')';

      // FIXME
      TreeView.addInstance(key, descr.name, "", visible, RGBAColor, ispy.groups.Detector.name);

      var transp = alpha < 1.0;

      var materialData = {
        color: new THREE.Color(r, g, b),
        transparent: transp,
        linewidth: styleData.linewidth,
        opacity: styleData.opacity
      };

      var material, box, line;

      switch(descr.type) {

        case ispy.BOX:

          material = new THREE.LineBasicMaterial(materialData);

          var geometry = new THREE.Geometry();

          var func = Plotter[descr.fn];
          for ( var i = 0; i < data.length; i++ ) {
            box = func(data[i]);
            geometry.merge(box);
          }

          line = new THREE.Line(geometry, material, THREE.LinePieces);
          line.name = key;
          line.visible = visible;
          scene.addToGroup(descr.group.name, line);

          break;

        case ispy.SOLIDBOX:

          material = new THREE.MeshBasicMaterial(materialData);
          material.side = THREE.DoubleSide;

          var boxes = new THREE.Geometry();

          var func = Plotter[descr.fn];
          for ( var i = 0; i < data.length; i++ ) {
            box = func(data[i]);
            boxes.merge(box);
          }

          var meshes = new THREE.Mesh(boxes, material);
          meshes.name = key;
          meshes.visible = visible;

          scene.addToGroup(descr.group.name, meshes);

          break;

        case ispy.MODEL:

          material = new THREE.LineBasicMaterial(materialData);

          var func = Plotter[descr.fn];
          for ( var i = 0; i < data.length; i++ ) {
            var models = func(data[i]);

            for ( var j = 0; j < models.length; j++ ) {
              var shape = Plotter.makeShapes(models[j]);
              line = new THREE.Line(shape, material, THREE.LinePieces);
              line.name = key;
              line.visible = visible;
              scene.addToGroup(descr.group.name, line);
            }
          }

          break;
      }
    }
  };

  // This would be more logically in Loader, but then again not.....
  var importBeampipe = function() {
    // Add a parent object
    var imported = ispy.groups.Imported.name;
    var obj_group = new THREE.Object3D();
    obj_group.name = imported;
    scene.add(obj_group);

    var loader = new THREE.OBJMTLLoader();
    var beamPipeName = 'Beam Pipe';
    loader.load('./geometry/beampipe.obj', './geometry/beampipe.mtl', function(object){
      object.name = beamPipeName;
      object.visible = true;
      ispy.disabled[object.name] = false;

      scene.addToGroup(imported, object);
      TreeView.addInstance(beamPipeName, beamPipeName, "", true, 'rgba(150,150,150,1)', ispy.groups.Imported.name);
    });
  };

  return ispy;
})();