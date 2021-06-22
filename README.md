## Writing README stuff
[https://help.github.com/en/articles/basic-writing-and-formatting-syntax](https://help.github.com/en/articles/basic-writing-and-formatting-syntax)

## Node stuff
- Node.js (v14.2.0) and npm [https://nodejs.org/](https://nodejs.org/)
- PM2 (v4.4.0) [http://pm2.keymetrics.io](http://pm2.keymetrics.io)

## Initial set up
```
npm install
```

## To start/restart:
```
pm2 start [ecosystem config file].js
pm2 restart [ecosystem config file].js
pm2 startOrRestart [ecosystem config file].js
```
- [PM2 cluster mode](http://pm2.keymetrics.io/docs/usage/cluster-mode)
- Immediately shuts down currently running process and then starts new one.
    - Causes this too-
        - App [app_name] with id [0] and pid [20743], exited with code [100] via signal [SIGINT]

## To reload:
```
pm2 reload [ecosystem config file].js
pm2 startOrReload [ecosystem config file].js
```
- [PM2 cluster mode, reload](http://pm2.keymetrics.io/docs/usage/cluster-mode/#reload)
- [https://stackoverflow.com/questions/44883269/what-is-the-difference-between-pm2-restart-and-pm2-reload](https://stackoverflow.com/questions/44883269/what-is-the-difference-between-pm2-restart-and-pm2-reload)
    - "With reload, pm2 restarts all processes one by one, always keeping at least one process running."
    - "If the reload system hasn’t managed to reload your application, a timeout will fallback to a classic restart."

## To gracefully reload (RECOMMENDED):
```
pm2 gracefulReload [ecosystem config file].js
pm2 startOrGracefulReload [ecosystem config file].js (reloads env var as well)
```
- [PM2 cluster mode, graceful shutdown](http://pm2.keymetrics.io/docs/usage/cluster-mode/#graceful-shutdown)
- [http://pm2.keymetrics.io/docs/usage/signals-clean-restart/](http://pm2.keymetrics.io/docs/usage/signals-clean-restart/)
    - Allows to do process.on('SIGINT', function() {... before shutdown

## Notes when restarting:
As of pm2 -v 3.5.1
- --update-env option doesn't seem to be working as it should
    - [https://github.com/Unitech/pm2/issues/3796](https://github.com/Unitech/pm2/issues/3796)
- watch: true does not update env that were changed in config .js/json
    - need to manually do pm2 startOrGracefulReload [ecosystem config file].js
- Manual restart/reload/gracefulReload causes env to be updated to whatever is in config .js/json
    - However if env var is removed from .js/json, it still remains in process.env and gets loaded.
    Not sure if this is pm2/node bug or just the way things are.
        - To prevent this, do pm2 delete to completely remove then pm2 start

## Building Everything
```
npm run build
```

## Angular Frontend
Angular is installed as dev dependency, and used to build front end stuff. cd into my-angular-app to make updates:

```
cd my-angular-app

npm run ng -- serve
or
npm run ng -- build
```

Running nodejs server with pm2, and ng build with watch option

```
pm2 start [ecosystem config file].js
cd my-angular-app
npm run ng -- build --watch
```

Building for production

```
npm run build:angular
```

On low memory machine (ex t2.micro on AWS EC2) prod build fails (error code 137). In this case, increase memory limit for node.
- [https://medium.com/@vuongtran/how-to-solve-process-out-of-memory-in-node-js-5f0de8f8464c](https://medium.com/@vuongtran/how-to-solve-process-out-of-memory-in-node-js-5f0de8f8464c)
- [https://github.com/npm/npm/issues/12238#issuecomment-301645764](https://github.com/npm/npm/issues/12238#issuecomment-301645764)

```
node --max-old-space-size=2048 `which npm` build:angular
```
Yes, it's a hacky solution...FTP'ing files that are built on other machine is probably better alternative.

## React Frontend

```
cd my-react-app
npm run start
```

Running nodejs server with pm2

```
npm run build:reactjs
pm2 start [ecosystem config file].js
```

Building for production

```
npm run build:reactjs
```

## Generating docs
```
npm run build:doc
```
- Runs both apidoc and jsdoc

### apidoc
```
npm run build:doc:apidoc
```
- outputs to server/apidoc
- [https://www.npmjs.com/package/apidoc](https://www.npmjs.com/package/apidoc)
- [http://apidocjs.com/](http://apidocjs.com/)
    - [params](http://apidocjs.com/#params)

### jsdoc
```
npm run build:doc:jsdoc
```
- outputs to server/jsdoc
- [https://www.npmjs.com/package/jsdoc](https://www.npmjs.com/package/jsdoc)
- [https://jsdoc.app/](https://jsdoc.app/)
     - [Getting started](https://jsdoc.app/about-getting-started.html)
     - [tags](https://jsdoc.app/tags-example.html)
     - [Namepaths](https://jsdoc.app/about-namepaths.html)
     - [Namespace](https://jsdoc.app/tags-namespace.html)
         - [memberof](https://jsdoc.app/tags-memberof.html)
     - [Module](https://jsdoc.app/tags-module.html)
         - [param](https://jsdoc.app/tags-param.html)
         - [Function](https://jsdoc.app/tags-function.html)
         - [Class](https://jsdoc.app/tags-class.html)
