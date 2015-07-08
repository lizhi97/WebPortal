'use strict';

// Configuring the Articles module
angular.module('teammembers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'BaseData', 'basedata', 'dropdown', '/teammembers(/create)?',null, null,4);
		Menus.addSubMenuItem('topbar', 'basedata', 'List Team Members', 'teammembers');
		Menus.addSubMenuItem('topbar', 'basedata', 'New Team Member', 'teammembers/create');
		Menus.addSubMenuItem('topbar', 'basedata', 'List LDMS Components', 'ldmscomponents');
		Menus.addSubMenuItem('topbar', 'basedata', 'New LDMS Component', 'ldmscomponents/create');
	}
]);
