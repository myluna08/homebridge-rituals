# Homebridge-Rituals
v1 es una release funcional, A DISFRUTAR!!

<img src="https://img.shields.io/badge/stage-stable-green"> <img src="https://img.shields.io/badge/completo-90%25-yellow"> <img src="https://img.shields.io/badge/license-MIT-green"> <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4YXRZVGSVNAEE&item_name=Just+for+a+coffe&currency_code=EUR&source=url"><img src="https://img.shields.io/static/v1?label=Invitame%20a%20un%20cafe&message=usa%20paypal&color=green"></a> <a align="right" href="https://github.com/myluna08/homebridge-rituals/blob/master/README.md">English</a>|<a align="right" href="https://github.com/myluna08/homebridge-rituals/blob/master/README_ES.md">Español</a>

<img src="https://user-images.githubusercontent.com/19808920/58770949-bd9c7900-857f-11e9-8558-5dfaffddffda.png" height="100"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoyOlRgCEZSyCrf2Ika_luW6N9ridvyC1Genb49xCQyLbc5eMG&s" height="90" align="right"> <img src="https://www.rituals.com/dw/image/v2/BBKL_PRD/on/demandware.static/-/Sites-rituals-products/default/dw7656c020/images/zoom/1106834_WirelessperfumeDiffuserPROAPrimary.png?sw=500&sh=500&sm=fit&q=100" height="100" align="right">

Homebridge Rituals es un homebridge-plugin para controlar Rituals Genie mediante la infraestructura homebridge.
Homebridge es un servidor ligero de NodeJS que emula la API de iOS de HomeKit.

Desde que Siri soporta el control de dispositivos mediante HomeKit, con Homebridge puedes pedirle a Siri que gestione dispositivos que realmente no son 100% compatibles con HomeKit. Para ello se usan plguins y se le puede pedir algo como:

 * _Siri, enciene el Genie._ 
 * _Siri, apaga el Genie._


#### Antes de empezar, (asunciones)
* Tu genie debe estar registrado usando la app oficial de Rituals.
* Tu genie de funcionar bien (obvio)
* Tu <a href="https://github.com/nfarina/homebridge">homebridge</a> debe estar funcionando y añadido como puente. Sino date un paseo por <a href="#considerations">instalación desde cero</a>

* Your genie has been registered using Rituals App.
* Your genie is working fine.
* Your <a href="https://github.com/nfarina/homebridge">homebridge</a> is working fine and has been added to your home app as bridge. If not, please take a look to <a href="#considerations">considerations section</a>.
Find more about on <a href="https://www.rituals.com/es-es/faqs.html?catid=faq-perfume-genie&qid=fag-what-is-the-perfume-genie-and-what-can-it-do">Official Rituals Site</a>

## 01.Instalación
con npm -i si usas instalación manual del plugin.
```sh
npm -i homebridge-rituals
```
Si usas interfaz UI de homebridge, usa el buscador y escribe : "homebridge-rituals" o "rituals" e INSTALA.

## <a name="considerations"></a>02.Instalacion desde cero
0. Este plugin esta en desarrollo, (Inestable instalación 0.0.x) (**Estable instalacion 1.0.0 or greather..**)
1. **Node v4.3.2 o superior requerido.** Chequear la versión ejecutando: `node --version`.
2. **On Linux only:** Instala libavahi-compat-libdnssd-dev con: `sudo apt-get install libavahi-compat-libdnssd-dev`
3. Instala Homebridge usando: `npm install -g homebridge` _or_ `sudo npm install -g --unsafe-perm homebridge` (see below)
4. Instala plugins usando: `npm install -g <plugin-name>`
5. Creaa el fichero de configuración `config.json`.

## 03.Configuración en config.json
Una vez instlado, debes modificar el fichero config.json y añadir el accesorio:
1. accessory (Required) = "Rituals"
2. account (Required) = "xxxx@xxx.com" < la cuenta de la App Rituals que usaste en el Registro.
3. password (Required) = "yyyyyyyy" < la password cuenta de la App Rituals que usaste en el Registro.
4. name (Optional) = "my Genie" < el nombre que le quieres dar, si no, "Genie" sera asignado como nombre por defecto.
GUARDA tu config.json y REINICIA homebridge.

    "accessories": [
        {
            "accessory": "Rituals",
            "name": "My Genie",
            "account": "xxx@xxx.com",
            "password": "yyyyyyy"
        }
    ],

## 04.Limitaciones
* Aparece en tu app de CASA como un Ventidador.
* Puedes controlar solo start/stop.
* La velocidad del ventilador no esta disponible en esta release (mira controldecambios).
* No se visualizan otras propiedades aún, tal vez mas adelante.
* La limitación más importante, esta versión solo puede gestionar 1 genie. Si tienes varios en la misma cuenta aun no se podrá.

## 05.Implementaciones Futuras (o que nos gustaria tener en el futuro no muy lejano..)
01. Añadir la información de la bateria.
02. Añadir el nombre de la fragancia.
03. Añadir la cantidad de fragancia que queda.
04. Añadir gestionar mas de 1 genie en la misma cuenta

Ya, mucho curre .. Si te gusta el trabajo invitame a un cafe <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4YXRZVGSVNAEE&item_name=Just+for+a+coffe&currency_code=EUR&source=url"><img src="https://img.shields.io/static/v1?label=Invitame%20a%20un%20cafe&message=usa%20paypal&color=green"></a>

## 06.Credits && Trademarks
Rituals & Genie son marcas registradas de Rituals Cosmetics Enterprise B.V.
