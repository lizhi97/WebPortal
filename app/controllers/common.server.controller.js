/**
 * Created by Joe on 3/28/15.
 */
'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ldmscomponent = mongoose.model('Ldmscomponent'),
	Teammember = mongoose.model('Teammember'),
	PusManagement = mongoose.model('PusManagement'),
	detailed_log = mongoose.model('detailed_log'),
	_ = require('lodash'),
	http = require('http');
/**
 * Get teams
 * @param req
 * @param res
 * @returns {*}
 */
exports.getTeams = function(req, res) {
	var teams = ['Tiger','Lion','Eagle','Deer'];
	res.json(teams);
};
exports.getComponents = function(req, res) {
	Ldmscomponent.find().sort('-created').select({ 'name': 1, '_id': 0}).exec(function (err, ldmscomponents) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var arr = [];
			for (var i = 0; i < ldmscomponents.length; i++){
				arr[i] = ldmscomponents[i].get('name');
			}
			res.jsonp(arr.sort());


		}
	});
};

exports.getTeamNames = function(req, res) {
	Teammember.find().sort('-created').select({ 'name': 1, '_id': 0}).exec(function(err, teammembers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var arr = [];
			for (var i = 0; i < teammembers.length; i++){
				arr[i] = teammembers[i].get('name');
			}
			res.jsonp(arr.sort());


		}
	});
};
function process_delete_log(fn){
	PusManagement.aggregate([
		{ $unwind: '$run_log'},
		{$group : {
			_id: {
				id: '$_id',
				hour : { $hour : '$run_log.runDate'},
				run_id: '$run_log._id',
				name: '$name'
			}
			}
		}
	]).exec(function(err,Nums){
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
		} else {
			var deleteID = {};
			var j = 0;
			for (var i = 0; i < Nums.length; i++) {
				var hour = (Nums[i]._id.hour +8) % 24;
				if (hour >= 8) {
					if (hour < 21) {
						deleteID = {'id': Nums[i]._id.id, 'hour': hour, 'run_id': Nums[i]._id.run_id, 'name':Nums[i]._id.name};
						fn(deleteID);
					}
				}

			}
		}
	});
}
function deteleteManualRunLog() {
	process_delete_log(function (delRecord) {
		PusManagement.update(
			{_id: delRecord.id},
			{$pull: {run_log: {_id: delRecord.run_id}}},
			function (errUpdate, val) {

			});


		//res.jsonp(deleteIDs);

	});
}

function getTeamNames(team, fn){
	Teammember.aggregate([
		{$match :{ team : team }},
		{ $project : { _id: 0 , name : 1 } }
	]).exec(function(err,Nums){
		if (err) {
			return errorHandler.getErrorMessage(err);
		} else {
			var names = [];
			for (var i = 0 ; i < Nums.length; i++){
				names[i] = Nums[i].name;
			}
			fn(names);
		}
	});
}

function getTeamData(team, status, fn){
	getTeamNames(team, function(Names){
		PusManagement.aggregate([
			{ $match : {
				$and:[
					{creator: {$in: Names}},
					{PUSStatus: {$eq: status}}
				]
			}
			},
			{$group: {_id: null, count: {$sum:1}}}
		]).exec(function(err,Nums){
			if (err) {
				return errorHandler.getErrorMessage(err);
			} else {
				//console.log(Nums[0].count);
				if(Nums.length === 1) {
					fn(Nums[0].count);
				}else{
					fn(0);
				}
			}
		});
	});

}

/*function getTeamData(team, status, fn){
	PusManagement.aggregate([
		{ $match : {
			$and:[
				{team: {$eq: team}},
				{PUSStatus: {$eq: status}}
			]
		}
		},
		{$group: {_id: null, count: {$sum:1}}}
	]).exec(function(err,Nums){
		if (err) {
			return errorHandler.getErrorMessage(err);
		} else {
			//console.log(Nums[0].count);
			if(Nums.length === 1) {
				fn(Nums[0].count);
			}else{
				fn(0);
			}
		}
	});
}*/

