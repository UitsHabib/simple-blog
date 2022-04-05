const path = require('path');
const Category = require(path.join(process.cwd(), "src/modules/category/server/category.model"));
const Post = require(path.join(process.cwd(), "src/modules/post/server/post.model"));
const User = require(path.join(process.cwd(), "src/modules/user/server/user.model"));
const { Op } = require('sequelize');

async function getCategories(req, res) {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(404).send("page must be greater or equal 1");

        const limit = req.query.limit ? req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy;
        const orderType = 
            req.query.orderType === "asc" || req.query.orderType === "desc"
                ? req.query.orderType
                : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        const sortableColumns = [
            "title",
            "description",
            "view_order",
            "is_visible",
            "parent_id",
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        const { isAvailablePosts } = req.query;

        const PostModel = isAvailablePosts ? ([
            {
                model: Post,
                as: 'posts',
                attributes: { exclude: ['created_at', 'updated_at'] },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['first_name', 'last_name'],
                    }
                ]
            }
        ]) : null;

        const categories = await Category.findAll({
            offset, 
            limit, 
            order,
            include: PostModel
        });

        const total = await Category.count();

        const data = {
            categories,
            meta: {
                total,
                page: page + 1,
                limit,
                start: limit * page + 1,
                end: offset + limit > total ? total : offset + limit
            }
        };

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function createCategory(req, res) {
    try {
        const { title, description, view_order, is_visible, parent_id } = req.body;

        const [category, created] = await Category.findOrCreate({
            where: { title: title.trim() },
            defaults: {
                description,
                view_order,
                is_visible,
                parent_id
            }
        });

        if (!created) return res.status(400).send('Exist duplicate category title.');

        res.status(201).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getCategory(req, res) {
    try {
        const category = await Category.findOne({ where: { id: req.params.id }});

        if (!category) return res.status(404).send('Category not found.');

        res.status(200).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateCategory(req, res) {
    try {
        const { title, description, view_order, is_visible, parent_id } = req.body;

        const category = await Category.findOne({ where: { id: req.params.id }});
        if (!category) return res.status(404).send('Category not found.');

        const duplicatedTitle = await Category.findOne({ 
            where: { 
                id: { [Op.ne]: req.params.id },
                title: title.trim(), 
            }
        });
        if(duplicatedTitle) return res.status(400).send('Duplicate category title.')

        await category.update({ title, description, view_order, is_visible, parent_id });

        res.status(201).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function deleteCategory(req, res) {
    try {
        const category = await Category.findOne({ where: { id: req.params.id }});
        if (!category) return res.status(404).send('Category not found.');

        await category.destroy();

        res.status(200).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

module.exports.getCategories = getCategories;
module.exports.createCategory = createCategory;
module.exports.getCategory = getCategory;
module.exports.updateCategory = updateCategory;
module.exports.deleteCategory = deleteCategory;