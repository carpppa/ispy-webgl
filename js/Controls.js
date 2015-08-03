
var Controls = (function(){

  var scene, event;
  var fileList = [];
  var fileNamesList = [];
  var eventNamesList = [];

  var perspectiveBtn, ortographicBtn,
    stereoBtn, prevEventBtn, nextEventBtn,
    browserFiles, browserEvents;

  var inset = $('#axes');

  var currentSource;
  var currentFileIndex, currentEventIndex;
  var err_msg = "Sorry. You seem to be using a browser that does not support FileReader API. \
    Please try with Chrome (6.0+), Firefox (3.6+), Safari (6.0+), or IE (10+). \
    Alternatively, open a file from the web. ";

  var init = function(_scene){
    scene = _scene;

    $('#controls').append(loadTemplate('controls'));
    $('#modals').append(loadTemplate('modals'));

    initSelectors();

    // Handling FireFox checkbox problem:
    $(window).on('beforeunload', function(){
      $('#invert-colors').prop('checked', false);
      $('#show-axes').prop('checked', false);
      $('#show-info').prop('checked', false);
      $('#show-stats').prop('checked', false);
      $('#fps-slider').prop('value', 30);
    });

    $('.disabled').on('click', false);
    $(ispy).on('data-collected', displayData);

    // ----------------------- ISPY EDU

    modal('.modal', 'hide');

    $('button[data-target]').on('click', function(){
      var selector = $(this).attr('data-target');
      modal(selector, 'show');

      /*
       [Log] selector $('#open-files') (Controls.js, line 16)
       [Log] selector $('#settings') (Controls.js, line 16)
       [Log] selector $('#about') (Controls.js, line 16)
       [Log] selector $('#stereo-modal') (Controls.js, line 16)
       [Log] selector $('#import-model') (Controls.js, line 16)
      */

    });

    $('[data-dismiss="modal"]').on('click', function(){
      modal('.modal', 'hide');
    });

    // Enable closing modal by clicking outside the dialog....
    $('.modal').click(function(event){
      // ... but prevent the event bubbling inside the modal dialog:
      if ($(event.target).is('.modal')){
        modal('.modal', 'hide');
      }
    });
  };

  var prevEvent = function(){
    if ( eventNamesList && currentEventIndex > 0) {
      currentEventIndex--;
      loadSelectedEvent();
    }
  };

  var nextEvent = function(){
    if ( eventNamesList && eventNamesList.length-1 > currentEventIndex ) {
      currentEventIndex++;
      loadSelectedEvent();
    }
  };

  var resetControls = function(){
    scene.resetControls();
  };

  var zoom = function(step){
    scene.zoom(step);
  };

  var setAngle = function(angle){
    switch(angle){
      case 'xy':
        scene.setXY();
        return;
      case 'yz':
        scene.setYZ();
        return;
      case 'xz':
        scene.setXZ();
        return;
    }
  };

  var setPerspective = function(){
    perspectiveBtn.addClass('active');
    ortographicBtn.removeClass('active');
    scene.setPerspective();
  };

  var setOrthographic = function(){
    perspectiveBtn.removeClass('active');
    ortographicBtn.addClass('active');
    scene.setOrthographic();
  };

  var setStereo = function(){
    perspectiveBtn.addClass('active');
    ortographicBtn.removeClass('active');
    scene.setStereo();
  };

  var printImage = function(){
    scene.printImage();
  };

  var exportModel = function(){
    scene.exportModel();
  };

  var importModel = function(inputId){
    modal('#import-model', 'hide');
    modal('#loading', 'show');

    var object = Loader.importModel(inputId);
    if(object){
      scene.addToGroup(ispy.groups.Imported.name, object);

      var name = object.name;
      TreeView.addInstance(name, name, "Imported object", true, 'rgba(200,200,200,1)', ispy.groups.Imported.name);
    } else {
      alert('Unknown error occurred while importing model!');
    }

    modal('#loading', 'hide');
  };

  var showFiles = function(source){
    browserFiles.empty();
    browserEvents.empty();

    $('#load-event').addClass('disabled');

    // Separate event loading from UI
    loadFiles(source);

    browserFiles.append(loadTemplate('browser-files-view', { fileList: arrayToJSON(fileNamesList) }));

    // TODO: loading modal
    modal('#open-files', 'hide');
    modal('#files', 'show');
  };

  var loadFiles = function(source){

    fileNamesList.length = 0;

    switch(source){
      case 'web':
        fileList = ispy.web_files;
        for (var i = 0; i < fileList.length; i++) {
          fileNamesList.push(_.last(fileList[i].split("/")));
        }
        break;
      case 'local':
        if (!hasFileAPI()) {
          alert(err_msg);
          return;
        }
        fileList = document.getElementById('local-files').files;
        for (var i = 0; i < fileList.length; i++) {
          fileNamesList.push(fileList[i].name);
        }
        break;
      default:
        alert('Unknown error');
        console.log('Attempted source flag for Control.loadFiles:', source, ". Allowed flags are 'web' and 'local'.");
        return;
    }

    currentSource = source;
  };

  var showSelectedFile = function(index){

    // TODO: modal('#progress', 'show');

    // Separate event loading from UI
    selectFile(index);

    browserEvents.append(loadTemplate('browser-events-view', { eventList: arrayToJSON(eventNamesList) }));

    // TODO: modal('#progress', 'hide');
  };

  var selectFile = function(index){
    switch(currentSource){
      case 'web':
        eventNamesList = Loader.selectWebFile(fileList, index);
        break;
      case 'local':
        eventNamesList = Loader.selectLocalFile(fileList, index);
        break;
      default:
        alert('Unknown error');
        console.log('Attempted source flag for Control.selectFile:', currentSource, ". Allowed flags are 'web' and 'local'.");
        return;
    }
    currentFileIndex = index;
  };

  var showSelectedEvent = function(index){
    $("#selected-event").html(eventNamesList[index]);
    // Separate event loading from UI
    selectEvent(index);
    $('#load-event').removeClass('disabled');
  };

  var selectEvent = function(index){
    currentEventIndex = index;
  };

  var loadSelectedEvent = function(){
    modal('#files', 'hide');
    // TODO: modal('#loading', 'show');

    // Separate event loading from UI
    loadEvent();

    enableNextPrev();

    // TODO: modal('#loading', 'hide');
  };

  var loadEvent = function(){
    var eventData = Loader.loadEvent(eventNamesList, currentEventIndex);
    if(eventData){
      event = new ispy.Event(eventData, scene);
    } else {
      return undefined;
    }
    var nthEvent = currentEventIndex + 1; // JavaScript!

    $("#event-loaded").html(fileNamesList[currentFileIndex] + ":" + eventNamesList[currentEventIndex] + "  [" + nthEvent + " of " + eventNamesList.length + "]");

    return event;
  };

  var invertColors = function(value){


    // TODO: .................



    // TODO...... ::::::s
  };

  var enableNextPrev = function(){
    if ( currentEventIndex > 0 ) {
      prevEventBtn.removeClass("disabled");
    } else {
      prevEventBtn.addClass("disabled");
    }

    if ( eventNamesList && eventNamesList.length - 1 > currentEventIndex ) {
      nextEventBtn.removeClass("disabled");
    } else {
      nextEventBtn.addClass("disabled");
    }
  };

  var toggleAxes = function(hide){
    if(hide){
      inset.hide();
    } else {
      inset.show();
    }
  };

  var toggleInfoDialogs = function(show){
    TreeView.toggleInfoDialogs(show);
  };

  var toggleStats = function(show){
    if(show){
      $('#stats').show();
    } else {
      $('#stats').hide();
    }
  };

  var setFrameRate = function(value){
    scene.setFrameRate(value);
  };

  var displayData = function(event, data){
    $('#display-data-modal').html(loadTemplate('object-data-view', { data: data }));
    modal('#display-data-modal', 'show');

    // FIXME: --------------------------------- Modal closing

    $('[data-dismiss="modal"]').off('click');
    $('.modal').off('click');

    $('[data-dismiss="modal"]').on('click', function(){
      modal('.modal', 'hide');
    });

    // Enable closing modal by clicking outside the dialog....
    $('.modal').click(function(event){
      // ... but prevent the event bubbling inside the modal dialog:
      if ($(event.target).is('.modal')){
        modal('.modal', 'hide');
      }
    });

    /*
    closeModal: function(){
      console.log('closemodal');
      this.undelegateEvents();
      this.remove();
    },

    doNothing: function(){
      console.log('donothing');
      // To prevent CSS bubbling. :(
      return false;
    }
    */
  };


  // ---------------------------- HELPER FUNCTIONS:

  var loadTemplate = function(template, data){
    return window['JST'][template](data);
  };

  var arrayToJSON = function(array){
    var json = {};
    if(array){
      for(var i = 0; i < array.length; ++i){
        json[i] = array[i];
      }
    }
    return json;
  };

  var modal = function(selector, option){
    switch(option){
      case 'show':
        $(selector).show();
        return;
      case 'hide':
        $(selector).hide();
        return;
    }
  };

  var hasFileAPI = function() {
    if ( window.FileReader ) {
      return true;
    } else {
      console.log("FileReader", window.FileReader);
      console.log("File", window.File);
      console.log("FileList", window.FileList);
      console.log("FileSystem", window.FileSystem);
      return false;
    }
  };

  var initSelectors = function(){
    perspectiveBtn = $('#perspective');
    ortographicBtn = $('#orthographic');
    stereoBtn = $('#stereo');
    prevEventBtn = $("#prev-event-button");
    nextEventBtn = $("#next-event-button");
    browserFiles = $('#browser-files');
    browserEvents = $('#browser-events');
  };

  return {
    init: init,
    prevEvent: prevEvent,
    nextEvent: nextEvent,
    resetControls: resetControls,
    zoom: zoom, // param: zoom step
    setAngle: setAngle, // param: 'xy' | 'yz' | 'xz'
    setPerspective: setPerspective,
    setOrthographic: setOrthographic,
    setStereo: setStereo,
    printImage: printImage,
    exportModel: exportModel,
    importModel: importModel, // param: inputID
    loadFiles: loadFiles, // param: 'web' | 'local'
    showFiles: showFiles, // param: 'web' | 'local'
    selectFile: selectFile, // param: index
    showSelectedFile: showSelectedFile, // param: index
    selectEvent: selectEvent, // param: index
    showSelectedEvent: showSelectedEvent, // param: index
    loadEvent: loadEvent, // return: event (instance of ispy.Event)
    loadSelectedEvent: loadSelectedEvent,
    enableNextPrev: enableNextPrev,
    invertColors: invertColors, // param: value
    toggleAxes: toggleAxes, // param: hide
    toggleInfoDialogs: toggleInfoDialogs, // param: show
    toggleStats: toggleStats, // param: show
    setFrameRate: setFrameRate // param: frameRate
  };

})();