




// TODO: ---------------------------------------------------------
// TableView renders on TreeView, lift TreeView css bottom





var TableView = (function(){

  var CollectionTable = Backbone.View.extend({

    tagName: 'div',

    template: window['JST']['table-view'],

    events: {
      'mouseenter tbody > tr': 'highlightObject',
      'mouseout tbody > tr': 'unHighlightObject'
    },

    initialize: function(){
      // this.listenTo(this.model, 'change:displaying', this.removeIfHidden);
      // this.listenTo(this.model.collection, 'object-hover', this.highlightRow);
    },

    render: function(){
      this.$el.html(this.template(this.attributes));
      this.$('#collection-table').stupidtable({
        "v3d": this.v3dSort
      }).bind('aftertablesort', this.afterTableSort);
      return this;
    },

    v3dSort: function(a, b){
      var aV3 = a.split(",");
      var bV3 = b.split(",");

      if(aV3.length === 3 && bV3.length === 3){

        var aLength = Math.sqrt(aV3[0] * aV3[0] + aV3[1] * aV3[1] + aV3[2] * aV3[2]);
        var bLength = Math.sqrt(bV3[0] * bV3[0] + bV3[1] * bV3[1] + bV3[2] * bV3[2]);

        return aLength - bLength;
      }
      return 1;
    },

    afterTableSort: function(event, data){
      var previouslySorted = $('i.i-sorted');
      if(previouslySorted){
        previouslySorted.removeClass().addClass('i-no-sorted fa fa-sort');
      }
      var newClass = "i-sorted fa fa-sort-" + data.direction;
      $('thead').find('th').eq(data.column).find('i').eq(0).removeClass().addClass(newClass);
    },

    /*
    removeIfHidden: function(model, value){
      if(!value){ // value == new value == true if displaying == false if not
        this.remove();
      }
    },
    */

    highlightRow: function(key, originalIndex, doEffect){
      if(this.attributes.data.key === key){
        var domId = "#" + key.concat(originalIndex);
        var row = $(domId);
        if(doEffect === 'on'){
          // TODO: var color = ispy.inverted_colors ? "#dfdfdf" : "#777";
          row.css('background-color', '#4c4745');
          row.scrollintoview();
        }else{
          row.removeAttr('style');
        }
      }
    },

    highlightObject: function(event){
      var objectID = $(event.currentTarget).data('object-id');
      $(ispy).trigger('collection-table-hovering', [true, objectID]);
    },

    unHighlightObject: function(){
      $(ispy).trigger('collection-table-hovering', false);
    }
  });

  var tableView;

  var create = function(data){
    if(tableView){
      tableView.remove();
    }
    tableView = new CollectionTable({attributes: data});
    $('#table-view').html(tableView.render().$el);
  };

  var remove = function(){
    tableView.remove();
    tableView = undefined;
  };

  var currentTable = function(){
    if(tableView){
      return tableView.attributes.data.key;
    } else {
      return undefined;
    }
  };

  var highlightRow = function(key, originalIndex, doEffect){
    if(tableView){
      tableView.highlightRow(key, originalIndex, doEffect);
    }
  };

  return {
    // Broadcasted events:
    // - 'collection-table-hovering': param: event, group, key, state
    create: create, // param: data
    remove: remove,
    currentTable: currentTable, // return: key | undefined
    highlightRow: highlightRow // param: key, originalIndex, doEffect (== 'on' | 'off')
  };

})();