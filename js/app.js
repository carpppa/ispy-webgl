

$(function() {

  // TODO: loading modal

  TreeView.create();
  addGroups();

  console.log('ispy', ispy);
  var scene = new ispy.Scene();

  Controls.init(scene);
  new ispy.Detector(scene);

  /*
  var openFilesModal = $('#open-files');
  $('#open-web-files').on('click', function(){
    modal(openFilesModal, 'hide');
    modal($('#files'), 'show');

    // TODO: ispy.loadWebFiles();
  });

  $('#local-files').on({
    'click': function(){
      modal(openFilesModal, 'hide');
    },
    'change': function(){
      // TODO: onchange="ispy.loadLocalFiles();"
    }
  });
  */



  // HELPER FUNCTIONS

  function addGroups(){
    _.each(ispy.groups, function(group){
      TreeView.addGroup(group.name, group.description)
    });
  }


});
