const express = require("express")
const router = express.Router()

const {logIN,signIN} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchcategory } = require("../controller/category")
const { getProduct, saveProduct, productDetails } = require("../controller/appschemaData")

router.post('/signup',signIN)
router.post("/login",logIN)


router.post("/review",review)



router.post("/category",savecategory)
router.get("/category",fetchcategory)

router.post("/create_products",saveProduct)
router.get("/products",getProduct)

router.get("/product-list/:slug", productDetails)




module.exports = router