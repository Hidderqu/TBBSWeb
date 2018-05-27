Router.configure({
	layoutTemplate: 'myLayout',
});

Router.onBeforeAction(function() {
	if(!Meteor.userId()){
		this.render("home");
	}
	else {
		this.next();
	}

	}, {
	except: [
		"connexion",
		"inscription",
		"home",
	]
});

Router.route('/', {
	name: 'home',
});

Router.route('/wshopList', {
	name: 'wshopList',
});

Router.route('/cours', {
	name: 'cours',
});

Router.route('/inscription', {
	name: 'inscription',
});

Router.route('/connexion', {
	name: 'connexion',
});