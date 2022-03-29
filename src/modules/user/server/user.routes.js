const path = require("path");
const controller = require(path.join(process.cwd(), "src/modules/user/server/user.controller"));
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/user/server/user-authentication.middleware"));
const validate = require(path.join(process.cwd(), "src/modules/core/server/middlewares/validate"));
const { userUpdateSchema } = require(path.join(process.cwd(), "src/modules/user/server/user.schema"));

module.exports = (app) => {
    app.post("/api/login", controller.login);

    app.get("/api/logout", AuthStrategy, controller.logout);

    app.route('/api/users/profile')
        .get(AuthStrategy, controller.getSignedInUserProfile)
        .put(AuthStrategy, validate(userUpdateSchema), controller.updateSignedInUserProfile);
};