function getTeamStatusData(team, fn){
	getTeamData(team,'Success',function(teamPassed){
		getTeamData(team,'Failure',function(teamFailed){
			getTeamData(team,'',function(teamNotrun){
				var teamData= [];
				teamData[0] = teamPassed;
				teamData[1] = teamFailed;
				teamData[2] = teamNotrun;
				//console.log(teamData);
				fn(teamData);
				//res.jsonp(teamData);
			});
		});
});
}
exports.getTeamReport = function(req, res) {
	var teamData = [];
	getTeamStatusData('Tiger', function(tigerTeamData){
		var tigerData = {'team':'Tiger', 'values':tigerTeamData};
		teamData[0] = tigerData;
		getTeamStatusData('Lion', function(LionTeamData) {
			var LionData = {'team': 'Lion', 'values': LionTeamData};
			teamData[1] = LionData;
			getTeamStatusData('Eagle', function (EagleTeamData) {
				var EagleData = {'team': 'Eagle', 'values': EagleTeamData};
				teamData[2] = EagleData;
				getTeamStatusData('Deer', function (DeerTeamData) {
					var DeerData = {'team': 'Deer', 'values': DeerTeamData};
					teamData[3] = DeerData;
					res.jsonp(teamData);
				});
			});
		});
	});
};
exports.getCreatedReport = function(req,res){
	PusManagement.aggregate([
		{
			$group:
			{
				_id: {creator: '$creator'},
				count: {$sum: 1}
			}
		},
		{
			$sort:{'count': -1}
		}
	]).exec(function(err,Nums){
		if (err) {
			return errorHandler.getErrorMessage(err);
		} else {
			res.jsonp(Nums);
		}
	});
};

exports.getFailurePassedByeDate = function(req,res){
	PusManagement.aggregate([
		{ $unwind: '$run_log'},
		{$group : {
			_id: {
				year : { $year : '$run_log.runDate' },
				month : { $month : '$run_log.runDate' },
				day : { $dayOfMonth : '$run_log.runDate' }
			},
			totalFailed:
			{$sum: {
				$cond: [{$eq: ['$run_log.status','Failure']},1,0]}
			},
			totalPassed:
			{$sum: {
				$cond: [{$eq: ['$run_log.status','Success']},1,0]}
			}
		}},
		{ $sort: {_id: 1}}
	]).exec(function(err,Nums){
		if (err) {
			res.jsonp(errorHandler.getErrorMessage(err));
		} else {
			res.jsonp(Nums);
		}
	});
};
exports.getCreatedByMonth = function(req,res){
	PusManagement.aggregate([
		{$group : {
			_id: {
				year : { $year : '$created' },
				month : { $month : '$created' }
			},
			count: { $sum: 1 }
		}},
		{ $sort: {_id: -1}}
	]).exec(function(err,Nums){
		if (err) {
			res.json(errorHandler.getErrorMessage(err));
		} else {
			res.jsonp(Nums);
		}
	});
};
exports.getCreatedByDate = function(req, res){
	PusManagement.aggregate([
		{$group : {
			_id: {
				year : { $year : '$created' },
				month : { $month : '$created' },
				day : { $dayOfMonth : '$created' }
			},
			count: { $sum: 1 }
		}},
		{ $sort: {_id: -1}}
	]).exec(function(err,Nums){
		if (err) {
			res.json(errorHandler.getErrorMessage(err));
		} else {
			res.jsonp(Nums);
		}
	});
};
exports.testRead = function(req, res){
	var str = req.param('c');
	//var str = "How are you doing today?";
	var qFiled = str.split('_');
	//http://172.29.40.58:3000/PUS-tests?c=Lion_LD96_AMT_PUS

	PusManagement.find().sort('name')
		.where('team').equals(qFiled[0])
		.where('branch').equals(qFiled[1])
		.where('component').equals(qFiled[2])
		.where('testType').equals(qFiled[3])
		.where('disableToRun').equals(0)
		.populate('user', 'displayName').exec(function(err, pusManagement) {
		if (err) return res.send(err);
		if (! pusManagement) return res.send(new Error('Failed to load Pus tests ' + str));
		//req.pusManagement = pusManagement ;

		var arr='';
		for (var i = 0; i < pusManagement.length; i++){
			//if(i === 0) arr='\"';
			arr = arr.concat(pusManagement[i].get('name'));
			if (i < pusManagement.length-1) {
				arr = arr.concat(' ');
			}
			// else{
			//	arr= arr.concat('\"');
			//}
		}
		res.send(arr);
		//res.send(pusManagement);
	});
};
exports.getAllLogs = function(req,res) {
	deteleteManualRunLog(); //deleted manual log
	PusManagement.find().populate('user', 'displayName').exec(function (err, pusManagement) {
		if (err) return res.send(err);
		if (!pusManagement) return res.send(new Error('Failed to load Pus tests '));
		//http://localhost:3000/Process_log?PUS_name=RebootSettings_PUS_Changesettings_001.table&container=Tiger_LD96_RebootSettings_PUS
		var coll = pusManagement.slice(0); // clone collection
		var i = 0;
		(function processOne() {
			var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
			try {
				var url = 'http://localhost:3000/Process_log?PUS_name='
					.concat(record.get('name')).concat('&container=')
					.concat(record.get('team'))
					.concat('_')
					.concat(record.get('branch'))
					.concat('_').concat(record.get('component'))
					.concat('_').concat(record.get('testType'));
				var request = require('request');
				request(url, function (error, response, body) {
					if (!error && response.statusCode === 200) {
						//res.send('Done');
						console.log(body);
					} else {
						//res.send('Failed' + url);
						console.log('Fail:' + url);
					}
					if (coll.length === 0) {
						res.send('OK');
					} else {
						processOne();
					}
				});

			} catch (exception) {
				res.send(exception);
			}
		})();
	});
};
exports.getLatestFailedTests = function(req, res) {
	PusManagement.find().select({ 'name': 1, 'team': 1,'creator' :1,'component':1,
		'PUSStatus':1,'SUTHost':1,'created':1,'_id':1}).where('PUSStatus').equals('Failure').sort('-created').populate('user', 'displayName').exec(function(err, pusManagements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pusManagements);
		}
	});
};

