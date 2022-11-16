const authController = require("../controller/auth");

module.exports = (app) => {
    app.post("/crm/api/v1/auth/signup", authController.signup);
}