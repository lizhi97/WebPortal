'use strict';

// Configuring the Articles module
angular.module('pus-managements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'PUS Management', 'pus-managements', 'dropdown', '/pus-managements(/create)?',true, null, 1);
		Menus.addSubMenuItem('topbar', 'pus-managements', 'List PUS', 'pus-managements/tableTest');
		//Menus.addSubMenuItem('topbar', 'pus-managements', 'List Pus managements', 'pus-managements');
		Menus.addSubMenuItem('topbar', 'pus-managements', 'New PUS', 'pus-managements/create');

	}
]);
