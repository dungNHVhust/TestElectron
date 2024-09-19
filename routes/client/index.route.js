const homeRoutes = require("./home.route.js")
const productRoutes = require("./product.route.js")

module.exports= (app) =>{
    //Nhúng home
    app.use("/",homeRoutes);
            
    //Nhúng product
    app.use("/",productRoutes);
}