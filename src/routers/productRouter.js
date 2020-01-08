var express = require('express');
var { productModel } = require('../models/productModel');
var { signupUserModel } = require('../models/signupUserModel');
// var { registerUserModel } = require('../models/registerUserModel');
var productRouter = express.Router();
var { dataModel } = require('../models/dataModel');
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



     //Admin & User
     productRouter.route('/')
     .post(auth.required, (req, res) => {
         console.log("before search: " + req.body.userId);
         userAuth(req.body.userId)
             .then((user) => {
                 console.log(user);
                 if (user == "user" || user == "admin") {
                     productModel.find({}, null, { $sort: { _id: 1 }}, (err, result) => {
                         if (err) {
                             return res.json({ Status: "Error" });
                         }
                         if (result) {
                             data = [];

                             console.log(result);

                            //  for (i of result) {
                            //      let a = i.image.img.toString('base64');
                            //      var temp = new productModel(i);
                            //      temp.image = a;
                            //      data.push(temp);
                            //  }
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
                                data.push(itemModel);
                            }

                             return res.json({ restaurants: data });
                         }
                     });
                 }
                 
                 else {
                     return res.json({ Status: "Error" });
                 }

             }).catch((err) => {
                 return res.json({ Status: "Error" });
             });
     });



 //Admin & User
 productRouter.route('/search')
     .post(auth.required, (req, res) => {
         console.log("search " + req.body.userId)
         userAuth(req.body.userId).then((user) => {
             if (user == "user" || user == "admin") {
                 var count = Number(req.body.count);
                 var fieldType;
                 if (req.body.fieldType == "productName") {
                     fieldType = "productName";
                 }
                 else {
                     fieldType = req.body.fieldType;
                 }
                 var value = req.body.searchKey;
                 console.log("field " + fieldType)
                 // var query = {};
                 //query[fieldType] =  new RegExp(value， ‘i');

                 productModel.countDocuments({[fieldType]:new RegExp(value,'i')})
                     .then((totalDocs) => {
                         productModel.find({ [fieldType]: new RegExp(value, 'i') }, null, { $sort: { _id: 1 }, skip: count, limit: 10 }, (err, result) => {
                             if (err) {
                                 return res.json({ Status: "Error" });
                             }
                             if (result) {
                                 console.log(result);
                                 data = [];


                                //  for (i of result) {
                                //      let a = i.image.img.toString('base64');
                                //      var temp = new productModel(i);
                                //      temp.image = a;
                                //      data.push(temp);
                                //  }

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
                                    data.push(itemModel);
                                }

                                 return res.json({ restaurants: temp, totalDocs: totalDocs });
                             }
                             else {
                                 return res.json({ Status: "Not Found" });
                             }
                         });
                     })
             }
             else {
                 return res.json({ Status: "Error" });
             }
         }).catch((err) => {
             return res.json({ Status: "Error" });
         });
     });



     
    //User
    productRouter.route('/feedback')
    .post(auth.required, (req, res) => {
        userAuth(req.body.userId).then((user) => {
            if (user == "user") {
                console.log(req.body);
                productModel.findById(req.body.resId)
                    .then((result) => {
                        console.log(result);
                        var userCount = Number(req.body.userCount);

                        var totalRating = result.totalRating;

                        var userRating = result.userRating;
                        console.log(userRating);
                        if (userCount == 1) {
                            userRating.one = userRating.one + 1;
                        }
                        else if (userCount == 2) {

                            userRating.two = userRating.two + 1;
                            console.log(userRating);
                        }
                        else if (userCount == 3) {
                            userRating.three = userRating.three + 1;
                        }
                        else if (userCount == 4) {
                            userRating.four = userRating.four + 1;
                        }
                        else {
                            userRating.five = userRating.five + 1;
                        }

                        var oneStar = userRating.one;
                        var twoStar = userRating.two;

                        var threeStar = userRating.three;
                        console.log("total rating");
                        var fourStar = userRating.four;

                        var fiveStar = userRating.five;

                        var totalRating = (1 * oneStar + 2 * twoStar + 3 * threeStar + 4 * fourStar + 5 * fiveStar) / (oneStar + twoStar + threeStar + fourStar + fiveStar);
                        console.log(totalRating);
                        productModel.findByIdAndUpdate(req.body.resId, { $set: { userRating: userRating, totalRating: totalRating } }, (err, result) => {
                            if (result) {
                                return res.json({ Status: "rating Success" });
                            }
                            else {
                                return res.json({ Status: "result Error" });
                            }
                        });
                    }).catch((err) => {
                        res.json({ Status: "catch Error" });
                    });
            }
        }).catch((err) => {
            res.json({ Status: " user Error" });
        });
    })




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
