
const Product = require("../../models/product.model.js");
// [GET] /products
module.exports.product = async (req, res) => {
  let find = {
    deleted : false,
    status: "active",
  }
  
  // Pagination 
  let objectPagination = {
    currentPage: 1,
    limitItem : 6
  };
  if(req.query.page){
    objectPagination.currentPage = parseInt(req.query.page);
  }
  objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItem;
  const countProducts = await Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
  objectPagination.totalPage = totalPage;

  const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItem).skip(objectPagination.skip);
  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang sản phẩm",
    products: newProducts,
    pagination: objectPagination
  });

};
// [GET] /products/:slug
module.exports.detail = async (req,res) => {
  try{
    const find =  {
      deleted:false,
      slug: req.params.slug
    };
    const product = await Product.findOne(find);
    product.priceNew = (
      (product.price * (100 - product.discountPercentage)) /100
    ).toFixed(0)
    res.render(`client/pages/products/detail.pug`,{
      pageTitle: product.title,
      product:product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
  
}

