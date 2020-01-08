var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-rituals", "Rituals", RitualsAccessory);
}

function RitualsAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.account = config["account"];
  this.password = config["password"];
  this.token = config["token"];
  this.hash = config["hash"];
  
  this.service = new Service.Mechanism(this.name);
  
  this.service
    .getCharacteristic(Characteristic.CurrentState)
    .on('get', this.getState.bind(this));
  
  this.service
    .getCharacteristic(Characteristic.TargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

RitualsAccessory.prototype.getState = function(callback) {
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
}