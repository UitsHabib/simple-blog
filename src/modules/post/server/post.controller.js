const path = require("path");
const User = require(path.join(process.cwd(), "src/modules/user/server/user.model"));
const Post = require(path.join(process.cwd(), "src/modules/post/server/post.model"));
const Category = require(path.join(process.cwd(), "src/modules/category/server/category.model"));

async function createPost(req, res) {
    try {
        const { category_id, title, content, view_order, is_visible } = req.body;

        const post = await Post.create({
            user_id: req.user.id,
            category_id,
            title,
            content,
            view_order,
            is_visible
        });

        res.status(200).send(post);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function getPosts(req, res) {
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
            "content",
            "view_order",
            "is_visible"
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        if (orderBy === "category") {
            order.splice(0, 0, [
                { model: Category, as: "category" },
                "first_name",
                orderType
            ]);
        }

        if (orderBy === "user") {
            order.splice(0, 0, [
                { model: User, as: "user" },
                "first_name",
                orderType
            ]);
            order.splice(1, 0, [
                { model: User, as: "user" },
                "last_name",
                orderType
            ]);
        }

        const posts = await Post.findAll({ 
            offset, 
            limit, 
            order,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: { exclude: ['created_at', 'updated_at'] }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name']
                }
            ]
        });

        const total = await Post.count();

        const data = {
            posts,
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

async function getPost(req, res) {
    try {
        const post = await Post.findOne({ 
            where: { id: req.params.id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: { exclude: ['created_at', 'updated_at'] }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name'],
                }
            ]
        });
        
        if(!post) return res.status(404).send('Post not found.');

        res.status(200).send(post);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function updatePost(req, res) {
    try {
        const { category_id, title, content, view_order, is_visible } = req.body;

        const post = await Post.findOne({ where: { id: req.params.id }});

        if(!post) return res.status(404).send('Post not found.');

        await post.update({ category_id, title, content, view_order, is_visible });

        res.status(200).send(post);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function deletePost(req, res) {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});

        if(!post) return res.status(404).send('Post not found.');

        await post.destroy();

        res.status(200).send(post);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

module.exports.createPost = createPost;
module.exports.getPost = getPost;
module.exports.getPosts = getPosts;
module.exports.updatePost = updatePost;
module.exports.deletePost = deletePost; 

