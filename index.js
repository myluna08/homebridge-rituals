'use strict';

const request = require('request');
const version = require('./package.json').version;

let Service;
let Characteristic;
let logger;

var on_state = false;
var fan_speed = 1;

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
  this.token = config.token;
  this.hash = config.hash;
  
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
		this.log('** Discover');
	},
	
	setActiveState: function(active, callback){
		this.log('parse value %s', active)
		on_state = on_state == true ? false : true;
		this.log('setting Active state to ' + on_state);
		callback(undefined, on_state);
	},
	
	setFanSpeed: function(value, callback){
		this.log('setting Fan Rotator at %s', value);
		fan_speed = 1;
		callback(null, fan_speed);
	},
		
	identify: function (callback) {
		callback();
	},

	getServices: function () {
		return this.services;
	},
	
	_doRequest: function (methodName, url, httpMethod, urlName, callback, successCallback) {
        if (!url) {
            this.log('Ignoring ' + methodName + '() request, [' + urlName + '] is not defined!');
            callback(new Error('No [' + urlName + '] defined!'));
            return;
        }
        request({
            url: url,
            body: '',
            method: httpMethod,
            rejectUnauthorized: false
        },
        function (error, response, body) {
            if (error) {
                this.log(methodName + '() failed: %s', error.message);
                callback(error);
            }
            else if (response.statusCode !== 200) {
                this.log(methodName + '() returned http error: %s', response.statusCode);
                callback(new Error('Got http error code ' + response.statusCode));
            }
            else {
                successCallback(body);
            }
        }.bind(this));
    }
};
