const passport = require("passport");

const AuthStrategy = (req, res, next) => { 
    const auth = passport.authenticate("user-jwt", async function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal server error.");
        }
        if (!user) return res.status(401).send("Unauthenticated user.");

        req.logIn(user, { session: false }, function (error) {
            if (error) return next(error);
            next();
        });
    });
    auth(req, res, next);
}


module.exports.AuthStrategy = AuthStrategy;