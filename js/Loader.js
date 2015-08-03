
var Loader = (function(){

  var ig_data;

  var selectWebFile = function(fileList, index) {

    // TODO?
    // ispy.file_name = filename.split("/")[2];  // of course this isn't a general case for files

    var xhr = new XMLHttpRequest();
    var eventNamesList = undefined;

    xhr.open("GET", fileList[index], false);
    xhr.overrideMimeType("text/plain; charset=x-user-defined");

    // TODO?
    // var ecell = document.getElementById("browser-events").insertRow(0).insertCell(0);
    // ecell.innerHTML = 'Loading events...';

    xhr.onprogress = function (evt) {
      if (evt.lengthComputable) {
        // TODO:
        /*
        var progressBar = $('.progress-bar');
        var percentComplete = Math.round((evt.loaded / evt.total) * 100);
        progressBar.attr('style', 'width:' + percentComplete + '%;');
        progressBar.html(percentComplete + '%');
        */
      }
    };

    xhr.onreadystatechange = function () {
      // TODO:

      if (this.readyState === 4){
        /*
        $('#progress').modal('hide');
        $('.progress-bar').attr('style', 'width:0%;');
        $('.progress-bar').html('0%');
         */
      }

    };

    xhr.onload = function() {
      if (this.status === 200 || xhr.readyState === 4) {

        var zip = JSZip(xhr.responseText);

        eventNamesList = [];
        $.each(zip.files, function(index, zipEntry){
          if ( zipEntry._data !== null && zipEntry.name !== "Header" ) {
            eventNamesList.push(zipEntry.name);
          }
        });

        // TODO?
        // ispy.event_index = 0;
        ig_data = zip;
      }
    };

    xhr.send();
    return eventNamesList;
  };

  var selectLocalFile = function(fileList, index) {
    var reader = new FileReader();

    // TODO? ispy.file_name = ispy.local_files[index].name;

    var eventNamesList = undefined;

    reader.onload = function(e) {
      var data = e.target.result;
      var zip = new JSZip(data);

      eventNamesList = [];
      $.each(zip.files, function(index, zipEntry){
        if ( zipEntry._data !== null && zipEntry.name !== "Header" ) {
          eventNamesList.push(zipEntry.name);
        }
      });

      // TODO? ispy.event_index = 0;
      ig_data = zip;
    };

    reader.onerror = function(e) {
      alert(e);
    };

    reader.readAsArrayBuffer(fileList[index]);
    return eventNamesList;
  };

  var loadEvent = function(eventNamesList, index){
    var event = undefined;
    try {
      event = JSON.parse(cleanupData(ig_data.file(eventNamesList[index]).asText()));
    } catch(err) {
      alert(err);
    }

    return event;
  };

  var cleanupData = function(d) {
    // rm non-standard json bits
    // newer files will not have this problem
    d = d.replace(/\(/g,'[')
      .replace(/\)/g,']')
      .replace(/\'/g, "\"")
      .replace(/nan/g, "0");
    return d;
  };

  var importModel = function(inputId) {
    var files = document.getElementById(inputId).files;
    var extension, file_name;

    if ( files.length === 1 ) { // If one file we assume it's an obj file and load it
      file_name = files[0].name;
      extension = file_name.split('.').pop().toLowerCase();
      if ( extension !== 'obj' ) {
        alert('The file you attempted to load: "' + file_name + '" does not appear (at least from the extension) to be an .obj file!');
        return undefined;
      }

      return readOBJ(files[0], loadOBJ);

    } else if ( files.length === 2 ) { // We support for now either one obj file or an obj file and an mtl file
      var obj_file, mtl_file;

      var ext1 = files[0].name.split('.').pop().toLowerCase();
      var ext2 = files[1].name.split('.').pop().toLowerCase();

      if ( ext1 === 'obj' && ext2 === 'mtl' ) {
        obj_file = files[0];
        mtl_file = files[1];
      } else if ( ext1 === 'mtl' && ext2 === 'obj' ) {
        obj_file = files[1];
        mtl_file = files[0];
      } else{
        alert('For now, this application supports either loading one .obj file or loading an .obj file and a corresponding .mtl file!');
        return undefined;
      }

      return readOBJ(obj_file, mtl_file, loadOBJ);

    } else {
      alert('For now, this application supports either loading one .obj file or loading an .obj file and a corresponding .mtl file!');
      return undefined;
    }
  };

  // Arguments either (obj, callback) or (obj, obj_mtl, callback)
  var readOBJ = function() {
    var reader = new FileReader();
    var object = undefined;
    reader.onload = function(e) {
      var file, mtl_file, callback;

      if(arguments.length === 2){
        file = arguments[0];
        callback = arguments[1];
        object = callback(e.target.result, file.name);
      } else if(arguments.length === 3){
        file = arguments[0];
        mtl_file = arguments[1];
        callback = arguments[2];
        object = callback(e.target.result, file.name, mtl_file);
      }
    };

    reader.onerror = function(e) {
      alert(e);
      return undefined;
    };

    reader.readAsText(file);
    return object;
  };

  var loadOBJ = function(obj, name, mtl_file) {
    var object;
    if(typeof mtl_file === 'undefined'){
      object = new THREE.OBJLoader().parse(obj);
      object.name = name;
      return object;
    }

    object = new THREE.OBJMTLLoader().parse(obj);
    var reader = new FileReader();

    reader.onload = function(e) {
      var materials_creator = new THREE.MTLLoader().parse(e.target.result);
      materials_creator.preload();

      object.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
          if (object.material.name) {

            var material = materials_creator.create(object.material.name);

            if (material) {
              object.material = material;
            }
          }
        }
      });
    };

    object.name = name;
    object.visible = true;
    ispy.disabled[name] = false;

    reader.readAsText(mtl_file);
    return object;
  };

  return {
    selectWebFile: selectWebFile, // param: fileList, index
    selectLocalFile: selectLocalFile, // fileList, index
    loadEvent: loadEvent, // param: eventNamesList, index
    importModel: importModel // param: inputId, return: loaded object
  };

})();