var sort_by = function(field, reverse, primer){
	var key = primer ? function(x) {
		return primer(x[field]);
	} : function(x) {
		return x[field];
	};
	reverse = !reverse ? 1 : -1;
	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	};
};
function processCollection(collection, callback) {
	var coll = collection.slice(0); // clone collection
	var myObject = [];
	var i = 0;
	(function processOne() {
		var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
		try {
			var logs = [];
			logs = record.run_log;
			logs.sort(sort_by('runDate', false, function (a) {
				return new Date(a);
			}));
			record.run_log = logs.pop();
			if((record.run_log[0].status) === 'Failure') {
				myObject[i] = record;
				i++;
			}

			if (coll.length === 0) {
					callback(myObject);
			} else {
					processOne();
			}

		} catch (exception) {
			callback(exception);
		}
	})();
}
exports.getTop10Failure = function(req,res){
	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-31);
	console.log(cutoff);
	PusManagement.aggregate([
		{ $unwind: '$run_log'},
		{
			$group: {
				_id: {
					name:'$name',
					creator: '$creator',
					team: '$team'
				},
				totalFailed:
				{$sum: {
					$cond: [{$and :[{$eq: ['$run_log.status','Failure']},
									 {$gt: ['$run_log.runDate',cutoff]}
							]},
							1,0]}
				}
			}
		},
		{ $sort: {totalFailed: -1}
		},
		{ $limit: 10}
	],function(Err, top10FailedPUS) {
		if (Err) res.send(Err);
		res.send(top10FailedPUS);

		});
};

exports.getFailurePassedList = function(req,res){
	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-31);
	console.log(cutoff);
	PusManagement.aggregate([
		{ $unwind: '$run_log'},
		{
			$group: {
				_id: {
					name:'$name',
					creator: '$creator',
					team: '$team'
				},
				totalFailed:
				{$sum: {
					$cond: [{$eq: ['$run_log.status','Failure']},1,0]}
				},
				totalPassed:
				{$sum: {
					$cond: [{$eq: ['$run_log.status','Success']},1,0]}
				}
			}
		},
		{ $sort: {totalFailed: -1}
		}
	],function(Err, FailurePassed) {
		if (Err) res.send(Err);
		res.send(FailurePassed);

	});
};

