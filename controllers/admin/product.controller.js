const Product = require("../../models/product.model.js");
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const systemConfig = require("../../config/system.js")
// [GET] /admin/products
module.exports.index = async (req, res) => {
  //Đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
 // Tìm kiếm 
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex){
    find.title = objectSearch.regex;
  }
  // Pagination
  let objectPagination = {
    currentPage: 1,
    limitItem : 4
  };
  if(req.query.page){
    objectPagination.currentPage=parseInt(req.query.page);
  }

  objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItem;
  const countProducts = await  Product.countDocuments(find);
  const totalPage = Math.ceil(countProducts/objectPagination.limitItem);
  objectPagination.totalPage = totalPage;
  //End Pagination

  const product = await Product.find(find).sort({position:"desc"}).limit(objectPagination.limitItem).skip(objectPagination.skip);
  // console.log(req.query.status);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang sản phẩm",
    product: product,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({_id: id},{status:status});

  req.flash("success","Cập nhật trạng thái thành công!");

  // Redirect về trang trước
  const previousPage = req.get('Referer'); // Lấy URL trang trước
  res.redirect(previousPage);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req,res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  // console.log(type);
  // console.log(ids);
  switch (type) {
    case "active":
      await Product.updateMany({ _id: {$in: ids} },{status:"active"});
      req.flash("success",`Cập nhật trạng thái ${ids.length} sản phẩm thành công !`);
      break;
    case "inactive":
      await Product.updateMany({ _id: {$in: ids} },{status:"inactive"});
      req.flash("success",`Cập nhật trạng thái ${ids.length} sản phẩm thành công !`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: {$in: ids} },{
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success",`Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id,position] = item.split("-");
        position=parseInt(position);
        await Product.updateOne({_id: id},{
          position:position
        });
      }
      req.flash("success",`Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
      break;
    default:
      break;
  }
  // Redirect về trang trước
  const previousPage = req.get('Referer'); // Lấy URL trang trước
  res.redirect(previousPage);
}
// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req,res) => {
  const id = req.params.id;
  await Product.updateOne({_id: id},{
    deleted:true,
    deletedAt: new Date()
  });
  // Redirect về trang trước
  const previousPage = req.get('Referer'); // Lấy URL trang trước
  res.redirect(previousPage);
}

// [GET] /admin/products/create
module.exports.create = (req,res) => {
  res.render("admin/pages/products/create",{
    pageTitle:"Thêm mới sản phẩm",
  });
};

// [POST] /admin/products/create
module.exports.createPost =async (req,res) => {

  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`)
};
// [GET] /admin/products/edit/:id
module.exports.edit =async (req,res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit",{
      pageTitle:"Chỉnh sửa sản phẩm",
      product:product
    });
  }catch(error){
    req.flash("error","Không tồn tại sản phẩm này");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [PATCH] /admin/products/edit/id
module.exports.editProduct =async (req,res) => {
  const id =req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const product = new Product(req.body);
  try{
    await Product.updateOne({_id: id},req.body);
    req.flash("success","Cập nhật thành công !!!");
  }catch(error) {
    req.flash("error","Cập nhật thất bại !!!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  res.redirect(`${systemConfig.prefixAdmin}/products/edit/${id}`);
};

// [GET] /admin/products/detail/:id
module.exports.detail =async (req,res) => {
  try{
    const find =  {
      deleted:false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
    res.render(`admin/pages/products/detail`,{
      pageTitle: product.title,
      product:product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};