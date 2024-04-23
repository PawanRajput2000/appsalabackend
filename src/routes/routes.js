const express = require("express")
const router = express.Router()

const { logIN, signup ,getProfileDetails, following_app, updateUser,updateApplicationStatus,updatePricingInfoInUserSchema} = require("../controller/userRegistration")
const { review } = require("../controller/review")
const { savecategory, fetchSubcategory, fetchCategory } = require("../controller/category")
const { getProduct, savedProduct, productDetails, productListByCategory,createProduct, deleteFromSaved ,productpricing} = require("../controller/appschemaData")
const { authorisation, authentication } = require("../../middleware/middleware")
const { createComment, commentAndRating, deleteComment } = require("../controller/commentController")
const { createRating } = require("../controller/ratingController")

router.post('/signup', signup)
router.post("/login", logIN)
router.put("/update-following-app/:userId",following_app)
router.get("/profile/:userId",getProfileDetails)
router.put('/update-user/:userId', authentication,authorisation,updateUser)
router.put("/update-status/:applicationId",authentication,updateApplicationStatus)
router.put("/updatePricingInfoInUserSchema/:applicationId",authentication,updatePricingInfoInUserSchema)


router.post("/review", review)



router.post("/category", savecategory)
router.get("/category", fetchCategory)
//router.get("/subcategory", fetchSubcategory)


router.post("/create_products", createProduct)
router.get("/products", getProduct)
router.post("/saved_product/:applicationId",savedProduct)//authentication
router.post("/deleteFromSaved",authentication,deleteFromSaved)
router.get("/pricinginfo/:applicationId",productpricing)



router.get("/category/:categoryname", productListByCategory)

router.get("/product-list/:slug", productDetails)

router.post("/comment/:applicationId",createComment)//authentication


// Rating     
router.post("/rating/:applicationId",authentication ,createRating)
//commentAndRating 
router.get("/commentswithRating/:applicationId",authentication,commentAndRating)


//remove comment
router.delete("/deleteComment/:commentId",authentication,deleteComment)



module.exports = router