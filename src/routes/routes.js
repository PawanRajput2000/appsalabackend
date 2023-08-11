const express = require("express")
const router = express.Router()

const { logIN, signIN ,getProfileDetails} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchSubcategory, fetchCategory } = require("../controller/category")
const { getProduct, saveProduct, productDetails, productListByCategory } = require("../controller/appschemaData")
const { authorisation, authentication } = require("../../middleware/middleware")

router.post('/signup', signIN)
router.post("/login", logIN)
router.get("/profile/:userId",authentication,authorisation,getProfileDetails)


router.post("/review", review)



router.post("/category", savecategory)
router.get("/category", fetchCategory)
router.get("/subcategory", fetchSubcategory)


router.post("/create_products", saveProduct)
router.get("/products", getProduct)
router.get("/category/:categoryname", productListByCategory)

router.get("/product-list/:slug", productDetails)




module.exports = router