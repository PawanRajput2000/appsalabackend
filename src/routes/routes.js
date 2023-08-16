const express = require("express")
const router = express.Router()

const { logIN, signIN ,getProfileDetails, following_app} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchSubcategory, fetchCategory } = require("../controller/category")
const { getProduct, saveProduct, productDetails, productListByCategory } = require("../controller/appschemaData")
const { authorisation, authentication } = require("../../middleware/middleware")
const { createComment } = require("../controller/commentController")

router.post('/signup', signIN)
router.post("/login", logIN)
router.put("/update-following-app/:userId",following_app)
router.get("/profile/:userId",getProfileDetails)


router.post("/review", review)



router.post("/category", savecategory)
router.get("/category", fetchCategory)
router.get("/subcategory", fetchSubcategory)


router.post("/create_products", saveProduct)
router.get("/products", getProduct)
router.post("/saved_product",authentication,saveProduct)



router.get("/category/:categoryname", productListByCategory)

router.get("/product-list/:slug", productDetails)

router.post("/comment/:userId/:applicationId",createComment)


module.exports = router