exports.getFinishedFailedPUS = function(req, res){
	PusManagement.aggregate([{$match: { runStatus: 0}},
		{$group: {_id: null, count: { $sum: 1 }}}], function(notRunErr, notRunPUS) {
		if (notRunErr) res.send(notRunErr);
		var getData = [];
		var notRunCount = 0;
		if (notRunPUS === undefined || notRunPUS.length === 0) {
			notRunCount = 0;
		} else {
			notRunCount = notRunPUS[0].count;
		}
		getData[0] = notRunCount;
		PusManagement.aggregate([{ $match : { PUSStatus : 'Failure'}},
			{ $group: {_id: null, count: { $sum: 1  }}}], function (err, failedPUS) {
			if (err) res.send(err);

			var failedCount = 0;
			if(failedPUS === undefined || failedPUS.length === 0){
				failedCount = 0;
			} else {
				failedCount = failedPUS[0].count;
			}
			getData[1] = failedCount;
			//get all finished count
			PusManagement.aggregate([{ $group: {_id: null, count: { $sum: 1  }}}], function (allErr, allPUS) {
				if (allErr) res.send(allErr);
				var allCount = 0;
				if (allPUS === undefined || allPUS.length === 0) {
					allCount = 0;
				} else {
					allCount = allPUS[0].count;
				}
				getData[2] = allCount;
				res.json(getData);
			});

		});
	});
};
exports.getFinishedAllPUS = function(req, res){
	//get all finished count

	PusManagement.aggregate([{ $group: {_id: null, count: { $sum: 1  }}}], function (allErr, allPUS) {
		if (allErr) res.send(allErr);
		var getData = [];
		var allCount = 0;
		if (allPUS === undefined || allPUS.length === 0) {
			allCount = 0;
		} else {
			allCount = allPUS[0].count;
		}
		getData[0] = allCount;
		Ldmscomponent.aggregate([{ $group: {_id: null, count: {$sum: '$totalTests'}}}],function (ldmsErr, ldmsTests) {
			if(ldmsErr) res.send(ldmsErr);
			var ldmsCount = 0;
			//console.log(ldmsTests);
			if(ldmsTests === undefined || ldmsTests.length === 0){
				ldmsCount = 0;
			}else{
				ldmsCount = ldmsTests[0].count;
			}
			getData[1] = ldmsCount;
			res.send(getData);
		});

	});

};
exports.getSumary = function(req,res){
	//1. get component, finished count from pusmanagements
	//2. loop this, get failure count
	//3. get total PUS amount
	PusManagement.aggregate([{ $group: {_id: '$component', count: { $sum: 1  }}}], function (err, result) {
		if (err) res.send(err);
		var coll = result.slice(0); // clone collection
		var myObject = [];
		var i = 0;
		(function processOne() {
			var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
			try {
					var componentName = record._id;
					var oneRecord = {};
					oneRecord.Component = componentName;
					oneRecord.FinishedCount = record.count/10.0;
					var finishedCount = record.count;
					PusManagement.aggregate([{ $match : { PUSStatus : 'Failure',component:componentName}},
						{ $group: {_id: '$component', count: { $sum: 1  }}}], function (failureErr, failedPUS) {
						if (err) res.send(failureErr);
						var failedCount = 0;
						if(failedPUS === undefined || failedPUS.length === 0){
							failedCount = 0;
						} else {
							failedCount = failedPUS[0].count;
							//console.log(failedCount);
						}
						oneRecord.failedCount = failedCount/10.0;
						//get count from LDMSComponent
						Ldmscomponent.findOne().where('name').equals(componentName).select({'totalTests': 1})
							.exec(function (FetchPusErr, ComponentPUS) {
								if (FetchPusErr) return res.send(FetchPusErr);
								if (!ComponentPUS) return res.send(new Error('Failed to load Pus tests ' + ComponentPUS));
								oneRecord.totalPUS = ComponentPUS.totalTests/10.0;
								myObject[i] = oneRecord;
								i++;
								if (coll.length === 0) {
									res.json(myObject);
								} else {
									processOne();
								}
							});
					});
			} catch (exception) {
				res.send(new Error('Failed to load Pus tests '));
			}
		})();
	});
};



/*exports.getLatestFailedTests = function(req, res) {
	PusManagement.find().sort('component').populate('user', 'displayName').exec(function (err, pusManagements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			processCollection(pusManagements, function (FailedPUS) {
				res.jsonp(FailedPUS);
			});

		}
	});
};
*/

