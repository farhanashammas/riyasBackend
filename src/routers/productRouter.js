var express = require('express');
var { productModel } = require('../models/productModel');
var { signupUserModel } = require('../models/signupUserModel');
// var { registerUserModel } = require('../models/registerUserModel');
var productRouter = express.Router();
// var { dataModel } = require('../models/dataModel');
const path = require('path');
const auth = require('./auth');
var fs = require('fs');
var multer = require('multer');
const userAuth = require('./userAuth');
//var util = require('util');
var parent = path.dirname(path.dirname(__dirname));
var upload = multer({
    limits: { fileSize: 20000000 }, dest: path.join(parent, "/public/images")
});

function route() {

    //Admin
    productRouter.route('/addItem')
        .post(auth.required, upload.single('image'), (req, res) => {
            userAuth(req.body.userId).then((user) => {
                if (user == "admin") {
                    console.log("admin")
                    if (req.file == null)
                        res.json({ Status: "Choose a File" });
                    else {
                            var newImg = fs.readFileSync(req.file.path);
                            var encImg = newImg.toString('base64');
                            var img = new Buffer(encImg, 'base64');
                            var product = {
                            image: {
                                contentType: req.file.mimetype,
                                size: req.file.size,
                                img: img
                            },
                            productName: req.body.productName,
                            productCategory: req.body.productCategory,
                            productPrice: req.body.productPrice,
                            productColor: req.body.productColor,
                            productBrand: req.body.productBrand,
                            productCamera: req.body.productCamera,
                            productMemory: req.body.productMemory,
                            productProcessor: req.body.productProcessor,
                            productAvailability: req.body.productAvailability,
                            productDescription:req.body.productDescription
                        }
                        var product = new productModel(product);
                        product.save(
                        (err, result) => {
                            if (err) 
                                return res.json({ Status: "Error" });
                            else {
                                fs.unlink(req.file.path, (err) => {
                                    if (err) 
                                        return res.json({ Status: "Error" })
                                    else 
                                        return res.json({ Status: "Success" });
                                });
                            }
                        });
                    }
                }
                else 
                    return res.json({ Status: "Error" });
            }).catch((err) => {
                console.log(err)
                console.log("catch error")
                res.json({ Status: "Error" });
            });
        });


        
    productRouter.route('/showproducts')
    .post(auth.required, (req, res) => {
        productModel.find( (err, result) => {
            if (err || !result) 
                res.json({ Status: "Error" })
            else {
                console.log("rs :" + result)
                var data = new productModel(result);
                let i = [];
                for (product of result) {
                    let b = product.image.img.toString('base64');
                    let itemModel = {
                            image: b,
                            productName: product.productName,
                            productCategory: product.productCategory,
                            productPrice: product.productPrice,
                            productColor: product.productColor,
                            productBrand: product.productBrand,
                            productCamera: product.productCamera,
                            productMemory: product.productMemory,
                            productProcessor: product.productProcessor,
                            productAvailability: product.productAvailability,
                            productDescription:product.productDescription,
                            _id: product._id,
                    }
                    i.push(itemModel);
                }
                data = i;
                res.json({  data });
            }
        });
    });




    productRouter.route('/itemfetch')
        .post(auth.required, (req, res) => {
            userAuth(req.body.userId).then((user) => {
                if (user == "admin" || user == "user") {
                    productModel.findById( req.body.itemId, (err, data) => {
                        if (err || !data) 
                            res.json({ Status: "Error" })
                        else {
                            var product = new productModel(data);
                            let b = product.image.img.toString('base64');
                            let itemModel = {
                            image: b,
                            productCategory:product.productCategory,
                            productName: product.productName,
                            productCategory: product.productCategory,
                            productPrice: product.productPrice,
                            productColor: product.productColor,
                            productBrand: product.productBrand,
                            productCamera: product.productCamera,
                            productMemory: product.productMemory,
                            productProcessor: product.productProcessor,
                            productAvailability: product.productAvailability,
                            productDescription:product.productDescription,
                            _id: product._id,
                    }
                    console.log(product)
                    res.json({ 'item': itemModel, Status: "Success" });
                    }
                    });
                }
                else 
                    res.json({ Status: "Error" });
            }).catch(() => {
                res.json({ Status: "Error" });
            });
        });




        
    //Admin
    productRouter.route('/editItem')
    .post(auth.required, (req, res) => {
        userAuth(req.body.userId).then((user) => {
            if (user == "admin") {
                // console.log("admin")
                console.log("update data"+req.body.itemId)
                    //  var product = new productModel();
                    //  console.log(product)
                    productModel.findByIdAndUpdate(req.body.itemId,{"$set":{productName:req.body.productName,
                        productCategory:req.body.productCategory,productPrice:req.body.productPrice,productColor:req.body.productColor,
                        productBrand:req.body.productBrand,productCamera:req.body.productCamera,productMemory:req.body.productMemory,
                        productProcessor:req.body.productProcessor,productAvailability:req.body.productAvailability,
                        productDescription:req.body.productDescription}},
                    (err, result) => {
                    if (err) {
                        console.log(err)
                        return res.json({ Status: "Error update" });
                    }
                    else 
                        return res.json({ Status: "Success" });
                });
            }
            else 
                return res.json({ Status: "Error admin" });
        }).catch((err) => {
            res.json({ Status: "Error catch" });
        });
    });
    // {productBrand:req.body.productBrand,productPrice:req.body.productPrice,
    //     productCamera:req.body.productCamera,productMemory:req.body.productMemory,productProcessor:req.body.productProcessor,
    //     productAvailability:req.body.productAvailability,productColor:req.body.productColor,productDescription:req.body.productDescription}

    
    
    //Admin
    productRouter.route('/deleteItem')
        .post(auth.required, (req, res) => {
            userAuth(req.body.userId).then((user) => {
                if (user == "admin") {
                    var itemId = req.body.itemId;
                    productModel.findByIdAndDelete( itemId, (err, result) => {
                        if (err) 
                            return res.json({ Status: "Error" });
                        else
                            return res.json({ Status: "Success" });
                    });
                }
                else 
                    return res.json({ Status: "Error" });
            }).catch((err) => {
                res.json({ Status: "Error" });
            });
        });


         
    productRouter.route('/filter')
    .post(auth.required, (req, res) => {
        console.log(req.body)
        productModel.find({productCategory:req.body.category}, (err, result) => {
            if (err || !result) 
                res.json({ Status: "Error" })
            else {
                console.log("rs :" + result)
                var data = new productModel(result);
                let i = [];
                for (product of result) {
                    let b = product.image.img.toString('base64');
                    let itemModel = {
                            image: b,
                            productName: product.productName,
                            productCategory: product.productCategory,
                            productPrice: product.productPrice,
                            productColor: product.productColor,
                            productBrand: product.productBrand,
                            productCamera: product.productCamera,
                            productMemory: product.productMemory,
                            productProcessor: product.productProcessor,
                            productAvailability: product.productAvailability,
                            productDescription:product.productDescription,
                            _id: product._id,
                    }
                    i.push(itemModel);
                }
                data = i;
                res.json({  data });
            }
        });
    });
        


    return productRouter;
}
module.exports = route;
