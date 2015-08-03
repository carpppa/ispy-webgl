
var TreeView = (function(){

  var Instance = Backbone.Model.extend({

    defaults: function() {
      return {
        key: "",
        name: "",
        description: "",
        visible: false,
        color: "rgba(255, 255, 255, 1)",
        data: false,
        displaying: false
      };
    },

    toggleVisibility: function(){
      this.set({visible: !this.get('visible')});
    },

    displayData: function(){
      this.set({displaying: true});
    },

    hideData: function(){
      this.set({displaying: false});
    }

  });

  var InstanceList = Backbone.Collection.extend({

    model: Instance,

    initialize: function(){
      this.listenTo(this, 'change:displaying', this.hideOldData);
      this.listenTo(this, 'reset', this.triggerRemove);
    },

    hideOldData: function(model, value){
      if(value){
        _.each(this.where({displaying: true}), function(instance){
          if(instance !== model){
            instance.hideData();
          }
        });
      }
    },

    // As in http://stackoverflow.com/questions/11774738/backbone-why-doesnt-a-collection-reset-trigger-a-model-event
    triggerRemove: function(collection, options){
      _.each(options.previousModels, function(model) {
        model.trigger('remove');
      });
    },

    setAllVisible: function(){
      this.setVisibilityOfAll(true);
    },

    setAllInvisible: function(){
      this.setVisibilityOfAll(false);
    },

    setVisibilityOfAll: function(newVisibility){
      this.each(function(instance){
        instance.set({visible: newVisibility});
      });
    },

    checkVisibilityOfAll: function(){
      if(this.length){
        var firstVisibility = this.first().get('visible');
        var returnValue = firstVisibility;
        this.each(function(instance){
          if(instance.get('visible') !== firstVisibility){
            returnValue = undefined;
          }
        });
        return returnValue;
      }
    }

  });

  var Group = Backbone.Model.extend({

    defaults: function() {
      return {
        name: "",
        description: "",
        instances: new InstanceList
      };
    },

    // As in http://stackoverflow.com/questions/7140741/backbone-js-model-with-collection
    // IN FUTURE --> backbonerelational.org ?!!
    set: function(attr, options){
      if(attr.instances !== undefined && !(attr.instances instanceof InstanceList)){
        attr.instances = new InstanceList(attr.instances);
      }
      return Backbone.Model.prototype.set.call(this, attr, options);
    },

    showAll: function(){
      this.attributes.instances.setAllVisible();
    },

    hideAll: function(){
      this.attributes.instances.setAllInvisible();
    }

  });

  var GroupList = Backbone.Collection.extend({

    model: Group

  });

  var InstanceView = Backbone.View.extend({

    tagName: 'li',

    template: window['JST']['instance-view'],

    events: {
      'click .color-toggle': 'changeInstanceColor',
      'click .visibility-toggle > p': 'toggleVisibility',
      'click .display-data': 'displayDataInTable'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'parent-rendered', this.assignInstance);
      this.listenTo(this.model, 'remove', this.remove);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.updateClasses();
      return this;
    },

    assignInstance: function(element){
      this.undelegateEvents();
      element.append(this.$el);
      this.delegateEvents();
    },

    updateClasses: function(){
      var visible = this.model.get('visible');
      this.$('.div-instance-name').toggleClass('visible', visible);
      this.$('.display-data').toggleClass('displaying', this.model.get('displaying'));
      var colorToggle = this.$('.color-toggle');
      if(visible){
        colorToggle.find('i').removeClass().addClass('fa fa-circle');
        colorToggle.css('color', this.model.get('color'));
      } else {
        colorToggle.find('i').removeClass().addClass('fa fa-circle-thin');
        colorToggle.css('color', 'rgba(107,101,85,1)');

      }
    },

    changeInstanceColor: function(){
      // TODO: open dialog + select color
      // this.model.set({color: color});
      // broadcast color change
    },

    toggleVisibility: function(){
      this.model.toggleVisibility();
    },

    displayDataInTable: function(){
      // var tableHeight = 0;
      var displaying = ! this.model.get('displaying');
      if(displaying){
        this.model.displayData();

        // TODO: table height?!?
        // tableHeight = $('.table-container').css('height');
      } else {
        this.model.hideData();
      }
      // this.model.collection.trigger('table-changed', tableHeight);
      $(ispy).trigger('change-table-displaying', [this.model.get('key'), displaying]);
    }

  });

  var InfoView = Backbone.View.extend({

    tagName: 'div',

    template: window['JST']['info-view'],

    events: {
      'click .exit': 'closeModal',
      'click .modal-dialog': 'doNothing'
    },

    initialize: function(){},

    render: function(){
      var data = this.model.toJSON();
      data.instances = this.model.get('instances').toJSON();
      this.$el.html(this.template(data));
      return this;
    },

    closeModal: function(){
      this.undelegateEvents();
      this.remove();
    },

    doNothing: function(){
      // To prevent CSS bubbling. :(
      return false;
    }

  });

  var GroupView = Backbone.View.extend({

    tagName: 'div',

    template: window['JST']['group-view'],

    events: {
      'click .row-visibility-toggle': 'toggleRowVisibility',
      'click .all-visibility-toggle': 'toggleVisibilityOfAll',
      'click .display-info': 'displayInfo'
    },

    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'parent-rendered', this.assignGroup);
      this.listenTo(this.model.attributes.instances, 'add', this.addInstance);
      this.listenTo(this.model.attributes.instances, 'change:visible', this.updateVisibility);
      this.listenTo(this.model.attributes.instances, 'change:displaying', this.triggerDataSetHiding);
      this.listenTo(this.model.attributes.instances, 'table-changed', this.triggerTreeViewResizing);
      this.listenTo(this.model, 'remove', this.remove);
      this.listenTo(this.model, 'object-hover', this.triggerRowHighlight);
      this.listenTo(this.model, 'info-visibility-changed', this.toggleInfoDialog)
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      this.toggleInfoDialog(false);
      this.assignInstances();
      return this;
    },

    assignGroup: function(element){
      this.undelegateEvents();
      element.append(this.$el);
      this.delegateEvents();
      this.assignInstances();
    },

    assignInstances: function(){
      var list = this.$('ul');
      this.model.attributes.instances.each(function(instance){
        instance.trigger('parent-rendered', list);
      });
      this.updateVisibility();
    },

    addInstance: function(instance){
      var list = this.$('ul');
      list.append(new InstanceView({model: instance}).render().$el);
      this.updateVisibility();
    },

    toggleRowVisibility: function(){
      this.$('ul').slideToggle();
      var chevronTag = this.$('.row-visibility-toggle').find('i');
      chevronTag.toggleClass('fa-chevron-circle-right');
      chevronTag.toggleClass('fa-chevron-circle-down')
    },

    toggleVisibilityOfAll: function(){
      var visibilityToggle = this.$('.all-visibility-toggle');
      if(visibilityToggle.hasClass('all-visible')){
        this.model.hideAll();
        visibilityToggle.toggleClass('all-visible', false);
        this.updateMarker(false);
      } else {
        this.model.showAll();
        visibilityToggle.toggleClass('all-visible', true);
        this.updateMarker(true);
      }
    },

    updateVisibility: function(model, value){
      if(model){
        $(ispy).trigger('change-visibility', [this.model.get('name'), model.get('key'), value]);
      }
      var visibilityToggle = this.$('.all-visibility-toggle');
      var visibilityOfAll = this.model.attributes.instances.checkVisibilityOfAll();
      if(visibilityOfAll !== undefined){
        visibilityToggle.toggleClass('all-visible', visibilityOfAll);
        this.updateMarker(visibilityOfAll);
      } else {
        visibilityToggle.removeClass('all-visible');
        this.updateMarker(false);
      }
    },

    updateMarker: function(allVisible){
      var visIndicator = this.$('.all-visibility-toggle').find('i');
      if(allVisible){
        visIndicator.removeClass().addClass('fa fa-circle');
      } else {
        visIndicator.removeClass().addClass('fa fa-circle-thin');
      }
    },

    triggerDataSetHiding: function(model, value){
      this.model.collection.trigger('displaying-change', model, value);
    },

    triggerTreeViewResizing: function(tableHeight){
      this.model.collection.trigger('table-changed', tableHeight);
    },

    triggerRowHighlight: function(key, originalIndex, doEffect){
      this.model.attributes.instances.findWhere({key: key}).trigger(key, originalIndex, doEffect);
    },

    toggleInfoDialog: function(show){
      if(show){
        this.$('.display-info').show();
      } else {
        this.$('.display-info').hide();
      }
    },

    displayInfo: function(){
      $('#info-modal').html(new InfoView({model: this.model}).render().$el);
    }

  });

  var GroupsView = Backbone.View.extend({

    tagName: 'div',

    template: window['JST']['tree-view'],

    events: {},

    initialize: function(){
      this.listenTo(this.collection, 'change', this.render);
      this.listenTo(this.collection, 'add', this.addGroup);
      this.listenTo(this.collection, 'displaying-change', this.hideOldDataSets);
      this.listenTo(this.collection, 'table-changed', this.setHeight);
      _.bindAll(this, 'adjustHeight');
      // $(window).on('resize', this.adjustHeight);
    },

    render: function(){
      this.$el.html(this.template());
      var catalogue = this.$('.catalogue');
      this.collection.each(function(group) {
        group.trigger('parent-rendered', catalogue);
      });
      return this;
    },

    addGroup: function(group){
      var catalogue = this.$('.catalogue');
      catalogue.append(new GroupView({model: group}).render().$el);
    },

    hideOldDataSets: function(model, value){
      this.collection.each(function(group){
          group.attributes.instances.hideOldData(model, value);
      });
    },

    setHeight: function(tableHeight){
      $('#tree-view').css('bottom', parseInt(tableHeight));
    },

    adjustHeight: function(){
      var tableHeight = $('.table-container').css('height');
      tableHeight = typeof tableHeight === 'undefined' ? '0' : tableHeight;
      this.setHeight(tableHeight);
    }

  });

  // ### PROGRAMMATICAL USAGE:

  // Creating the tree-view
  var Groups = new GroupList;

  var init = function(){
    $('#tree-view').html(new GroupsView({collection: Groups}).render().$el);
  };

  var clearGroups = function(exceptions){
    exceptions = (typeof exceptions === 'undefined') ? [] :
      (typeof exceptions !== 'object') ? [exceptions] : exceptions;
    for(var i = 0; i < Groups.length; ++i){
      if(!_.contains(exceptions, Groups.models[i].get('name'))){
        Groups.remove(Groups.models[i]);
        i--;
      }
    }
  };

  var clearInstances = function(exceptionGroups){
    exceptionGroups = (typeof exceptionGroups === 'undefined') ? [] :
      (typeof exceptionGroups !== 'object') ? [exceptionGroups] : exceptionGroups;
    Groups.each(function(group){
      if(!_.contains(exceptionGroups, group.get('name'))){
        group.attributes.instances.reset();
      }
    });
  };

  var addGroupToCollection = function(groupName, description){
    Groups.add({
      name: groupName,
      description: description
    });
  };

  var addInstanceToCollection = function(key, name, description, visible, color, group, data){

    data = data || false;

    var _group = Groups.findWhere({name: group});
    if(_group){
      _group.attributes.instances.add({
        key: key,
        name: name,
        description: description,
        visible: visible,
        color: color,
        data: data
      });
    }
  };

  var triggerHighlight = function(group, key, originalIndex, doEffect){
    Groups.findWhere({name: group}).trigger('object-hover', key, originalIndex, doEffect);
  };

  var toggleInfoDialogs = function(show){
    Groups.each(function(group){
      group.trigger('info-visibility-changed', show);
    });
  };

  // API <3
  return {
    // Broadcasted events:
    // - 'change-visibility': param: event, group, key, state
    // - 'change-table-displaying': param: event, key, displaying
    create: init,
    reset: clearGroups, // param: [exceptions]
    resetInstances: clearInstances, // param: [exceptionGroups]
    addGroup: addGroupToCollection, // param: groupName, description
    addInstance: addInstanceToCollection, // param: key, name, description, visible, color, group, [data]
    highlightTableRow: triggerHighlight, // param: group, key, originalIndex, doEffect
    toggleInfoDialogs: toggleInfoDialogs // param: show
  };

})();