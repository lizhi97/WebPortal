'use strict';

// Reportings controller
angular.module('reportings').controller('ReportingsController', ['$scope', '$stateParams', '$location','$q',
	'Authentication', 'Reportings','GetFPUS','GetTop10Failure','GetTeamReport','GetCreatedReport','GetCreatedByDate',
	'GetFailedPassedList','GetFailedPassedByDate',
	function($scope, $stateParams, $location,$q, Authentication, Reportings, GetFPUS,GetTop10Failure,GetTeamReport,
			 GetCreatedReport,GetCreatedByDate,GetFailedPassedList,GetFailedPassedByDate) {
		$scope.authentication = Authentication;


		$scope.getTop10Failed = function () {
			function doQuery() {
				var d = $q.defer();
				var result = GetTop10Failure.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var i = 0;
				data.forEach(function(item){
					myObject[i] = item;
					i++;
				});
				//console.log(myObject);
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
			});
		};

		$scope.getFailedPassedByDate = function () {


			function doQuery() {
				var d = $q.defer();
				var result = GetFailedPassedByDate.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var passedDate = [];
				var failedDate = [];
				var i = 0;
				var runDate = '';
				var passPercentage = 0;
				data.forEach(function(item){
					myObject[i] = item;
					myObject[i].No = i;
					//runDate =item._id.year + '-';
					runDate = runDate + item._id.month;
					//runDate = runDate + '-';
					runDate = runDate + item._id.day;

					passPercentage = ((item.totalPassed)*100 /(item.totalPassed+item.totalFailed)).toFixed(2);
					var passedItem = [];
					//passedItem[0] = runDate;
					passedItem[0] = i;
					passedItem[1] = passPercentage;
					passedDate[i] = passedItem;

					var failedItem = [];
					//failedItem[0] = runDate;
					failedItem[0] = i;
					failedItem[1] = 100;
					failedDate[i] = failedItem;

					//console.log(passPercentage);
					i++;
				});
				//console.log(passedDate);
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
				$scope.exampleData = [
				 {
				 'key': 'passed',
				 'values': passedDate
				 },
				 {
				 'key': 'failed',
				 'values': failedDate
				 }
				 ];
				$scope.colorFunction = function() {
					return function(d, i) {
						return '#E01B5D'
					};
				};
				$scope.yFunction = function(){
					return function(d){
						return d[1];
					};
				};
				$scope.xFunction = function(){
					return function(d){
						return d[0];
					};
				};
				/*$scope.exampleData = [
				 {
				 'key': 'Series 1',
				 'values': [ [ '20150412' , 1] , [ '1' , 2] ,
				 [ '2' , 3] , [ '3' , 6] ,
				 [ '4' , 5] , [ '5' , 6] ,
				 [ '6' , 8] , [ '7' , 8] ,
				 [ '8' , 9] , [ '9' , 10] ,
				 [ '10' , 11] , [ '11' , 12]]
				 },
				 {
				 'key': 'Series 2',
				 'values': [ [ '20150412' , 12-1] , [ '1' , 12-2] , [ '2' , 12-3] ,
				 [ '3' , 12-6] , [ '4' , 12-5] , [ '5' , 12-6] , [ '6' , 12-8] ,
				 [ '7' , 12-8] , [ '8' , 12-9] , [ '9' , 12-10] , [ '10' , 12-11] ,
				 [ '11' , 12-12]]
				 }
				 ];*/
				console.log($scope.exampleData);
			});



		};

		$scope.getCreatedReport = function () {
			function doQuery() {
				var d = $q.defer();
				var result = GetCreatedReport.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var i = 0;
				data.forEach(function(item){
					myObject[i] = item;
					i++;
				});
				//console.log(myObject);
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
			});

		};

		// Create new Reporting
		$scope.create = function() {
			// Create new Reporting object
			var reporting = new Reportings ({
				name: this.name
			});

			// Redirect after save
			reporting.$save(function(response) {
				$location.path('reportings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Reporting
		$scope.remove = function(reporting) {
			if ( reporting ) {
				reporting.$remove();

				for (var i in $scope.reportings) {
					if ($scope.reportings [i] === reporting) {
						$scope.reportings.splice(i, 1);
					}
				}
			} else {
				$scope.reporting.$remove(function() {
					$location.path('reportings');
				});
			}
		};

		// Update existing Reporting
		$scope.update = function() {
			var reporting = $scope.reporting;

			reporting.$update(function() {
				$location.path('reportings/' + reporting._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Reportings
		$scope.find = function() {
			$scope.reportings = Reportings.query();

		};
		$scope.getFailedPUS = function () {

				function doQuery() {
					var d = $q.defer();
					var result = GetFPUS.query(function() {
						d.resolve(result);
					});
					return d.promise;
				}
				$q.all(doQuery()).then(function(data) {
					var myObject = [];
					var i = 0;
					data.forEach(function(item){
						myObject[i] = item;
						i++;
					});
					$scope.rowCollection = myObject;
					$scope.displayedCollection = [].concat($scope.rowCollection);
				});

		};
		$scope.getFailedPassedList = function () {

			function doQuery() {
				var d = $q.defer();
				var result = GetFailedPassedList.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var i = 0;
				data.forEach(function(item){
					myObject[i] = item;
					i++;
				});
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
			});

		};
		// Find a list of Reportings
		$scope.findUsers = function() {
			$scope.reportings = Reportings.query();
		};


		// Find existing Reporting
		$scope.findOne = function() {
			$scope.reporting = Reportings.get({
				reportingId: $stateParams.reportingId
			});
		};

		$scope.teamReport = function(){
			function doQuery() {
				var d = $q.defer();
				var result = GetTeamReport.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			//[{"team":"Tiger","values":[6,6,0]},
			// {"team":"Lion","values":[13,1,0]},
			// {"team":"Eagle","values":[8,3,0]},
			// {"team":"Deer","values":[12,2,0]}]
			$q.all(doQuery()).then(function(data) {
				var tigerPassed,tigerFailed,tigerNotRun,
					lionPassed,lionFailed,lionNotRun,
					eaglePassed,eagleFailed,eagleNotRun,
					deerPassed,deerFailed,deerNotRun,
					tigerTotal,lionTotal,eagleTotal,deerTotal;

				for (var i= 0; i< data.length; i++){
				//data.forEach(function(item){
					//console.log(item);
					switch (data[i].team) {
						case 'Tiger':
							tigerPassed = data[i].values[0];
							tigerFailed = data[i].values[1];
							tigerNotRun = data[i].values[2];
							tigerTotal = data[i].values[0] + data[i].values[1];
							tigerTotal += data[i].values[2];
							break;
						case 'Lion':
							lionPassed = data[i].values[0];
							lionFailed = data[i].values[1];
							lionNotRun = data[i].values[2];
							lionTotal = data[i].values[0] + data[i].values[1];
							lionTotal += data[i].values[2];
							break;
						case 'Eagle':
							eaglePassed = data[i].values[0];
							eagleFailed = data[i].values[1];
							eagleNotRun = data[i].values[2];
							eagleTotal = data[i].values[0] + data[i].values[1];
							eagleTotal += data[i].values[2];
							break;
						case 'Deer':
							deerPassed = data[i].values[0];
							deerFailed = data[i].values[1];
							deerNotRun = data[i].values[2];
							deerTotal = data[i].values[0] + data[i].values[1];
							deerTotal += data[i].values[2];
							break;
					}
				}
				var teamBarData = [];
				teamBarData[0] = {'key': 'Not run','values':[['Lion', lionNotRun],['Tiger',tigerNotRun],
					['Eagle',eagleNotRun],['Deer',deerNotRun]]};
				teamBarData[1] = {'key': 'Passed','values':[['Lion', lionPassed],['Tiger',tigerPassed],
															['Eagle',eaglePassed],['Deer',deerPassed]]};
				teamBarData[2] = {'key': 'Failed','values':[['Lion', lionFailed],['Tiger',tigerFailed],
					['Eagle',eagleFailed],['Deer',deerFailed]]};

				teamBarData[3] = {'key': 'Total','values':[['Lion', lionTotal],['Tiger',tigerTotal],
					['Eagle',eagleTotal],['Deer',deerTotal]]};
				$scope.teamData = teamBarData;
				//console.log(teamBarData);
			});
			var colorArray = ['#A5A5A5', '#5B9BD5', '#ED7D31', '#FFC000'];
			$scope.colorFunction = function() {
				return function(d, i) {
					return colorArray[i];
				};
			};

			$scope.toolTipContent = function(){
				return function(key, x, y, e, graph) {
					return  'Super New Tooltip' +
						'<h1>' + key + '</h1>' +
						'<p>' +  y + ' at ' + x + '</p>';
				};
			};
			$scope.xFunction = function(){
				return function(d) {
					return d.key;
				};
			};
			$scope.yFunction = function(){
				return function(d) {
					return d.y;
				};
			};
			var format = d3.format('d');
			$scope.valueFormatFunction = function(){
				return function(d){
					return format(d);
				};
			};
			/*$scope.teamData = [
				{
					'key': 'Passed',
					'values': [ [ 'Lion' , 2] , [ 'Tiger' , 1] , [ 'Eagle' , 1] , [ 'Deer' , 6]]},
				{
					'key': 'Failed',
					'values': [ [ 'Lion' , 3] , [ 'Tiger' , 2] , [ 'Eagle' , 2] , [ 'Deer' , 5]]},
				{
					'key': 'Not run',
					'values': [ [ 'Lion' , 5] , [ 'Tiger' , 3] , [ 'Eagle' , 5] , [ 'Deer' , 4]]},
				{
					'key': 'Total',
					'values': [ [ 'Lion' , 10] , [ 'Tiger' , 7] , [ 'Eagle' , 8] , [ 'Deer' , 21]]}
			];*/
		};
		$scope.ProgressReport = function(){
			function doQuery() {
				var d = $q.defer();
				var result = GetCreatedByDate.query(function() {
					d.resolve(result);
				});
				return d.promise;
			}
			$q.all(doQuery()).then(function(data) {
				var myObject = [];
				var i = 0;
				data.forEach(function(item){
					myObject[i] = item;
					i++;
				});
				$scope.rowCollection = myObject;
				$scope.displayedCollection = [].concat($scope.rowCollection);
			});
			/*$scope.exampleData = [
				        {
					             'key': 'Series 1',
				             'values': [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] ,
								 [ 1030766400000 , 3] , [ 1033358400000 , 4] ,
								 [ 1036040400000 , 5] , [ 1038632400000 , 6] , [ 1041310800000 , 8] ,
								 [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] ,
								 [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] ,
								 [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] ,
								 [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] ,
								 [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] ,
								 [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] ,
								 [ 1075525200000 , 26.743156781239] , [ 1078030800000 , 29.597478802228] ,
								 [ 1080709200000 , 30.831697585341] , [ 1083297600000 , 28.054068024708] ,
								 [ 1085976000000 , 29.294079423832] , [ 1088568000000 , 30.269264061274] ,
								 [ 1091246400000 , 24.934526898906] , [ 1093924800000 , 24.265982759406] ,
								 [ 1096516800000 , 27.217794897473] , [ 1099195200000 , 30.802601992077] ,
								 [ 1101790800000 , 36.331003758254] , [ 1104469200000 , 43.142498700060] ,
								 [ 1107147600000 , 40.558263931958] , [ 1109566800000 , 42.543622385800] ,
								 [ 1112245200000 , 41.683584710331] , [ 1114833600000 , 36.375367302328] ,
								 [ 1117512000000 , 40.719688980730] , [ 1120104000000 , 43.897963036919] ,
								 [ 1122782400000 , 49.797033975368] , [ 1125460800000 , 47.085993935989] ,
								 [ 1128052800000 , 46.601972859745] , [ 1130734800000 , 41.567784572762] ,
								 [ 1133326800000 , 47.296923737245] , [ 1136005200000 , 47.642969612080] ,
								 [ 1138683600000 , 50.781515820954] , [ 1141102800000 , 52.600229204305] ,
								 [ 1143781200000 , 55.599684490628] , [ 1146369600000 , 57.920388436633] ,
								 [ 1149048000000 , 53.503593218971] , [ 1151640000000 , 53.522973979964] ,
								 [ 1154318400000 , 49.846822298548] , [ 1156996800000 , 54.721341614650] ,
								 [ 1159588800000 , 58.186236223191] , [ 1162270800000 , 63.908065540997] ,
								 [ 1164862800000 , 69.767285129367] , [ 1167541200000 , 72.534013373592] ,
								 [ 1170219600000 , 77.991819436573] , [ 1172638800000 , 78.143584404990] ,
								 [ 1175313600000 , 83.702398665233] , [ 1177905600000 , 91.140859312418] ,
								 [ 1180584000000 , 98.590960607028] , [ 1183176000000 , 96.245634754228] ,
								 [ 1185854400000 , 92.326364432615] , [ 1188532800000 , 97.068765332230] ,
								 [ 1191124800000 , 105.81025556260] , [ 1193803200000 , 114.38348777791] ,
								 [ 1196398800000 , 103.59604949810] , [ 1199077200000 , 101.72488429307] ,
								 [ 1201755600000 , 89.840147735028] , [ 1204261200000 , 86.963597532664] ,
								 [ 1206936000000 , 84.075505208491] , [ 1209528000000 , 93.170105645831] ,
								 [ 1212206400000 , 103.62838083121] , [ 1214798400000 , 87.458241365091] ,
								 [ 1217476800000 , 85.808374141319] , [ 1220155200000 , 93.158054469193] ,
								 [ 1222747200000 , 65.973252382360] , [ 1225425600000 , 44.580686638224] ,
								 [ 1228021200000 , 36.418977140128] , [ 1230699600000 , 38.727678144761] ,
								 [ 1233378000000 , 36.692674173387] , [ 1235797200000 , 30.033022809480] ,
								 [ 1238472000000 , 36.707532162718] , [ 1241064000000 , 52.191457688389] ,
								 [ 1243742400000 , 56.357883979735] , [ 1246334400000 , 57.629002180305] ,
								 [ 1249012800000 , 66.650985790166] , [ 1251691200000 , 70.839243432186] ,
								 [ 1254283200000 , 78.731998491499] , [ 1256961600000 , 72.375528540349] ,
								 [ 1259557200000 , 81.738387881630] , [ 1262235600000 , 87.539792394232] ,
								 [ 1264914000000 , 84.320762662273] , [ 1267333200000 , 90.621278391889] ,
								 [ 1270008000000 , 102.47144881651] , [ 1272600000000 , 102.79320353429] ,
								 [ 1275278400000 , 90.529736050479] , [ 1277870400000 , 76.580859994531] ,
								 [ 1280548800000 , 86.548979376972] , [ 1283227200000 , 81.879653334089] ,
								 [ 1285819200000 , 101.72550015956] , [ 1288497600000 , 107.97964852260] ,
								 [ 1291093200000 , 106.16240630785] , [ 1293771600000 , 114.84268599533] ,
								 [ 1296450000000 , 121.60793322282] , [ 1298869200000 , 133.41437346605] ,
								 [ 1301544000000 , 125.46646042904] , [ 1304136000000 , 129.76784954301] ,
								 [ 1306814400000 , 128.15798861044] , [ 1309406400000 , 121.92388706072] ,
								 [ 1312084800000 , 116.70036100870] , [ 1314763200000 , 88.367701837033] ,
								 [ 1317355200000 , 59.159665765725] , [ 1320033600000 , 79.793568139753] ,
								 [ 1322629200000 , 75.903834028417] , [ 1325307600000 , 72.704218209157] ,
								 [ 1327986000000 , 84.936990804097] , [ 1330491600000 , 93.388148670744]]
			        }
		    ];*/
		};
	}
]);
