import { Template } from 'meteor/templating';

import { Workshops } from '../api/workshops.js';
 
import './wshop.js';
import './wshopList.html';


//Task List page helpers & events
Template.wshopList.onCreated(function bodyOnCreated() {
  Meteor.subscribe('workshops');
});

Template.wshopList.helpers({
  
  workshops() {
    return Workshops.find({}, { sort: { createdAt: -1 } });
  },
  
});

Template.wshopList.events({

  'submit .new-wshop'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const theme = target.theme.value;
    const desc = target.desc.value;
 
    // Insert a task into the collection
    Meteor.call('workshops.insert', theme, desc);
 
    // Clear form
    target.theme.value = '';
    target.desc.value = '';
  },

});