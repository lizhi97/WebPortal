'use strict';

// Configuring the Articles module
angular.module('reportings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Web Reportings', 'reportings', 'dropdown', '/reportings(/create)?',null, null, 2);
		Menus.addSubMenuItem('topbar', 'reportings', 'List Failure PUS', 'reportings/ShowFailedPUS');
		Menus.addSubMenuItem('topbar', 'reportings', 'List Top 10 Failure PUS', 'reportings/list-top10failed');
		Menus.addSubMenuItem('topbar', 'reportings', 'Team Report', 'reportings/viewTeam');
		Menus.addSubMenuItem('topbar', 'reportings', 'Finished By Date', 'reportings/viewProgress');
		Menus.addSubMenuItem('topbar', 'reportings', 'List Failed Percentage', 'reportings/list-failedPassed');
		Menus.addSubMenuItem('topbar', 'reportings', 'List Passed Percentage by Date', 'reportings/list-failedPassedByDate');
	}
]);
