const path = require("path");
const hbs = require('express-hbs');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const config = require('../config');
const nodecache = require('./nodecache');

module.exports = async function () {
    const app = express();

    app.use(cookieParser(nodecache.getValue('COOKIE_SECRET')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(process.cwd(), 'wwwroot')));

    app.engine('html', hbs.express4({ extname: '.html' }));
    app.set('view engine', 'html');
    app.set('views', path.join(process.cwd(), 'src/modules/core/server'));

    const corsOptions = {
        credentials: true,
        origin: (origin, callback) => {
            return callback(null, true);

            callback(new Error('Not allowed by CORS'));
        }
    };
    app.use(cors(corsOptions));

    app.set('port', process.env.PORT);

    const globalConfig = config.getGlobalConfig();

    // app.locals.jsFiles = globalConfig.client.js;
    // app.locals.cssFiles = globalConfig.client.css;

    globalConfig.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    globalConfig.server.strategies.forEach(function (strategy) {
        require(path.resolve(strategy))();
    });

    return app;
};
