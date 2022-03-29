const path = require("path");
const bcrypt = require("bcrypt");
const sequelize = require(path.join(process.cwd(), 'src/config/server/lib/sequelize'));
const { DataTypes } = require("sequelize");

const User = sequelize.define("users", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    first_name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    about: {
        type: DataTypes.STRING(10000)
    },
    facebook_link: {
        type: DataTypes.STRING(255)
    },
    github_link: {
        type: DataTypes.STRING(255)
    },
    linkedin_link: {
        type: DataTypes.STRING(255)
    },
    email_link: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = User;