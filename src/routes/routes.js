const express = require("express")
const router = express.Router()

const {logIN,signIN} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchcategory } = require("../controller/category")
const { getProduct, saveProduct, productDetails } = require("../controller/appschemaData")

router.post('/signup',signIN)
router.get("/login",logIN)


router.post("/review",review)



router.post("/category",savecategory)
router.get("/category",fetchcategory)

router.post("/create_products",saveProduct)
router.get("/products",getProduct)

router.get("/product-list/:name", productDetails)




module.exports = router