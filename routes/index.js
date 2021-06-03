// var express = require('express');
// var router = express.Router();
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

// module.exports = router;
export default router
