# Homebridge-Rituals
v1 is functional release, ENJOY!!

<img src="https://img.shields.io/badge/stage-stable-green"> <img src="https://img.shields.io/badge/completion-90%25-yellow"> <img src="https://img.shields.io/badge/license-MIT-green"> <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4YXRZVGSVNAEE&item_name=Just+for+a+coffe&currency_code=EUR&source=url"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffe&message=using%20paypal&color=green"></a> <a align="right" href="https://github.com/myluna08/homebridge-rituals/blob/master/README.md">English</a>|<a align="right" href="https://github.com/myluna08/homebridge-rituals/blob/master/README_ES.md">Español</a>

<img src="https://user-images.githubusercontent.com/19808920/58770949-bd9c7900-857f-11e9-8558-5dfaffddffda.png" height="100"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoyOlRgCEZSyCrf2Ika_luW6N9ridvyC1Genb49xCQyLbc5eMG&s" height="90" align="right"> <img src="https://www.rituals.com/dw/image/v2/BBKL_PRD/on/demandware.static/-/Sites-rituals-products/default/dw7656c020/images/zoom/1106834_WirelessperfumeDiffuserPROAPrimary.png?sw=500&sh=500&sm=fit&q=100" height="100" align="right">

Homebridge Rituals is a homebridge-plugin to manage a Rituals Genie over homebridge infraestructure.
Homebridge is a lightweight NodeJS server you can run on your home network that emulates the iOS HomeKit API.

Since Siri supports devices added through HomeKit, this means that with Homebridge you can ask Siri to control devices that don't have any support for HomeKit at all. For instance, using just some of the available plugins, you can say:

With this plugin you can do

 * _Siri, turn on the Genie._
 * _Siri, turn off the Genie._


#### Before begin, (assumptions)
* Your genie has been registered using Official Rituals App.
* Your genie is working fine. (obviously)
* Your <a href="https://github.com/nfarina/homebridge">homebridge</a> is working fine and has been added to your home app as bridge. If not, please take a look to <a href="#considerations">Installation from zero</a>.
Find more about on <a href="https://www.rituals.com/es-es/faqs.html?catid=faq-perfume-genie&qid=fag-what-is-the-perfume-genie-and-what-can-it-do">Official Rituals Site</a>

## 01.Installation
With npm -i or if you are using manual plugin module installation.
```sh
npm -i homebridge-rituals
```
Otherwise you can use throught Homebridge UI-X the plugin search engine and just write : "homebridge-rituals" or "rituals" and click INSTALL

## <a name="considerations"></a>02.Installation from zero
0. This plugin is under development, (Unstable installation 0.0.x) (**stable installation 1.0.0 or greather..**)
1. **Node v4.3.2 or greater is required.** Check by running: `node --version`. The plugins you use may require newer versions.
2. **On Linux only:** Install the libavahi-compat-libdnssd-dev package: `sudo apt-get install libavahi-compat-libdnssd-dev`
3. Install Homebridge using: `npm install -g homebridge` _or_ `sudo npm install -g --unsafe-perm homebridge` (see below)
4. Install the plugins using: `npm install -g <plugin-name>`
5. Create the `config.json` file.

## 03.Configuration in config.json

FOR 1 GENIE ONLY
One installed, you must modify your config.json file and add the following data:
1. accessory (Required) = "Rituals"
2. account (Required) = "xxxx@xxx.com" < that is the mail you are using in Rituals App Registration.
3. password (Required) = "yyyyyyyy" < that is the password you are using in Rituals App.
4. name (Optional) = "my Genie" < a name that you can assign, if not, "Genie" name has been assigned.
SAVE your config.json file and RESTART homebridge.
```
    "accessories": [
        {
            "accessory": "Rituals",
            "name": "My Genie",
            "account": "xxx@xxx.com",
            "password": "yyyyyyy"
        }
    ],
```

MULTIPLE GENIES IN YOUR account
If you have more than one genie in your account, use the standard config for the first time and see the LOG. The Genie identifiers should appear in the log. Then add the "hub" key in the config to indicate what genie you want to control.

