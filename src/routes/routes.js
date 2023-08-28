const express = require("express")
const router = express.Router()

const { logIN, signup ,getProfileDetails, following_app} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchSubcategory, fetchCategory } = require("../controller/category")
const { getProduct, savedProduct, productDetails, productListByCategory,createProduct, deleteFromSaved } = require("../controller/appschemaData")
const { authorisation, authentication } = require("../../middleware/middleware")
const { createComment, commentAndRating, deleteComment } = require("../controller/commentController")
const { createRating } = require("../controller/ratingController")

router.post('/signup', signup)
router.post("/login", logIN)
router.put("/update-following-app/:userId",following_app)
router.get("/profile/:userId",getProfileDetails)


router.post("/review", review)



router.post("/category", savecategory)
router.get("/category", fetchCategory)
router.get("/subcategory", fetchSubcategory)


router.post("/create_products", createProduct)
router.get("/products", getProduct)
router.post("/saved_product",authentication,savedProduct)
router.post("/deleteFromSaved",authentication,deleteFromSaved)



router.get("/category/:categoryname", productListByCategory)

router.get("/product-list/:slug", productDetails)

router.post("/comment/:applicationId",authentication,createComment)


// Rating 
router.post("/rating/:applicationId",authentication ,createRating)
//commentAndRating 
router.get("/commentswithRating/:applicationId",authentication,commentAndRating)


//remove comment
router.delete("/deleteComment/:commentId",authentication,deleteComment)



module.exports = router