/*exports.getLatestFailedTests = function(req, res) {
	//1. get all PUS
	//		2.	for one PUS
	//		3. check the last run_log, if status is 'Failure'. push the PUS to Object.
	PusManagement.find().sort('component').populate('user', 'displayName').exec(function (err, pusManagements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var myObject = [];
			var i = 0;
			(pusManagements).forEach(function(item) {
				var logs = [];
				logs = item.run_log;
				logs.sort(sort_by('runDate', false, function (a) {
					return new Date(a);
				}));
				item.run_log=logs.pop();
				if((item.run_log[0].status) === 'Failure') {
					myObject[i] = item;
					i++;
				}
			});
			res.jsonp(myObject);
		}
	});
};
*/

	/*PusManagement.find().populate({
		path: 'run_log',
		match: {status: 'Failure'},
		select: 'runDate',
		options: { limit:1, sort: 'runDate'}

	}).exec(function (err, pusManagement) {
		if (err) return res.send(err);
		if (!pusManagement) return res.send(new Error('Failed to load Pus tests '));
		res.send(pusManagement);
	});
};*/
//http://localhost:3000/getRunlogDetailed?logPath=20150331_205104.953/LogFile.txt
exports.getRunlogDetailed = function(req,res) {
	var logPath = req.param('logPath');
	detailed_log.findOne().where('logFilePath').equals(logPath).select({'content': 1})
		.exec(function (FetchPusErr, logContent) {
			if (FetchPusErr) return res.send(FetchPusErr);
			if (!logContent) return res.send(new Error('Failed to load Pus tests ' + logPath));
			var fileContent = (logContent.content).replace('\t','||');
			fileContent = (logContent.content).replace('\n','<br>');
			res.contentType = 'text/html';
			res.setHeader('content-type', 'text/javascript');
			res.send(fileContent);
		});
};
/*
 1.	Loop all PUS in database by component
 2.	Find history from the following URL
 http://172.29.40.51:8080/view/<PUS TEAM>Team/job/<contrainer>/ws/<PUS Name>/RunHistory.xml

 From this XML file, We can got the following information.
 Detailed log file location <LogFile>, according to this information, the detailed log information can be gotten.
 PUS run Date
 This tests is failed or sucessful
 Here examples:
 http://172.29.40.51:8080/view/TigerTeam/job/Lion_LD96_SLM_PUS/ws/SLM_NerverUsedProduct_PUS_001/RunHistory.xml

 <?xml version="1.0"?>
 <runHistory script="AMT_PUS_008">
 <run>
 <RunDate>2015-03-31 20:34:34.413 +0800</RunDate>
 <Status>Success</Status>
 <Duration>198.484258</Duration>
 <Errors>0</Errors>
 <Warnings>0</Warnings>
 <Exceptions>0</Exceptions>
 <Successes>1</Successes>
 <LogFile>20150331_203434.413/LogFile.txt</LogFile>
 <ReturnValue></ReturnValue>
 <ErrorMessage></ErrorMessage>
 </run>
 </runHistory>

 3.	Process detailed log file information.

 Here can got the file
 http://172.29.40.51:8080/view/<PUS TEAM>Team/job/<PUS TEAM>_<PUS branch>_<PUS component>_<PUS Type>/ws/<PUS component>_<PUS Name>/<LogFile>

 4.	How to trigger this process
 Joe Li will provided a URL api to trigger this process
 For example: wget http://172.29.40.58:3000/Process_log?PUS_name=$tscript&container=$contrainer
 //res.send(pusManagement._id);
 //http://172.29.40.51:8080/view/<PUS TEAM>Team/job/<contrainer>/ws/<PUS Name>/RunHistory.xml
 //http://localhost:3000/Process_log?PUS_name=SLM_NerverUsedProduct_PUS_001.table&container=Lion_LD96_SLM_PUS
 //http://localhost:3000/Process_log?PUS_name=Tenant_Management_PUS_001.table&container=Deer_LD96_Tenant_PUS
 http://localhost:3000/Process_log?PUS_name=RebootSettings_PUS_Changesettings_001.table&container=Tiger_LD96_RebootSettings_PUS
 */
