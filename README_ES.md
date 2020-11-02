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

PARA 1 SOLO GENIE
Una vez instalado, debes modificar el fichero config.json y añadir el accesorio:
1. accessory (Required) = "Rituals"
2. account (Required) = "xxxx@xxx.com" < la cuenta de la App Rituals que usaste en el Registro.
3. password (Required) = "yyyyyyyy" < la password cuenta de la App Rituals que usaste en el Registro.
4. name (Optional) = "my Genie" < el nombre que le quieres dar, si no, "Genie" sera asignado como nombre por defecto.
GUARDA tu config.json y REINICIA homebridge.
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

PARA MULTIPLES GENIES
Si tienes mas de 1 genie en la cuenta, usa la configuración anterior, el accesorio devolvera en el LOG los identificadores de los genies que tengas en la cuenta, una vez devueltos añade la clave "hub" y el valor del identificador genie que desees controlar.

1. Declara modo standard
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
2. Espera devolución en el LOG como esta
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
3. declara 2 accesorios con sus correspondientes identificadores hub
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
4. Reinicia Homebridge

## 04.Limitaciones
* Aparece en tu app de CASA como un Ventidador.
* Puedes controlar solo start/stop.
* La velocidad del ventilador no esta disponible en esta release (mira controldecambios). Ya esta listo!
* No se visualizan otras propiedades aún, tal vez mas adelante.
* La limitación más importante, esta versión solo puede gestionar 1 genie. Si tienes varios en la misma cuenta aun no se podrá.

## 05.Implementaciones Futuras (o que nos gustaria tener en el futuro no muy lejano..)
- [x] Añadir la control de velocidad del ventilador. Ya esta listo!
- [x] Añadir la información de la bateria. Ya esta listo!
- [x] Deteccion de la versión 1.0 de Genie o 2.0 de Genie, Genie 2.0 no tiene batería y no se muestran datos relativos a bateria.
- [x] Trazas en modo Debug
- [x] Añadir el nombre de la fragancia.
- [ ] Añadir la cantidad de fragancia que queda ¿?
- [x] Añadir gestionar mas de 1 genie en la misma cuenta.

Ya, mucho curre .. Si te gusta el trabajo invitame a un cafe <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4YXRZVGSVNAEE&item_name=Just+for+a+coffe&currency_code=EUR&source=url"><img src="https://img.shields.io/static/v1?label=Invitame%20a%20un%20cafe&message=usa%20paypal&color=green"></a>

## 06.Credits && Trademarks
Rituals & Genie son marcas registradas de Rituals Cosmetics Enterprise B.V.

## 07.Lista de Cambios
* 1.1.12 Añadido control para excepcion de servidores rituals al actualizar el estado.
* 1.1.11 Añadido control para excepciones 503 servidor rituals sin respuesta.
* 1.1.10 Añadido ESLint y corregidos errores.
* 1.1.9 Añadido control en caso de error de conexión a los servidores Rituals.
* 1.1.8 corrección error de escritura
* 1.1.7 corrección hub para 1 solo genie.
* 1.1.6 corrección UUID para persistencia.
* 1.1.5 corrección sobre el sistema de log & añadida la fragancia
* 1.1.4 forzado de cambio para UUID
* 1.1.3 corregido defecto con la clave con 1 solo genie.
* 1.1.2 corregido defecto con package.json en algunos casos.
* 1.1.1 error ReferenceError: config is not defined solucionado.
* 1.1.0 trazas en modo debug, mas de 1 genie en la misma cuenta e información de la versión 1.0 o 2.0, frangancia (solo homebridge)
* 1.0.8 corregido un error usando funciones expuestas por homebridge y añadida nueva caracteristica usando la velocidad del ventilador.
* 1.0.7 versión inestable!
* 1.0.6 corregidos errores en secure store, en algunos casos en el log de homebridge aparecen fallos de permisos.
* 1.0.5 demasiados logins para obtener el hash, implementando secure store.
* 1.0.4 primera release funcional
* 1.0.3 corregidos errores en peticiones, json mal fomateado
* 1.0.2 corregidos errores on_state, active_state
* 1.0.1 esquema funcionado, pero no hace nada
* 1.0.0 accesorio registrado correctamente
