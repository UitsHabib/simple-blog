const path = require("path");
const async = require("async");

async function init() {
    const config = require(path.join(process.cwd(), "src/config/server/config"));
    await config.initEnvironmentVariables();

    const nodecache = require(path.join(process.cwd(), "src/config/server/lib/nodecache"));

    const sequelize = require(path.join(process.cwd(), "src/config/server/lib/sequelize"));

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${nodecache.getValue("DB_NAME")}`);

    const User = require(path.join(process.cwd(), "src/modules/user/server/user.model"));
    
    require(path.join(process.cwd(), 'src/modules/category/server/category.model'));
    require(path.join(process.cwd(), 'src/modules/post/server/post.model'));

    await sequelize.sync();

    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: "habiburrahman3089@gmail.com" },
            defaults: {
                id: "479753f6-dfeb-47da-abf4-6b41332842a0",
                first_name: "Habibur",
                last_name: "Rahman",
                password: "P@ssword123",
            },
        }).then(function () {
            callback();
        });
    }

    async.waterfall(
        [userSeeder],
        function (err) {
            if (err) console.error(err);
            else console.info("DB seed completed!");
            process.exit();
        }
    );
}

init();