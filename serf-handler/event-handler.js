#!/usr/bin/env node
var handler = require("serf-event-handler");
var haproxyHandler = require("./haproxy-handler");

handler
	.register("lb")
	.event("member-join",function(payload) {
		console.log("LB - Got member-join event..");
		if(payload.role == "web") {
			haproxyHandler.addMember(payload);
			console.log("Adding service to lb, name: %s, address: %s ", payload.name, payload.address);				
		}
		if(payload.role == "lb") {
			haproxyHandler.reset();
			console.log("Reset LB");			
		}
	})
	.event("member-failed, member-leave", function(payload) {
		console.log("LB - Got failed/leave event..");
		if(payload.role == "web") {
			haproxyHandler.removeMember(payload);
			console.log("Removed member from lb: " + payload.name);		
		}
	});
	
handler
	.register("web")
	.event("deploy", function(payload) {
		console.log("WEB - Got deploy event..");
	})
	.event("member-join", function(payload) {
		console.log("WEB - Got member join event..");
		if(payload.role == "logger") {
			//Add logger ..
		}
	})
	.event("member-failed, member-leave", function(payload) {
		console.log("WEB - Got failed/leave event..");
		if(payload.role == "logger") {
			// Remove logger..	
		}
	});	
	
handler
	.register("forwarder")
	.event("member-join", function(payload) {
		console.log("FORWARDER - Got member join event..");
		if(payload.role == "logger") {
			//Start forwarder ..
		}
	})
	.event("member-failed, member-leave", function(payload) {
		console.log("FORWARDER - Got failed/leave event..");
		if(payload.role == "logger") {
			// Stop forwarder ..	
		}
	});

handler.handle();