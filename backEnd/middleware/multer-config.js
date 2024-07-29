const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require('path');



const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
const upload = multer({storage: storage}).single('image');
// optimisation de l'image
const optimize = (req, res, next) => {
  if (req.file) {
    const imagePath = req.file.path; 
    const newFileName = req.file.filename.replace(/\.[^/.]+$/, ".webp");
    const outPut = path.join('images', newFileName);
    sharp.cache(false);
    sharp(imagePath)
      .resize(({width: 595, height: 595,  fit: 'cover' }))
      .webp({ quality: 80 })
      .toFile(outPut)
      .then(()=> {
        fs.unlink(imagePath, (error)=>{
          if (error){
            console.log(error);
            return next (error);
          }
          req.file.path = outPut;
          req.file.filename = newFileName;
          console.log("image optimisée" + outPut);
          next();

        })
      })
      .catch(error =>{
        console.error("Error during image optimization: ", error);
        next(error);
      });

  } else {
    return next();
  }
 }
module.exports = {upload, optimize };