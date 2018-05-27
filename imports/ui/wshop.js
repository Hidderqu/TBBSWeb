import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import './wshop.html';
 
Template.wshop.events({
  'click #voteBtn'() {
    Meteor.call('workshops.voteFor', this._id);
  },
});

Template.wshop.helpers({

});

