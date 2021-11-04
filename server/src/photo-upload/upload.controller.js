import util from 'util'
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
// import config from '../libs/config/index.js'
// import { clientOptions as dbClientOptions } from '../libs/database/index.js'
// import { database } from '../di-container.js'

const uploadFileController = ({ config, database }) => {
  const upload = async (req, res, next) => {
    const dburi = `mongodb://${config.get("db:mongo:host")}:${config.get("db:mongo:port")}/${config.get("db:mongo:schema")}`
    const dbconn = database.getConnection(dburi)
  console.log('dbconn')
  console.log(dbconn)
  
    const storage = new GridFsStorage({
      // url: `mongodb://${config.get("db:mongo:host")}:${config.get("db:mongo:port")}/${config.get("db:mongo:schema")}`,
      // options: dbClientOptions,
      db: dbconn,
      file: (req, file) => {
    console.log('file')
    console.log(file)
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
    })
  
    /*
    const uploadFile = multer({
      storage,
      limits: { fileSize: config.get('app:img:max_img_size')}
    }).single("file")
    */
  
    const uploadFile = multer({
      storage,
      limits: { fileSize: config.get('app:img:max_img_size')}
    })
  
    //const asyncUploadFile = util.promisify(uploadFile)
    await uploadFile.single('file')
console.log('upload')    
console.log('req file')
console.log(req.file)
  }

  return {
    upload
  }
}

export default uploadFileController

/*
const storage = new GridFsStorage({
  url: `mongodb://${config.get("db:mongo:host")}:${config.get("db:mongo:port")}/${config.get("db:mongo:schema")}`,
  options: dbClientOptions,
  file: (req, file) => {
console.log('file')    
console.log(file)
    const match = ["image/png", "image/jpeg"]
    const filename = `${Date.now()}-${config.get("db:mongo:schema")}-${file.originalname}`;

    if (match.indexOf(file.mimetype) === -1) {
      return filename
    }

    return {
      bucketName: "photos",
      filename
    };
  }
})

const uploadFile = multer({
  storage,
  limits: { fileSize: config.get('app:img:max_img_size')}
}).single("file")
// const uploadFile = multer({ storage }).single("photo")
const uploadFilesMiddleware = util.promisify(uploadFile)

export default uploadFilesMiddleware
*/
