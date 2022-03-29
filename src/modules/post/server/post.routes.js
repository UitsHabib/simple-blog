const path = require("path");
const controller = require(path.join(process.cwd(), "src/modules/post/server/post.controller"));
const { postSchema } = require(path.join(process.cwd(), "src/modules/post/server/post.schema"));
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/user/server/user-authentication.middleware"));
const validate = require(path.join(process.cwd(), "src/modules/core/server/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/posts')
        .get(controller.getPosts)
        .post(AuthStrategy, validate(postSchema), controller.createPost);

    app.route('/api/posts/:id')
        .get(controller.getPost)
        .put(AuthStrategy, validate(postSchema), controller.updatePost)
        .delete(AuthStrategy, controller.deletePost);
};
