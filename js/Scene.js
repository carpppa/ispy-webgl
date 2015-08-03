

(function(){

  var display, inset,
    windowWidth, windowHeight,
    scene, camera, inset_scene, inset_camera,
    controls, do_controls, mouse, highlighted,
    raycaster, intersectable, intersects, intersected,
    renderer, inset_renderer, stereo_renderer, renderer_name,
    frameRate, stats, velocity, acceleration,
    get_image_data, image_data, animating, stereo;

  var hasWebGL = function() {
    var canvas = document.createElement('canvas');
    if ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) {
      if ( ! window.WebGLRenderingContext ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  var initLight = function(object) {
    var intensity = 1.0;
    var length = 15.0;

    var light1 = new THREE.DirectionalLight(0xffffff, intensity);
    light1.position.set(-length, length, length);
    scene.getObjectByName(object).add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, intensity);
    light2.position.set(length, -length, -length);
    scene.getObjectByName(object).add(light2);
  };

  var setFrameRate = function(fr) {
    frameRate = fr;
    $('#fr').html(fr);
  };

  var toPerspective = function(){
    camera.toPerspective();
  };

  ispy.Scene = function(){
    init();
    run();
    return this;
  };

  ispy.Scene.prototype = {
    constructor: ispy.Scene,

    hasWebGL: hasWebGL,

    addLight: initLight,

    setFrameRate: setFrameRate,

    add: function(object){
      scene.add(object);
      return object;
    },

    addToGroup: function(group, object){
      scene.getObjectByName(group).add(object);
      return object;
    },

    remove: function(objectName){
      var parent, child;
      for(child = scene.getObjectByName(objectName); child; child = scene.getObjectByName(objectName)){
        parent = child.parent;
        parent.remove(child);
      }
    },

    resetControls: function() {
      controls.reset();
      camera.setZoom(1);
    },

    setXY: function() {
      var length = camera.position.length();
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = length;
      camera.up = new THREE.Vector3(0,1,0);
      lookAtOrigin();
    },

    setXZ: function() {
      var length = camera.position.length();
      camera.position.x = 0;
      camera.position.y = length;
      camera.position.z = 0;
      camera.up = new THREE.Vector3(1,0,0);
      lookAtOrigin();
    },

    setYZ: function() {
      var length = camera.position.length();
      camera.position.x = -length;
      camera.position.y = 0;
      camera.position.z = 0;
      camera.up = new THREE.Vector3(0,1,0);
      lookAtOrigin();
    },

    setOrthographic: function() {
      camera.toOrthographic();
    },

    setPerspective: function() {
      toPerspective();
    },

    setStereo: function() {
      toStereo();
    },

    zoom: function(step) {
      camera.setZoom(camera.zoom + step);
    },

    printImage: function() {
      get_image_data = true;
      render();
      window.open(image_data, "toDataURL() image", "width=800, height=400");
    },

    exportString: function(output, filename) {
      // This comes from three.js editor
      var blob = new Blob([output], {type: 'text/plain'});
      var objectURL = URL.createObjectURL(blob);

      // Use this to output to file:
      var link = document.createElement('a');
      link.href = objectURL;
      link.download = filename || 'data.txt';
      link.target = '_blank';
      link.click();

      // Use this to output to tab:
      //window.open(objectURL, '_blank');
      //window.focus();
    },

    exportScene: function() {
      // The scene is actually made up of several objects,
      // one each for major category: e.g. Detector, ECAL, Physics, etc.
      // This exports a json file for each whether visible or not.
      _.each(scene.children, function(c) {
        var output = c.toJSON();
        output = JSON.stringify( output, null, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
        this.exportString(output, c.name + '.json');
      });
    },

    exportModel: function() {
      var exporter = new THREE.OBJExporter();
      _.each(scene.children, function(c) {
        this.exportString(exporter.parse(c), c.name + '.obj');
      })
    }
  };

  var init = function() {
    display = $('#canvas');
    inset = $('#axes');

    scene = new THREE.Scene();
    inset_scene = new THREE.Scene();

    windowWidth = display.innerWidth();
    windowHeight = display.innerHeight();

    initCamera();

    velocity = new THREE.Vector3(0, 0, 0);
    acceleration = new THREE.Vector3(0, 0, 0);

    initRenderer();

    display.append(renderer.domElement);
    inset.append(inset_renderer.domElement);

    initStats();

    // TODO:
    /*
     ispy.inverted_colors = false;
     $('#invert-colors').prop('checked', false);
     */

    createAxes();

    // The second argument is necessary to make sure that mouse events are
    // handled only when in the canvas
    controls = new THREE.TrackballControls(camera, renderer.domElement);

    // Add a parent object for each group

    // TODO: $('#version').html("v"+ispy.version);

    initEventListeners();

    /*
     https://github.com/mrdoob/three.js/pull/421#issuecomment-1792008
     via
     http://stackoverflow.com/questions/15558418/how-do-you-save-an-image-from-a-three-js-canvas
     */
    get_image_data = false;
    image_data = null;

    initRaycaster();

    // Are we running an animation?
    animating = false;

    setFrameRate(30);
    $('#fps-slider').prop('value', frameRate); // for FF

    // TODO:
    /*
     // Info dialogs are hidden by default (see ispy.css)
     // FF keeps state on reload so force here
     $('#show-info').prop('checked', false);

     $('#show-info').change(function() {
     if ( this.checked ) { // if checked then already visible, so turn off
     $('.info').css('visibility', 'visible');
     } else {
     $('.info').css('visibility', 'hidden');
     }
     });
     */

    stereo = false;
  };


  var initCamera = function() {
    // width, height, fov, near, far, orthoNear, orthoFar
    camera = new THREE.CombinedCamera(windowWidth, windowHeight, 70, 0.1, 100, 0.1, 100);
    resetCamera();
    // fov, aspect, near, far
    inset_camera = new THREE.PerspectiveCamera(70, 1, 1, 100);
  };

  var resetCamera = function(){
    var home_x = -18.1;
    var home_y = 8.6;
    var home_z = 14.0;

    camera.position.x = home_x*0.6;
    camera.position.y = home_y*0.6;
    camera.position.z = home_z*0.6;

    camera.setZoom(1);
    camera.up = new THREE.Vector3(0,1,0);
    lookAtOrigin();
  };

  var lookAtOrigin = function() {
    camera.lookAt(new THREE.Vector3(0,0,0));
  };

  var initRenderer = function(){
    if(hasWebGL()){
      console.log('ispy: using webgl');

      renderer = new THREE.WebGLRenderer({antialias:true});
      inset_renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});

      renderer_name = "WebGLRenderer";

    } else {
      console.log('ispy: using canvas');

      renderer = new THREE.CanvasRenderer();
      inset_renderer = new THREE.CanvasRenderer();

      renderer_name = "CanvasRenderer";
    }

    renderer.setSize(windowWidth, windowHeight);
    var insetSideLength = windowHeight / 5;
    inset_renderer.setSize(insetSideLength, insetSideLength);

    inset_renderer.alpha = 0.0;
  };

  var initStats = function(){
    stats = new Stats();
    display.append(stats.domElement);

    // FIXME: for some reason stats never show over 30 fps even though frame rate is higher

    // On page load hide the stats
    $('#stats').hide();
    // FF keeps the check state on reload so force an "uncheck"
    // TODO: $('#show-stats').prop('checked', false);

  };

  var createAxes = function(){
    var origin = new THREE.Vector3(0,0,0);
    var rx = new THREE.ArrowHelper(new THREE.Vector3(4,0,0), origin, 4, 0xff0000, 0.01, 0.01);
    var gy = new THREE.ArrowHelper(new THREE.Vector3(0,4,0), origin, 4, 0x00ff00, 0.01, 0.01);
    var bz = new THREE.ArrowHelper(new THREE.Vector3(0,0,4), origin, 4, 0x0000ff, 0.01, 0.01);

    rx.line.material.linewidth = 5;
    gy.line.material.linewidth = 5;
    bz.line.material.linewidth = 5;

    inset_scene.add(rx);
    inset_scene.add(gy);
    inset_scene.add(bz);

    // TODO:
    /*
     $('#show-axes').prop('checked', false); // FF keeps the state after a page refresh. Therefore force uncheck.
     $('#show-axes').change(function() {
     if ( this.checked ) { // if checked then hide axes
     $('#axes').hide();
     } else {
     $('#axes').show();
     }
     });
     */

    var x_geo = new THREE.TextGeometry('X', {size:0.75, height:0.1});
    var x_color = new THREE.Color(0xff0000);
    var x_material = new THREE.MeshBasicMaterial({ color: x_color});
    var x_text = new THREE.Mesh(x_geo, x_material);
    x_text.position.x = 4.5;

    var y_geo = new THREE.TextGeometry('Y', {size:0.75, height:0.1});
    var y_color = new THREE.Color(0x00ff00);
    var y_material = new THREE.MeshBasicMaterial({ color: y_color});
    var y_text = new THREE.Mesh(y_geo, y_material);
    y_text.position.y = 4.5;

    var z_geo = new THREE.TextGeometry('Z', {size:0.75, height:0.1});
    var z_color = new THREE.Color(0x0000ff);
    var z_material = new THREE.MeshBasicMaterial({ color: z_color});
    var z_text = new THREE.Mesh(z_geo, z_material);
    z_text.position.z = 4.5;

    inset_scene.add(x_text);
    inset_scene.add(y_text);
    inset_scene.add(z_text);
  };

  var initRaycaster = function(){

    raycaster = new THREE.Raycaster();
    raycaster.linePrecision = 0.1; // Previously 0.01, but choosing the object was difficult

    mouse = new THREE.Vector2();
    intersectable = ispy.groups.Physics.name;

  };

  var run = function() {
    setTimeout( function() {
      requestAnimationFrame(run);
    }, 1000 / frameRate );

    stats.update();

    if (stereo) {
      do_controls.update();
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;

      camera.aspect = windowWidth / windowHeight;
      camera.updateProjectionMatrix();
      stereo_renderer.setSize(windowWidth, windowHeight);
    } else {
      controls.update();
      inset_camera.position.subVectors(camera.position, controls.target);
    }

    inset_camera.up = camera.up;
    inset_camera.quarternion = camera.quaternion;
    inset_camera.position.setLength(10);
    inset_camera.lookAt(inset_scene.position);

    render();

    if (animating) {
      TWEEN.update();
    }
  };

  var render = function() {
    if ( renderer !== null ) {
      if(stereo){
        stereo_renderer.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }

      if ( get_image_data ){
        image_data = renderer.domElement.toDataURL();
        get_image_data = false;
      }
    }

    if(inset_renderer !== null){
      inset_renderer.render(inset_scene, inset_camera);
    }
  };

  var toStereo = function(){
    if (!stereo) {
      stereo = true;

      stereo_renderer = new THREE.StereoEffect(renderer);
      do_controls = new THREE.DeviceOrientationControls(camera, true);

      inset.hide();
      $('#event-info').hide();

      display.on('click', toStereo);

      do_controls.autoForward = true;
      do_controls.connect();
      do_controls.update();

      camera.position.x = 2;
      camera.position.y = 2;
      camera.position.z = -10;
      lookAtOrigin();

      onWindowResize();
    } else {
      stereo = false;
      stereo_renderer = null;
      do_controls = null;

      inset.show();
      $('#event-info').show();

      display.off('click', toStereo);

      toPerspective();
      resetCamera();
      onWindowResize();
    }
  };

  // EVENT LISTENERS:

  // FIXME
  var initEventListeners = function(){
    $(window).on('resize', onWindowResize);
    $(ispy).on({
      'change-visibility': toggle,
      'collection-table-hovering': toggleObjectHighlight
    });
    window.addEventListener('deviceorientation', setOrientationControls, true);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  };

  var onWindowResize = function() {

    if (stereo) {
      var d = display.css({
        'width' : window.innerWidth + 'px',
        'height' : window.innerHeight + 'px',
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'z-index': 1000
      })[0];
      d.height = window.innerHeight;
      d.width = window.innerWidth;
    } else {
      display.removeAttr('style')
    }

    windowWidth = display.innerWidth();
    windowHeight = display.innerHeight();

    camera.aspect	= windowWidth / windowHeight;

    // FIXME: projectionMatrix not updating!!

    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth,windowHeight);
    render();
  };

  var toggle = function(event, group, key, state){
    ispy.disabled[key] = !state;

    // TODO:
    /*
    // For provenance (for now, just event information)
    // we display as simple HTML so therefore not part of the scene
    if ( group === 'Provenance' ) {
      if ( ispy.disabled[key] ) {
        $('#event-info').hide();
      } else {
        $('#event-info').show();
      }
    }
    */

    scene.getObjectByName(group).children.forEach(function(c) {
      if ( c.name === key ) {
        c.visible = state;
      }
    });
  };

  var setOrientationControls = function(e) {
    if ( !e.alpha ) {
      return;
    }
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  };

  var onMouseMove = function(e) {
    e.preventDefault();

    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    var offsetX = display.offset().left - left;
    var offsetY = display.offset().top - top;

    mouse.x = ((e.clientX - offsetX) / windowWidth) * 2 - 1;
    mouse.y = -((e.clientY - offsetY) / windowHeight) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    raycaster.set(camera.position, vector.subVectors(vector, camera.position).normalize());

    var intersectableObject = scene.getObjectByName(intersectable);
    if(!intersectableObject){
      return;
    }
    intersects = raycaster.intersectObject(intersectableObject, true);

    // Make sure invisible objects in front won't interfere:
    var i = 0; while(i < intersects.length && !intersects[i].object.visible) ++i;

    if ( intersects[i] ) {
      if ( intersected != intersects[i].object) {
        if ( intersected ) {
          intersected.material.color.setHex(intersected.current_color);
          TableView.highlightRow(intersected.name, intersected.userData.originalIndex, 'off');
        }
        display.css('cursor','pointer');
        intersected = intersects[i].object;
        TableView.highlightRow(intersected.name, intersected.userData.originalIndex, 'on');
        intersected.current_color = intersected.material.color.getHex();
        intersected.material.color.setHex(0xcccccc);
      }
    } else {
      if ( intersected ){
        display.css('cursor','auto');
        TableView.highlightRow(intersected.name, intersected.userData.originalIndex, 'off');
        intersected.material.color.setHex(intersected.current_color);
        intersected = null;
      }
    }
  };

  var onMouseDown = function(e) {
    if(intersected){
      $(ispy).trigger('clicked-intersected', [intersected.name, intersected.userData]);
    }
  };

  var toggleObjectHighlight = function(event, doEffect, objectID){

    if(doEffect){
      var selected = scene.getObjectById(Number(objectID), true);

      if(selected){
        if(highlighted != selected && selected.visible){
          if(highlighted){
            highlighted.material.color.setHex(highlighted.current_color);
          }
          highlighted = selected;
          highlighted.current_color = highlighted.material.color.getHex();
          highlighted.material.color.setHex(0xcccccc);
        }
      }
    } else {
      if(highlighted){
        highlighted.material.color.setHex(highlighted.current_color);
        highlighted = null;
      }
    }
  };

  // RETURN

  return ispy;
  // Broadcasted: 'clicked-intersected': param: key, userData

})();