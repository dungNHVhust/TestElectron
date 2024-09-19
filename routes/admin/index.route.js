const dashboardRoutes = require("./dashboard.route.js");
const productRoutes = require("./product.route.js");
const systemConfix = require("../../config/system.js");

module.exports= (app) =>{
    const PATH_ADMIN = systemConfix.prefixAdmin;
    //Nhúng dashboard,products
    app.use(PATH_ADMIN+ "/dashboard",dashboardRoutes);
    app.use(PATH_ADMIN+ "/products",productRoutes);
            
}