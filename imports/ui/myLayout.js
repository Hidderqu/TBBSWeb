import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';

import './myLayout.html';


//Layout helpers & events 
Template.myLayout.helpers({
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.myLayout.events({
  'click #signOutLink'(event){
    Meteor.logout();
  },
});