var fs = require('fs');
var path = require('path');
var lazy = require("lazy");
var _ = require("underscore");
var sys = require('sys')
var exec = require('child_process').exec;

var config = {
	serverFile: "/tmp/web-servers",
	haTemplate: "/etc/haproxy/haproxy.cfg.template",
	haConf: "/etc/haproxy/haproxy.cfg",
	restartCmd: "service haproxy reload"
}

exports.config = config;

exports.reset = function() {
	fs.exists(config.serverFile, function (exists) {
		if(exists) {
			console.log("Deleting %s", config.serverFile);
			fs.unlinkSync(config.serverFile)
		}
	});
};

exports.addMember = function(member, callback) {
	//console.log("writing to %s", path.normalize(config.serverFile));
	fs.appendFileSync(config.serverFile, JSON.stringify(member) + "\n");
	var servers = [];
	new lazy(fs.createReadStream(config.serverFile))
		.lines
		.forEach(function(line){
			servers.push(JSON.parse(line.toString()));			
		}).on('pipe', function() {
			// all done
			//console.log("template %s", path.normalize(config.haTemplate));
			var templateData = fs.readFileSync(path.normalize(config.haTemplate)).toString();
			var compiled = _.template(templateData);
			var newConfig = compiled({"servers": servers});
			//console.log(newConfig);
			var wstream = fs.createWriteStream(config.haConf);
			wstream.write(newConfig);
			wstream.end();
			console.log("Updated haproxy config.");
			function puts(error, stdout, stderr) { 
				sys.puts(stdout);
				if(callback) {
					callback();
				}
			}
			exec(config.restartCmd, puts);
			
		});
};

exports.removeMember = function(member) {

};