exports.process_log= function(req, res) {
	var PUSName = req.param('PUS_name');
	if(PUSName.length>0) {
		var PUSNameShortName = PUSName.replace('.table', '').trim();
	}
	var runBuildNo = req.param('BuildNo');
	var container = req.param('container');
	//Get PUS record
	PusManagement.findOne().where('name').equals(PUSName).populate('user', 'displayName').select({'name': 1, 'team': 1})
		.exec(function (FetchPusErr, pusManagement) {
		if (FetchPusErr) return res.send(FetchPusErr);
		if (!pusManagement) return res.send(new Error('Failed to load Pus tests ' + PUSName));
		var baseUrl = 'http://172.29.40.51:8080/view/'.concat(pusManagement.team).concat('Team/job/').concat(container).concat('/ws/')
			.concat(PUSNameShortName).concat('/');
		var runHistory = baseUrl.concat('RunHistory.xml');
		var request = require('request');
		request(runHistory, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				var parseString = require('xml2js').parseString;
				parseString(body, function (parseStringErr, result) {
					var runString = result.runHistory.run[0], RunDate = runString.RunDate[0], Status = runString.Status[0],
						Duration = runString.Duration[0], Errors = runString.Errors[0], Warnings = runString.Warnings[0],
						Exceptions = runString.Exceptions[0], Successes = runString.Successes[0], LogFile = runString.LogFile[0],
						ReturnValue = runString.ReturnValue[0], ErrorMessage = runString.ErrorMessage[0],
						detailedUrl = baseUrl.concat(LogFile);
					request(detailedUrl, function (error, response, detailed) {
						if (!error && response.statusCode === 200) {
							//add a record to detailed schema
							var detailed_log_record = new detailed_log();
							detailed_log_record.PUSName = PUSName;
							detailed_log_record.logFilePath = LogFile;
							detailed_log_record.content = detailed;
							detailed_log_record.save(function (errSave, detailed_log_record) {
								var newlogFile_id = detailed_log_record._id;

								/*db.col.aggregate([
									{$match: {_id: 1}}
									{$unwind: '$students'},
									{$match: {'students.name': 'jeff'}},
									{$group: {_id: '$_id', students: {$push: '$students'}}}
								])*/
								PusManagement.aggregate([
									{$match: {'_id':pusManagement._id}},
									{$unwind: '$run_log'},
									{$match: {'run_log.runDate': new Date(RunDate)}},
									{$group: {_id: '$_id', run_log: {$push: '$run_log'}}}
								]).exec(function (FetchPusErr, pus) {
									if (FetchPusErr) return res.send(FetchPusErr);
									if (!pusManagement) return res.send(new Error('Failed to load Pus tests ' + PUSName));
									//console.log(pus.length);
									if (pus.length === 0) {
										PusManagement.findByIdAndUpdate(pusManagement._id, {
												$push: {
													run_log: {
														'runDate': new Date(RunDate),
														'status': Status,
														'runBuildNo': runBuildNo,
														'logFilePath': LogFile,
														'duration': Duration,
														'errorNumbers': Errors,
														'warnings': Warnings,
														'exceptions': Exceptions,
														'successes': Successes,
														'returnValue': ReturnValue,
														'errorMessage': ErrorMessage,
														'logFile': newlogFile_id
													}
												}
											}, {safe: true, new: true}, function (findByIdAndUpdateErr, obj) {
												if (findByIdAndUpdateErr) throw findByIdAndUpdateErr;
												//res.status(200).json(obj);
											}
										);//End of findByIdAndUpdate
										PusManagement.findByIdAndUpdate(pusManagement._id, {PUSStatus: Status, runStatus: 1 },
											{safe: true, new: true}, function (findByIdAndUpdateErr, obj) {
												if (findByIdAndUpdateErr) throw findByIdAndUpdateErr;
												//res.status(200).json(obj);
											});
										res.send('');//OK, end of data process.

										//process errSave of save detailed_log_record
										if (errSave) {
											return res.status(400).send({
												message: errorHandler.getErrorMessage(errSave)
											});
										} // End of processing errSave of save detailed_log_record
									} else { ////End of pus.length === 0
										res.send('data is collected ago!, just skip it');
									}
								});
							});
						}else{
							res.send('Failed get' + detailedUrl);
						}//end of if response.statusCode === 200
					});
				});
			} else{
				PusManagement.findByIdAndUpdate(pusManagement._id, { runStatus: 0, PUSStatus:''},
					{safe: true, new: true}, function (findByIdAndUpdateErr, obj) {
						if (findByIdAndUpdateErr) throw findByIdAndUpdateErr;
						//res.status(200).json(obj);
					});
				res.send('Failed get' + runHistory);
			}//end of if response.statusCode === 200
		});
	});
};
