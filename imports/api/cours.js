import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'
import SimpleSchema from 'simpl-schema';

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
      subject: String,
      student: String,
      teacher: String,
      owner: String
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
      subject: Match.Optional( String ),
      student: Match.Optional( String ),
      teacher: Match.Optional( String ),
      owner: Match.Optional( String ),
    });

    try {
      return Events.update( event._id, {
        $set: event
      });
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  removeEvent( event ) {
    check( event, String );

/*  FIX THIS !!!
    if (event.owner !== Meteor.userId()) {
      // N'autoriser les utilisateurs qu'à supprimer leurs propres créneaux
      throw new Meteor.Error('not-authorized');
    }
*/

    try {
      return Events.remove( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  }
});