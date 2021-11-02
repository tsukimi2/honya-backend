// import util from 'util'
import multer from 'multer'
import {GridFsStorage} from 'multer-gridfs-storage'
import config from '../libs/config/index.js'
import { database } from '../di-container.js'

const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

const dburi = `mongodb://${config.get("db:mongo:host")}:${config.get("db:mongo:port")}/${config.get("db:mongo:schema")}`
const dbconn = await database.getConnection(dburi)

const storage = new GridFsStorage({
  // url: `mongodb://${config.get("db:mongo:host")}:${config.get("db:mongo:port")}/${config.get("db:mongo:schema")}`,
  // options: clientOptions,
  db: dbconn,
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"]
    const filename = `${Date.now()}-${config.get("db:mongo:schema")}-${file.originalname}`

    if (match.indexOf(file.mimetype) === -1) {
      return filename
    }

    return {
      bucketName: "photos",
      filename
    };
  }
});

// const uploadFile = multer({ storage: storage }).single("file")
// const uploadFilesMiddleware = util.promisify(uploadFile)
const upload = multer({ storage: storage })
export default upload


/*
const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/bezkoder_files_db",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-bezkoder-${file.originalname}`
    };
  }
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
*/