'use strict';

const qs = require('qs');
const fm = require('form-data');
const request = require('request');
const version = require('./package.json').version;

let Service;
let Characteristic;
let logger;

var on_state = false;
var fan_speed = 1;
var hash = null;
var hub = null;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-rituals', 'Rituals', RitualsAccessory);
}

function RitualsAccessory(log, config) {
  this.log = log;
  this.services = [];
  this.name = config.name || 'Genie';
  this.account = config.account;
  this.password = config.password;
  
  this.service = new Service.Fan();
  this.service
  	.getCharacteristic(Characteristic.On)
  	.on('get', callback => callback(null, on_state))
  	.on('set', this.setActiveState.bind(this));
  	
  this.service
  	.getCharacteristic(Characteristic.RotationSpeed)
  	.setProps({
        minValue: 1,
        maxValue: 4
      })
  	.on('get', callback => callback(null, fan_speed))
  	.on('set', this.setFanSpeed.bind(this));

  this.serviceInfo = new Service.AccessoryInformation();
  this.serviceInfo
  	.setCharacteristic(Characteristic.Manufacturer, 'Rituals')
  	.setCharacteristic(Characteristic.Model, 'Genie')
  	.setCharacteristic(Characteristic.SerialNumber, 'SN000000001')
  	.setCharacteristic(Characteristic.FirmwareRevision, '1.0.0')
 
  this.services.push(this.service);
  this.services.push(this.serviceInfo);
  this.discover();
}

RitualsAccessory.prototype = {
	
	discover: function () {
		const that = this;
		this.log('** discover do..');
		
		var form = new fm();
		form.append('email',this.account);
		form.append('password',this.password);
		
		let pLogin = new Promise((resolve, reject) =>{
	        request.post({
		      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			  url:   'https://rituals.sense-company.com/ocapi/login',
			  body: form
			}, function(error, response, body){
				if (error) reject(error);
				if (response.statusCode != 200) { reject('Invalid status code ' + response.statusCode); }
				resolve(body);
			});
		});
		
	    pLogin.then(
		function(response) {
		    	this.log('** resolve promise => ' + response);
			var json = JSON.parse(response);
			hash = json.account_hash;
	    }).catch(
	       (reason) => {
		    console.log('** rejected promise ('+reason+')');
	    });
	},
	
	setActiveState: function(active, callback){
		this.log('** setActivateState - hash is => ' + hash);
		this.log('parse value %s', active)
		on_state = on_state == true ? false : true;
		this.log('** setActivateState setting Active state to ' + on_state);
		callback(undefined, on_state);
	},
	
	setFanSpeed: function(value, callback){
		this.log('** setFanSpeed setting Fan Rotator at %s', value);
		fan_speed = 1;
		callback(null, fan_speed);
	},
		
	identify: function (callback) {
		callback();
	},

	getServices: function () {
		return this.services;
	}
	
};


/*RitualsAccessory.prototype.getState = function(callback) {
  this.log("Rituals getting current state...");
  
  request.get({
    url: "https://rituals.sense-company.com/api/account/hubs/"+this.token,
  }, function(err, response, body) {
    
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var state = json.hub.attributes.fanc; // "0" or "1" if is stopped or running
      this.log(" => response is %s", state);
      callback(null, state); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));
}
  
RitualsAccessory.prototype.setState = function(state, callback) {
  var genieState = (state == "0") ? "1" : "0";

  this.log("Set Rituals state to %s", genieState);
  var str = '{"hub": "'+this.hash+'","json": {"attr": {"fanc" : "'+genieState+'"}}}';
  var jsonData = JSON.parse(str);
    
  request.post({
    url: "https://rituals.sense-company.com/api/hub/update/attr",
    qs: { body: jsonData }
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      this.log("Rituals State change complete.");
      
      var json = JSON.parse(body);
      var responseState = json.hub.attributes.fanc; // "0" or "1" if is stopped or running
      
      this.service
        .setCharacteristic(Characteristic.CurrentState, responseState);
      
      callback(null); // success
    }
    else {
      this.log("Error '%s' Genie setting state. Response: %s", err, body);
      callback(err || new Error("Error setting genie state."));
    }
  }.bind(this));
}

RitualsAccessory.prototype.getServices = function() {
  return [this.service];
}*/
