const multer = require('multer'); //Import multer
const path = require('path'); // Import path để xử lý đuôi tệp
const { pathRandomKey } = require('../config/system');
module.exports = () => {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, './public/uploads/');
        },
        filename: function(req, file, cb) {
          const ext = path.extname(file.originalname); // Lấy đuôi tệp
          cb(null, file.fieldname + '-'+ Date.now()+ pathRandomKey + ext);
        },
      });
      
    //   var upload = multer({ storage: storage });
      return storage;
}