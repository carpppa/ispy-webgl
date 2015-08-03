

$(function() {

  // TODO: loading modal

  TreeView.create();
  addGroups();

  console.log('ispy', ispy);
  var scene = new ispy.Scene();

  Controls.init(scene);
  new ispy.Detector(scene);


  // HELPER FUNCTIONS

  function addGroups(){
    _.each(ispy.groups, function(group){
      TreeView.addGroup(group.name, group.description)
    });
  }


});
