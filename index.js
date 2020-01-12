'use strict';

const store = require('node-storage');
const reqson = require('request-json');
const version = require('./package.json').version;
const _where = require('./package.json')._where;

var storage = new store(_where+'/node_modules/homebridge-rituals/secrets');

let Service;
let Characteristic;
let logger;

var on_state = storage.get('on_state') || false;
var fan_speed = storage.get('fan_speed') || 1;
var hash = storage.get('hash') || null;
var hub = storage.get('hub') || null;
var hublot = storage.get('hublot') || 'SN000000001';

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-rituals', 'Rituals', RitualsAccessory);
}

function RitualsAccessory(log, config) {
  logger = log;
  
  this.log = log;
  this.services = [];
  this.name = 'Genie';
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
  	.setCharacteristic(Characteristic.SerialNumber, hublot)
  	.setCharacteristic(Characteristic.FirmwareRevision, version)
 
  this.services.push(this.service);
  this.services.push(this.serviceInfo);
  this.discover();
}

RitualsAccessory.prototype = {
	
	discover: function () {
		const that = this;
		this.log('discovering..');
		this.log('npm version: ' + this.version );
		
		hash = storage.get('hash');
		if (hash){
			this.log('hash in storage');
			this.getHub();
		}else{
			this.getHash();
		}
	},
	
	getHash: function(){
		var client = reqson.createClient('https://rituals.sense-company.com/');
		var data = { email: this.account, password: this.password };

		client.post('ocapi/login', data, function(err, res, body) {
			if (err) { logger('login ' + err) }
			if (!err && res.statusCode != 200){
				logger('login invalid status code ' + res.statusCode); 
			}else{ 
				logger('login ' + res.statusCode + ' OK!');
				
				hash = body.account_hash;
				storage.put('hash',hash);
			};
		});
	},
	
	getHub: function(){
		var client = reqson.createClient('https://rituals.sense-company.com/');
		client.get('api/account/hubs/' + hash,function(err, res, body){
			if (err) { logger('hubs ' + err) }
			if (!err && res.statusCode != 200){
				logger('hubs invalid status code ' + res.statusCode); 
			}else{ 
				logger('hubs ' + res.statusCode + ' OK!');
				
				hub = body[0].hub.hash;
				hublot = body[0].hub.hublot;
				on_state = body[0].hub.attributes.fanc;
				fan_speed = body[0].hub.attributes.sppedc;
				
				storage.put('hublot',hublot);
				storage.put('hub',hub);
				storage.put('on_state',on_state);
				storage.put('fan_speed',fan_speed);
			};
		});
	},
	
	setActiveState: function(active, callback){
		this.log('setActivateState setting Active state to ' + active);
		var setValue = active == true ? '1' : '0';
		var onValue = active == true ? true : false;
		var client = reqson.createClient('https://rituals.sense-company.com/');
		var data = { hub: hub, json: { attr: { fanc: setValue } } };

		client.post('api/hub/update/attr', data, function(err, res, body) {
			if (err) { logger('attr ' + err); callback(undefined, on_state); }
			if (!err && res.statusCode != 200){
				logger('attr invalid status code ' + res.statusCode); 
				callback(undefined, on_state);
			}else{ 
				logger('attr ' + res.statusCode + ' OK!');
				storage.put('on_state',onValue);
				on_state = onValue
				callback(undefined, onValue);
			};
		});
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
