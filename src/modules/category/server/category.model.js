const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/server/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Category = sequelize.define('categories', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING(255)
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING(1000)
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
    },
    parent_id: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Category.hasMany(Category, { as: 'childCategories', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parentCategory', foreignKey: 'parent_id' });

module.exports = Category;