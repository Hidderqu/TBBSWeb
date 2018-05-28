import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { check } from 'meteor/check';

import './inscription.html';

/*
Template.inscription.helpers({

});
*/

Template.inscription.events({
	'submit .signup_form': function(event){
		event.preventDefault();

		//Récupération des données du formulaire
		const target = event.target; //target = form
    	const nom = target.nom.value;
    	const prenom = target.prenom.value;
        const id = target.identifiant.value;
    	const email = target.email.value;
    	const pass = target.passwd.value;
    	const pass_conf = target.passwd_conf.value;
    	const lycee = target.lycee.value;
    	var infoOK = true;

    	//Vérification du type des variables
    	check(nom, String);
    	check(prenom, String);
    	check(id, String);
    	check(pass, String);
    	check(pass_conf, String);
    	check(lycee, String);

    	//Autres vérifications sur les variables
    	if (nom.length < 2) {
    		infoOK = false;
    		console.log("Nom trop court");
    	}

    	if (prenom.length < 2) {
    		infoOK = false;
    		console.log("Prénom trop court");
    	}

    	if (id.length < 8) {
    		infoOK = false;
    		console.log("Identifiant trop court");
    	}

    	if (pass != pass_conf) {
    		infoOK = false;
    		console.log("Erreur confirmation de mot de passe");
    	}

        
        if (
            /^[a-zA-Z][a-zA-Z0-9_-]+[a-zA-Z0-9]@([a-zA-Z][a-zA-Z0-9-]+\.)+[a-zA-Z]{2,3}$/
            .test(email) == false
        ) {
        infoOK = false;
        console.log("Mail invalide");
        }
        

    	//Creation de l'utilisateur
    	if (infoOK) {

            var newUser = {
                username: id,
                password: pass,
                email: email,
                profile: {
                    nom: nom,
                    prenom: prenom,
                    lycee: lycee
                }
            };
            console.log(newUser);
    		//NB cette méthode fait appel à Accounts.validateNewUser pour une double vérif côté serveur
    		Accounts.createUser(
                newUser,
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
	}
});