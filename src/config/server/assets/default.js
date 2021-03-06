module.exports = {
    client: {
        css: "wwwroot/bundles/app.css",
        js: "wwwroot/bundles/app.js"
    },
    server: {
        routes: [
            // "src/modules/**/*.routes.js",
            // "src/modules/!(core)/server/**/*.routes.js",
            "src/modules/category/server/**/*.routes.js",
            "src/modules/post/server/**/*.routes.js",
            "src/modules/user/server/*.routes.js",
            "src/modules/core/server/*.routes.js",
        ],
        strategies: [
            "src/modules/**/*.strategy.js"
        ]
    }
};
