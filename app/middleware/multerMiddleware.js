const util = require("util");
const multer = require('multer');
const config = require("config");
require('dotenv').config();
const { MONGO_URI} = process.env;
const { GridFsStorage } = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: MONGO_URI + config.get('database'),
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["*"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-file-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: config.get('imgBucket'),
      filename: `${Date.now()}-file-${file.originalname}`
    };
  }
});

// var uploadFile = multer({storage: storage}).single('file');

var uploadFiles = multer({ storage: storage }).fields([
  { name: 'pachymetrie', maxCount: 1 },
  { name: 'echographieB', maxCount: 1 },
  { name: 'biometrie', maxCount: 1 },
  { name: 'champVisuel', maxCount: 1 },
  { name: 'retinographie', maxCount: 1 },
  { name: 'oct', maxCount: 1 },
  { name: 'radiographie', maxCount: 1 },
  { name: 'scannerOrbitaire', maxCount: 1 },
  { name: 'irm', maxCount: 1 },
  { name: 'echographie', maxCount: 1 }
]);

var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;