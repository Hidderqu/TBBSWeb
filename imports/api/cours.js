import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'
import SimpleSchema from 'simpl-schema';
import { Roles } from 'meteor/alanning:roles';


export const Events = new Mongo.Collection( 'events' );


export const EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'Descriptif du cours'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'h_start': {
    type: String,
    label: 'Heure de départ',
  },
  'h_end': {
    type: String,
    label: 'Heure de fin',
  },
  'subject': {
    type: String,
    label: 'Matiere etudiee',
    allowedValues: [ 'Maths', 'Physique', 'SI', 'Anglais' ]
  },
  'student': {
    type: String,
    label: 'Nom etudiant'
  },
  'teacher': {
    type: String,
    label: 'Nom professeur'
  },
  'owner': {
    type: String,
    label: 'Propriétaire evenement'
  },
  'validated': {
    type: Boolean,
    label: 'Cours validé',
  }
});

Events.attachSchema( EventsSchema );


//Publications
if (Meteor.isServer) {
  // This code only runs on the server
    Meteor.publish( 'cours',
    	function() { 
    		return Events.find(); }
    );
}

//Methodes pour l'ajout et la modification de cours
Meteor.methods({
  addEvent( event ) {
    check( event, {
      title: String,
      start: String,
      end: String,
      h_start: String,
      h_end: String,
      subject: String,
      student: String,
      teacher: String,
      owner: String,
      validated: Boolean,
    });

    try {
      return Events.insert( event );
      console.log('Event added');
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
      console.log('Event add failed');
    }
  },
  editEvent( event ) {
    check( event, {
      _id: String,
      title: Match.Optional( String ),
      start: String,
      end: String,
      h_start: Match.Optional ( String ),
      h_end: Match.Optional ( String ),
      subject: Match.Optional( String ),
      student: Match.Optional( String ),
      teacher: Match.Optional( String ),
      owner: Match.Optional( String ),
      validated: Match.Optional( Boolean),
    });

    const mod_event = Events.findOne(event._id);

    if (mod_event.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-owner');
    }

    try {
      return Events.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  removeEvent( eventId ) {
    check( eventId, String );

    const event = Events.findOne(eventId);

    if (event.owner !== Meteor.userId() && !Roles.userIsInRole( Meteor.userId(), 'admin' )) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorised');
    }

    try {
      return Events.remove( eventId );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});