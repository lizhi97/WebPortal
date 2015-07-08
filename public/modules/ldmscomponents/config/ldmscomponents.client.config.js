'use strict';

// Configuring the Articles module
angular.module('ldmscomponents').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Components', 'ldmscomponents', 'dropdown', '/ldmscomponents(/create)?',null, null, 3);
		//Menus.addSubMenuItem('topbar', 'basedata', 'List LDMS Components', 'ldmscomponents');
		//Menus.addSubMenuItem('topbar', 'basedata', 'New LDMS Component', 'ldmscomponents/create');
	}
]);
