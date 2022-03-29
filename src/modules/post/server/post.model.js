const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/server/lib/sequelize'));
const { DataTypes } = require("sequelize");
const User = require(path.join(process.cwd(), "src/modules/user/server/user.model"));
const Category = require(path.join(process.cwd(), "src/modules/category/server/category.model"));

const Post = sequelize.define("posts", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    user_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    category_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING(255),
    },
    content: {
        allowNull: false,
        type: DataTypes.STRING(10000)
    },
    view_order: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    is_visible: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['true', 'false'],
        defaultValue: 'true'
    }
}, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasMany(Post, { as: 'posts', foreignKey: 'user_id' });
Post.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

Category.hasMany(Post, { as: 'posts', foreignKey: 'category_id' });
Post.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = Post;