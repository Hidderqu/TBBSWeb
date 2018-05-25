import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker'; //For reactive-update

import { Events } from '../api/cours.js';

import './cours.html';

let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
}; //Vérifie si une date appartient au passé

Template.cours.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'cours' );
});

Template.cours.onRendered( () => {
  $( '#events-calendar' ).fullCalendar({
    events( start, end, timezone, callback ) {
      let data = Events.find().fetch().map( ( event ) => {
        event.editable = !isPast( event.start ); //Empêche un évènement passé d'être édité
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    eventRender( event, element ) {
      element.find( '.fc-content' ).html(
        `<h4 class="student">${ event.student }</h4>
         <p class="course-details">${ event.teacher }<br>
         ${ event.subject }<br>
         ${ event.title } </p>
        `
      );
    },
    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id: event._id,
          start: date,
          end: date
        };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            console.log( 'Error while drag & dropping');
          }
        });
      } else {
        revert();
        console.log( 'Sorry, you can\'t move items to the past!');
      }
    },

    //Ajout et modification de cours
    dayClick( date ) {
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    },
    eventClick( event ) {
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }
  });

//Update quand il y a changement de données
Tracker.autorun( () => {
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });

});


//Helpers et Events de modification et d'ajout de cours
Template.addEditEventModal.helpers({
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    } //Verif du type d'evenement, ajout ou modif
  },
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },
  event() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
        start: eventModal.date,
        end: eventModal.date
      };
    }
  }
});


let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '.modal-backdrop' ).fadeOut();
};

Template.addEditEventModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();

    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent',
        eventItem  = {
          title: template.find( '[name="title"]' ).value,
          start: template.find( '[name="start"]' ).value,
          end: template.find( '[name="end"]' ).value,
          subject: template.find( '[name="subject"] option:selected' ).value,
          student: Meteor.user().profile.nom,
          teacher: template.find( '[name="teacher"]' ).value,
          owner: Meteor.userId()
        };
        console.log(eventItem);

    if ( submitType === 'editEvent' ) {
      eventItem._id = eventModal.event;
    }

    Meteor.call( submitType, eventItem, ( error ) => {
      if ( error ) {
        console.log('Error');
      } else {
        console.log('Success');
        closeModal();
      }
    });
  },
  'click .delete-event' ( event, template ) {
    let eventModal = Session.get( 'eventModal' );
    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        if ( error ) {
          console.log('Danger');
        } else {
          console.log('Event successfully deleted');
          closeModal();
        }
      });
    }
  }

});