const path = require("path");
const controller = require(path.join(process.cwd(), "src/modules/category/server/category.controllers"));
const { categorySchema } = require(path.join(process.cwd(), "src/modules/category/server/category.schema"));
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/user/server/user-authentication.middleware"));
const validate = require(path.join(process.cwd(), "src/modules/core/server/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/categories')
        .get(AuthStrategy, controller.getCategories)
        .post(AuthStrategy, validate(categorySchema), controller.createCategory);

    app.route('/api/categories/:id')
        .get(AuthStrategy, controller.getCategory)
        .put(AuthStrategy, validate(categorySchema), controller.updateCategory)
        .delete(AuthStrategy, controller.deleteCategory);
}