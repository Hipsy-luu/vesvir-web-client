Para correr el repo con cambios en caliente:

    >> npm run start:dev

Para hacer el deploy para produccion:

    >> npm run build

Comando para resetar el servidor apache para node dentro de un ssh del servidor hosting
    >> pkill -9 Passenger

https://www.npmjs.com/package/sequelize-automate
Crea las entidades de las tablas contenidas en una base de datos automaticamente para usarse en sequelize

    >> sequelize-automate -t [type] -h <host> -d <database> -u <user> -p [password] -P [port]  -e [dialect] -o [/path/to/models] -c [/path/to/config]

    >> sequelize-automate -t ts -h localhost -d ux_proyect -u ux_user -p Auoflo9Pm5z97V2U -P 3306  -e mysql -o ./modelos-automaticos -c ./modelos-automaticos/config

TODO:

    1. - Hay que cambiar el key del jwt en las estrategias del passtport

    .htaccess