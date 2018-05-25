import { check } from 'meteor/check';


Accounts.validateNewUser(function(user) {

    console.log("New user:\n", user);

	//Récupération des données de user (sauf password qui arrive ici crypté donc pas analysable)
	const id = user.username;
	const nom = user.profile.nom;
	const prenom = user.profile.prenom;
	const lycee = user.profile.lycee;
	var infoOK = true;

	//Vérification du type des variables
    check(id, String);
	check(nom, String);
	check(prenom, String);
	check(lycee, String);

	//Autres vérifications sur les variables
	if (nom.length < 2) {
		infoOK = false;
	}

	if (prenom.length < 2) {
		infoOK = false;
	}

	if (id.length < 8) {
		infoOK = false;
	}

	//Creation de l'utilisateur
	if (infoOK) {
		return true;
	}
	else {
		throw new Meteor.Error(500, "Utilisateur invalide, avortement de l'ajout à la base de données")
	}
});