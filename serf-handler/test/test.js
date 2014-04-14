var haproxyHandler = require("../haproxy-handler");
//var chai = require("chai");
//chai.config.includeStack = true;
//var assert = chai.assert;
var assert = require("assert");

haproxyHandler.config.serverFile = process.cwd() + "/web-servers";
haproxyHandler.config.haTemplate = process.cwd() + "../../../haproxy.cfg.template";
haproxyHandler.config.haConf = process.cwd() + "/haproxy.cfg.test";

describe('haproxyHandler test', function(){
	it('should add members', function(done){
	  haproxyHandler.addMember({name: "test1", address: "10.0.0.1"})
	  haproxyHandler.addMember({name: "test2", address: "10.0.0.2"}, done);
	  
	});

	it('should delete server file', function(){
	  haproxyHandler.reset();
	});
})
