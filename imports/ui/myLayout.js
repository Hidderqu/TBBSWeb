import { Template } from 'meteor/templating';
import { Workshops } from '../api/workshops.js';

import './myLayout.html';


//Layout helpers & events 
Template.myLayout.helpers({
  
});

Template.myLayout.events({
  'click #signOutLink'(event){
    Meteor.logout();
  },
});