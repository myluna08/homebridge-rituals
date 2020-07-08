'use strict';

const os = require('os');
const path = require('path');
const store = require('node-storage');
const reqson = require('request-json');

const version = require('./package.json').version;
const author = require('./package.json').author.name;
const _where = require('./package.json')._where;
const _loc = require('./package.json')._location;

let Service;
let Characteristic;
let logger;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-rituals', 'Rituals', RitualsAccessory);
}

function RitualsAccessory(log, config) {
  //logger = log;
  this.log = log;
  this.services = [];
  this.hub = config.hub || '';
  var dt = Math.floor(Math.random() * 10000) + 1;

    this.log.debug('RitualsAccesory -> init :: RitualsAccessory(log, config)');

  this.storage = new store( path.join(os.homedir(), ".homebridge") + '/.uix-rituals-secrets_' + this.hub);
  this.user = path.join(os.homedir(), ".homebridge") + '/.uix-rituals-secrets_' + this.hub;
    this.log.debug('RitualsAccesory -> storage path is :: ' + this.user);

  this.on_state;
  this.fan_speed;
  this.account = config.account;
  this.password = config.password;

  this.key = this.storage.get('key') || 0;
    this.log.debug('RitualsAccesory -> key :: ' + this.key);

  this.name =  this.storage.get('name') || config.name || 'Genie';
    this.log.debug('RitualsAccesory -> name :: ' + this.name);

  this.hublot = this.storage.get('hublot') || 'SN_RND' + dt;
    this.log.debug('RitualsAccesory -> hublot :: ' + this.hublot);

  this.version = this.storage.get('version') || version;
    this.log.debug('RitualsAccesory -> version :: ' + this.version);

  this.fragance = this.storage.get('fragance') || 'N/A';
    this.log.debug('RitualsAccesory -> fragance :: ' + this.fragance);

  var determinate_model = this.version.split('.');
  if (determinate_model[determinate_model.length-1] < 12){
    this.model_version = '1.0';
  }else{
    this.model_version = '2.0';
  }

  this.service = new Service.Fan(this.name,'AirFresher');
  this.service
  	.getCharacteristic(Characteristic.On)
  	.on('get', this.getCurrentState.bind(this))
  	.on('set', this.setActiveState.bind(this));

  this.service
  	.getCharacteristic(Characteristic.RotationSpeed)
  	.setProps({
        minValue: 1,
        maxValue: 3
      })
  	.on('get', callback => callback(null, this.fan_speed))
  	.on('set', this.setFanSpeed.bind(this));

  this.serviceInfo = new Service.AccessoryInformation();
  this.serviceInfo
  	.setCharacteristic(Characteristic.Manufacturer, author)
  	.setCharacteristic(Characteristic.Model, 'Rituals Genie ' + this.model_version)
  	.setCharacteristic(Characteristic.SerialNumber, this.hublot)
  	.setCharacteristic(Characteristic.FirmwareRevision, this.version)

  if (this.model_version == 1.0){
    this.serviceBatt = new Service.BatteryService('Battery','AirFresher');
    this.serviceBatt
  	.setCharacteristic(Characteristic.BatteryLevel, '100')
  	.setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.CHARGING)
  	.setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL)
      .setCharacteristic(Characteristic.Name, 'Genie Battery');
  }

  this.serviceFilter = new Service.FilterMaintenance('Filter','AirFresher');
  this.serviceFilter
  	.setCharacteristic(Characteristic.FilterChangeIndication, Characteristic.FilterChangeIndication.FILTER_OK)
  	.setCharacteristic(Characteristic.Name, this.fragance);

//ChargingState.NOT_CHARGING (0)
//ChargingState.CHARGING (1)
//ChargingState.NOT_CHARGAEABLE (2)
//StatusLowBattery.BATTERY_LEVEL_NORMAL (0)
//StatusLowBattery.BATTERY_LEVEL_LOW (1)

  this.services.push(this.service);
  this.services.push(this.serviceInfo);
  this.services.push(this.serviceBatt);
  this.services.push(this.serviceFilter);
  this.discover();

  this.log.debug('RitualsAccesory -> finish :: RitualsAccessory(log, config)');
}

