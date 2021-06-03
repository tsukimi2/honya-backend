import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).json({
    data: {
      message: 'Konnichiwa'
    }
  })
});

export default router
