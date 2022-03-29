const path = require("path");
const User = require(path.join(process.cwd(), "src/modules/user/server/user.model"));
const { generateAccessToken } = require(path.join(process.cwd(), "src/modules/user/server/service/user.service"));

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }});

        if (!user || !user.password || !user.validPassword(password)) return res.status(400).send("Invalid email or password!");

        res.cookie("access_token", generateAccessToken(user), {
            httpOnly: true,
            sameSite: true,
            signed: true
        });

        const { password: Password, ...restUserInfo } = user.dataValues;
        res.status(200).json(restUserInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error!");
    }
}

async function logout(req, res) {
    res.clearCookie("access_token").redirect("/");
}

async function getSignedInUserProfile(req, res) {
    try {
        const user = await User.findOne({ 
            where: { id: req.user.id },
            attributes: { exclude: ['password', 'status'] }
        });

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
}

async function updateSignedInUserProfile(req, res) {
    try {
        const { first_name, last_name, about, facebook_link, github_link, linkedin_link, email_link } = req.body;

        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) return res.status(404).send("User not found!");

        if (first_name) await user.update({ first_name });
        if (last_name) user.update({ last_name });
        if (about) user.update({ about });
        if (facebook_link) user.update({ facebook_link });
        if (github_link) user.update({ github_link });
        if (linkedin_link) user.update({ linkedin_link });
        if (email_link) user.update({ email_link });

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.getSignedInUserProfile = getSignedInUserProfile;
module.exports.updateSignedInUserProfile = updateSignedInUserProfile;