RitualsAccessory.prototype = {

	discover: function () {
		const that = this;
    this.log.debug('RitualsAccesory -> init :: discover: function ()');
    this.log.debug('RitualsAccesory -> package :: ' + version);
    this.storage.put('hub',this.hub);
    var hash = this.storage.get('hash') || null;
		if (hash){
			this.log.debug('RitualsAccesory -> hash found in local storage');
      this.log.debug('RitualsAccesory -> HASH :: ' + hash);
			this.getHub();
		}else{
			this.getHash();
		}
    this.log.debug('RitualsAccesory -> finish :: discover: function ()');
	},

	getHash: function(){
    const that = this;
    this.log.debug('RitualsAccesory -> init :: getHash: function()');
		var client = reqson.createClient('https://rituals.sense-company.com/');
		var data = { email: this.account, password: this.password };
		client.post('ocapi/login', data, function(err, res, body) {
			if (err) { that.log.info(that.name + ' :: ERROR :: ocapi/login :: getHash() > ' + err) }
			if (!err && res.statusCode != 200){
        that.log.debug('RitualsAccesory -> ajax :: ocapi/login -> INVALID STATUS CODE :: ' + res.statusCode);
			}else{
        that.log.debug('RitualsAccesory -> ajax :: ocapi/login :: OK ' + res.statusCode);
        that.log.debug('RitualsAccesory -> ajax :: ocapi/login :: RESPONSE :: ' + body);
				that.storage.put('hash',body.account_hash);
        that.log.debug('RitualsAccesory -> ajax :: ocapi/login :: Setting hash in storage :: ' + body.account_hash);
        that.getHub();
			};
		});
    this.log.debug('RitualsAccesory -> finish :: getHash: function()');
	},

	getHub: function(){
    const that = this;
    this.log.debug('RitualsAccesory -> init :: getHub: function()');
		var client = reqson.createClient('https://rituals.sense-company.com/');
		client.get('api/account/hubs/' + that.storage.get('hash'),function(err, res, body){
			if (err) { that.log.info(that.name + ' :: ERROR :: api/account/hubs :: getHub() > ' + err) }
			if (!err && res.statusCode != 200){
        that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ -> INVALID STATUS CODE :: ' + res.statusCode);
			}else{
        that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ OK :: ' + res.statusCode);
        that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ BODY.LENGTH :: ' + body.length + ' Genie in your account');
        if (body.length == 1){
          that.key = 0;
          that.name = body[that.key].hub.attributes.roomnamec;
          that.hublot = body[that.key].hub.hublot;
          that.storage.put('key',that.key);
          that.storage.put('name',body[that.key].hub.attributes.roomnamec);
          that.storage.put('hublot',body[that.key].hub.hublot);
          that.storage.put('fragance',body[that.key].hub.sensors.rfidc.title);
        }else{
            var found = false;
            Object.keys(body).forEach(function(key) {
              if (body[key].hub.hash == that.hub){
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: HUB declared in config VALIDATED OK ');
                found = true;
                that.key = key;
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: HUB Key is :: ' + key);
                that.name = body[key].hub.attributes.roomnamec;
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: HUB Name :: ' + body[key].hub.attributes.roomnamec);
                that.hublot = body[key].hub.hublot;
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: HUB Hublot :: ' + body[key].hub.hublot);
                that.fragance = body[that.key].hub.sensors.rfidc.title;
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: SENSORS Fragance :: ' + body[that.key].hub.sensors.rfidc.title);
                that.storage.put('key',key);
                that.storage.put('name',body[key].hub.attributes.roomnamec);
                that.storage.put('hublot',body[key].hub.hublot);
                that.storage.put('fragance',body[that.key].hub.sensors.rfidc.title);
                that.log.debug('RitualsAccesory -> ajax :: api/account/hubs/ :: Saved HUB preferences in Storage');
              }
            });
            if (!found){
              that.log.info("************************************************");
              that.log.info('HUB in Config NOT validated! or NOT in Config');
              that.log.info('please declare a correct section in config.json');
              that.log.info("************************************************");
              that.log.info('There are multiple Genies found on your account');
              that.log.info('The HUB Key to identify Genie in your config.json is invalid, select the proper HUB key.')
              that.log.info('Put one of the following your config.json > https://github.com/myluna08/homebridge-rituals');
              Object.keys(body).forEach(function(key) {
                that.log.info('********************');
                that.log.info('Name   : ' + body[key].hub.attributes.roomnamec);
                that.log.info('Hublot : ' + body[key].hub.hublot);
                that.log.info('Hub    : ' + body[key].hub.hash);
                that.log.info('Key    : ' + key);
              });
              that.log.info("************************************************");
            }
          }
        }
		});
    this.log.debug('RitualsAccesory -> finish :: getHub: function()');
	},

	getCurrentState: function(callback){
    const that = this;
		this.log.debug('RitualsAccesory -> init :: getCurrentState: function(callback)');
		var client = reqson.createClient('https://rituals.sense-company.com/');
		client.get('api/account/hubs/' + that.storage.get('hash'),function(err, res, body){
			if (err) { that.log.info(that.name + ' :: ERROR :: api/account/hubs :: getCurrentState() > ' + err) }
			if (!err && res.statusCode != 200){
				that.log.debug('RitualsAccesory -> ajax :: getCurrentState :: api/account/hubs/ -> INVALID STATUS CODE :: ' + res.statusCode);
        that.log.info(that.name + ' getCurrentState => ' + res.statusCode + ' :: ' + err);
			}else{
				that.log.debug('RitualsAccesory -> ajax :: getCurrentState :: api/account/hubs/ OK :: ' + res.statusCode);
        that.key = that.storage.get('key');
				that.on_state = body[that.key].hub.attributes.fanc == '0' ? false : true;
				that.fan_speed = body[that.key].hub.attributes.sppedc;
        that.storage.put('version',body[that.key].hub.sensors.versionc);
				callback(null, that.on_state);
			};
		});
    this.log.debug('RitualsAccesory -> finish :: getCurrentState: function(callback)');
	},

	setActiveState: function(active, callback){
    const that = this;
    this.log.debug('RitualsAccesory -> init :: setActiveState: function(active, callback)');
    this.log.debug('RitualsAccesory ->  setActiveState to ' + active);
    this.log.info(that.name + ' :: Set ActiveState to => ' + active);
		var setValue = active == true ? '1' : '0';
		var client = reqson.createClient('https://rituals.sense-company.com/');
		var data = { hub: that.hub, json: { attr: { fanc: setValue } } };
		client.post('api/hub/update/attr', data, function(err, res, body) {
			if (err) { that.log.info(that.name + ' :: ERROR :: api/account/hubs :: setActiveState() > ' + err); callback(undefined, on_state); }
			if (!err && res.statusCode != 200){
        that.log.debug('RitualsAccesory -> ajax :: setActiveState :: api/hub/update/attr/ -> INVALID STATUS CODE :: ' + res.statusCode);
        that.log.info(that.name + ' :: setActiveState => ' + res.statusCode + ' :: ' + err);
				callback(undefined, that.on_state);
			}else{
        that.log.debug('RitualsAccesory -> ajax :: setActiveState :: api/hub/update/attr/ OK :: ' + res.statusCode);
        that.log.debug('RitualsAccesory -> ajax :: setActiveState :: api/hub/update/attr/ BODY :: ' + body);
				callback(undefined, active);
			};
		});
    this.log.debug('RitualsAccesory -> finish :: setActiveState: function(active, callback)');
	},

	setFanSpeed: function(value, callback){
    const that = this;
    this.log.debug('RitualsAccesory -> init :: setFanSpeed: function(value, callback)');
    this.log.info(that.name + ' :: Set FanSpeed to => ' + value);
		var client = reqson.createClient('https://rituals.sense-company.com/');
		var data = { hub: that.hub, json: { attr: { speedc: value.toString() } } };
		client.post('api/hub/update/attr', data, function(err, res, body) {
			if (err) { that.log.info(that.name + ' :: ERROR :: api/account/hubs :: setFanSpeed() > ' + err); callback(undefined, fan_speed); }
			if (!err && res.statusCode != 200){
				that.log.debug('RitualsAccesory -> ajax :: setFanSpeed :: api/hub/update/attr/ -> INVALID STATUS CODE :: ' + res.statusCode);
        that.log.info(that.name + ' :: setFanSpeed => ' + res.statusCode + ' :: ' + err);
				callback(undefined, that.fan_speed);
			}else{
				that.log.debug('RitualsAccesory -> ajax :: setFanSpeed :: api/hub/update/attr/ OK :: ' + res.statusCode);
        that.log.debug('RitualsAccesory -> ajax :: setFanSpeed :: api/hub/update/attr/ BODY :: ' + body);
				callback(undefined, value);
			};
		});
    this.log.debug('RitualsAccesory -> finish :: setFanSpeed: function(value, callback)');
	},

	identify: function (callback) {
		callback();
	},

	getServices: function () {
		return this.services;
	}
};
