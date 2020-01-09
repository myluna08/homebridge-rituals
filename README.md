# Homebridge-Rituals
a cup of tea!

<img src="https://img.shields.io/badge/stage-development-yellow"> <img src="https://img.shields.io/badge/completion-90%25-yellow"> <img src="https://img.shields.io/badge/license-MIT-green">

<img src="https://user-images.githubusercontent.com/19808920/58770949-bd9c7900-857f-11e9-8558-5dfaffddffda.png" height="100">

Homebridge Rituals is a homebridge-plugin to manage a Rituals Genie over homebridge infraestructure.
Homebridge is a lightweight NodeJS server you can run on your home network that emulates the iOS HomeKit API.

Since Siri supports devices added through HomeKit, this means that with Homebridge you can ask Siri to control devices that don't have any support for HomeKit at all. For instance, using just some of the available plugins, you can say:

With this plugin you can do

 * _Siri, turn on the Genie._ 
 * _Siri, turn off the Genie._

## Installation

With npm -i or if you are using homebridge-UI with plugin module installation.

```sh
npm -i homebridge-rituals
```

#### Note
0. This plugin is under development, (**Unstable installation 0.0.x**) (stable installation 1.0.0 or greather..)
1. **Node v4.3.2 or greater is required.** Check by running: `node --version`. The plugins you use may require newer versions.
2. **On Linux only:** Install the libavahi-compat-libdnssd-dev package: `sudo apt-get install libavahi-compat-libdnssd-dev`
3. Install Homebridge using: `npm install -g homebridge` _or_ `sudo npm install -g --unsafe-perm homebridge` (see below)
4. Install the plugins using: `npm install -g <plugin-name>`
5. Create the `config.json` file.