1. Declare standard mode
```
    "accessories": [
        {
            "accessory": "Rituals",
            "name": "Genie",
            "account": "xxx@xxx.com",
            "password": "yyyyyyy"
        }
    ],
```
2. Wait for the LOG , like this..
```
[7/1/2020, 1:24:44 PM] [Genie] Hub NOT validated!
[7/1/2020, 1:24:44 PM] [Genie] There are multiple hubs found on your account
[7/1/2020, 1:24:44 PM] [Genie] Key in your config.json is invalid, select the proper hub key.
[7/1/2020, 1:24:44 PM] [Genie] Put one in your config.json > https://github.com/myluna08/homebridge-rituals
[7/1/2020, 1:24:44 PM] [Genie] ---
[7/1/2020, 1:24:44 PM] [Genie] Name: FirstGenie
[7/1/2020, 1:24:44 PM] [Genie] Hublot: LOTXXX-XX-XXXXX-XXXXX
[7/1/2020, 1:24:44 PM] [Genie] Hub: f0123456789f0123456789f0123456789f0123456789f0123456789f01234567
[7/1/2020, 1:24:44 PM] [Genie] Key: 0

[7/1/2020, 1:24:44 PM] [Genie] ---
[7/1/2020, 1:24:44 PM] [Genie] Name: SecondGenie
[7/1/2020, 1:24:44 PM] [Genie] Hublot: LOTXXX-XX-XXXXX-XXXXX
[7/1/2020, 1:24:44 PM] [Genie] Hub: a0123456789a0123456789a0123456789a0123456789a0123456789a01234567
[7/1/2020, 1:24:44 PM] [Genie] Key: 1
```
3. declare every accesory with the correspondent hub identifier
```
"accessories": [
    {
        "accessory": "Rituals",
        "name": "Genie 01",
        "account": "xxx@xxx.com",
        "password": "yyyyyyy",
        "hub": "f0123456789f0123456789f0123456789f0123456789f0123456789f01234567"
    },
    {
        "accessory": "Rituals",
        "name": "Genie 02",
        "account": "xxx@xxx.com",
        "password": "yyyyyyy",
        "hub": "a0123456789a0123456789a0123456789a0123456789a0123456789a01234567"
    }
],
```
4. Restart Homebridge

## 04.Limitations
* It will appears in you home app like a Fan Accessory.
* You can control start/stop.
* Fan control is not available in this release (see changelog).
* You can't see other properties like in the app, maybe later.
* The most important limitation, with this very first version you can only manage only 1 genie under the rituals account.

## 05.Following Features Implementation (Nice to have in the future)
- [x] Allow to control FAN rotator speed, Done!
- [x] Allow to show battery level information, Done!
- [x] Detection of Genie version 1.0 or 2.0
- [x] Added Debug traces
- [ ] Allow to show the fragance name
- [ ] Allow to show the fragance quantity remains inside genie
- [x] Allow to manage more than one genie if you can more than one in the same rituals account.

Yeah, many work .. but you can helpme with a coffe .. <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4YXRZVGSVNAEE&item_name=Just+for+a+coffe&currency_code=EUR&source=url"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffe&message=using%20paypal&color=green"></a>

## 06.Credits && Trademarks
Rituals & Genie are registered trademarks of Rituals Cosmetics Enterprise B.V.

## 07.ChangeLog
* 1.1.1 Error ReferenceError: config is not defined solved.
* 1.1.0 adding debug traces, support more than 1 genie in your account and current version of genie 1.0 or 2.0, fragance only in (homebridge)
* 1.0.8 fix error using functions exposed by homebridge and adding new characteristic to use FAN rotator speed.
* 1.0.7 wrong, unstable version!
* 1.0.6 fix error with secure store, in some cases appears in homebridge logs permission errors.
* 1.0.5 too many logins to get hash, implementing secure store.
* 1.0.4 first release functional
* 1.0.3 fix errors on request, json bad fomatted
* 1.0.2 fix errors on_state, active_state
* 1.0.1 scheme works but nothing do
* 1.0.0 accessory registered successfully
