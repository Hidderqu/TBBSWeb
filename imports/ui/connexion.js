import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { check } from 'meteor/check';

import './connexion.html';

/*
Template.connexion.helpers({

});
*/

Template.connexion.events({
	'submit .signin_form': function(event){
		event.preventDefault();

		//Récupération des données du formulaire
		const target = event.target; //target = form
    	const id = target.identifiant.value;
    	const pass = target.passwd.value;

    	//Vérification du type des variables
    	check(id, String);
    	check(pass, String);

    	//Connexion de l'utilisateur
    		Meteor.loginWithPassword(
                id,
                pass,
    			function(error) {
	    			if(error){
	    				console.log(error);
	    			}
	    			else{
	    				Router.go('home')
	    			}
    			}
    		);
    	}
});