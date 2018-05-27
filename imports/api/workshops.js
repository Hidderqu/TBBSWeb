import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

//Database generation + Data scheme
export const Workshops = new Mongo.Collection('workshops');

Schema = {};

export const WorkshopsSchema = new SimpleSchema({
  author: {
    type: String,
    max: 50,
  },
  owner : {
    type : String,
  },
  theme: {
    type: String,
    max: 50,
  },
  description: {
    type: String,
  },
  voters: {
    type: Array,
  },
  'voters.$': String,
  createdAt: {
    type: Date,
  },
});

Workshops.attachSchema(WorkshopsSchema); //Lien schema et collection Workshops


//Publications
if (Meteor.isServer) {
  // This code only runs on the server
    Meteor.publish('workshops', function tasksPublication() {
    return Workshops.find({});
  });
}


//Task related methods
Meteor.methods({
  'workshops.insert'(theme, desc) {
    check(theme, String);
    check(desc, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Workshops.insert({
      author : Meteor.user().username,
      owner : Meteor.userId(),
      theme: theme,
      description : desc,
      voters : [],
      createdAt: new Date(),
    });
  },

  'workshops.remove'(workshopId) {
    check(workshopId, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const wshop = Workshops.findOne(workshopId);
    if (wshop.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
 
    Workshops.remove(workshopId);
  },

  'workshops.voteFor'(workshopId) {
    check(workshopId, String);

    if (! Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }

    const wshop = Workshops.findOne(workshopId);
    if (wshop.voters.includes(Meteor.userId())) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('cannot vote twice');
    }
 
    Workshops.update(workshopId, { $push: { voters: Meteor.userId() } });
  },
});