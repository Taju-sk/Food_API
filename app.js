const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

let app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.listen(8080, function () {
    console.log("Server started on port 8080");
});

// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/Wikidb");
// mongoose.connect("mongodb://localhost:27017/Wikidb", {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
// });

// Create schema for collection
const foodSchema = {
    foodItemName: String,
    foodGroup: String,
    description: String,
    nutritionalInformation: String,
    servingSize: String,
    allergens: String,
    ingredients: String,
    preparationMethods: String,
    certifications: String,
    countryOfOrigin: String,
    brandOrManufacturer: String,
    dietaryRestrictions: String,
    healthBenefits: String,
    bestPractices: String,
};

// create model
const FoodData = mongoose.model("Article", foodSchema);

// Get all food items
app.get("/food", function (req, res) {
    FoodData.find({})
        .then((data) => {
            if (data && data.length > 0) {
                res.send(data);
            } else {
                res.send("No data found");
            }
        })
        .catch((error) => {
            console.log(error);
        });
});


//finding one Food Item
app.get("/food/:foodItemName", async function (req, res) {
    const foodItemTitle = req.params.foodItemName;
    console.log("Requested food item name:", foodItemTitle);

    try {
        const data = await FoodData.findOne({ foodItemName: foodItemTitle });
        if (data) {
            res.send(data);
        } else {
            res.send("No data found for the title");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});


// post a new food item
app.post("/new_food", function (req, res) {
    const {
        foodItemName,
        foodGroup,
        description,
        nutritionalInformation,
        servingSize,
        allergens,
        ingredients,
        preparationMethods,
        certifications,
        countryOfOrigin,
        brandOrManufacturer,
        dietaryRestrictions,
        healthBenefits,
        bestPractices,
    } = req.body;

    // create new food instance
    const newFoodData = new FoodData({
        foodItemName: foodItemName,
        foodGroup: foodGroup,
        description: description,
        nutritionalInformation: nutritionalInformation,
        servingSize: servingSize,
        allergens: allergens,
        ingredients: ingredients,
        preparationMethods: preparationMethods,
        certifications: certifications,
        countryOfOrigin: countryOfOrigin,
        brandOrManufacturer: brandOrManufacturer,
        dietaryRestrictions: dietaryRestrictions,
        healthBenefits: healthBenefits,
        bestPractices: bestPractices,
    });

    newFoodData
        .save()
        .then((createdFoodData) => {
            res.status(201).send(createdFoodData);
        })
        .catch((error) => {
            console.log(error);
        });
});



// update a food item using PUT Menthod
app.put("/update_food/:id", function (req, res) {
    const FoodId = req.params.id;
    console.log("Received PUT request for FoodId:", FoodId);
    const {
        foodItemName,
        foodGroup,
        description,
        nutritionalInformation,
        servingSize,
        allergens,
        ingredients,
        preparationMethods,
        certifications,
        countryOfOrigin,
        brandOrManufacturer,
        dietaryRestrictions,
        healthBenefits,
        bestPractices,
    } = req.body;

    // check if the Food id is a valid Mongodb ObjectId
    if (!mongoose.Types.ObjectId.isValid(FoodId)) {
        return res.status(400).send("Invalid Food Id");
    }

    // update the Food by id using FoodData model
    FoodData.findByIdAndUpdate(
        FoodId,
        {
            foodItemName,
            foodGroup,
            description,
            nutritionalInformation,
            servingSize,
            allergens,
            ingredients,
            preparationMethods,
            certifications,
            countryOfOrigin,
            brandOrManufacturer,
            dietaryRestrictions,
            healthBenefits,
            bestPractices,
        },
        { new: true } // to return the updated Food
    )
        .then((updatedFood) => {
            if (updatedFood) {
                res.send(updatedFood);
            } else {
                res.status(404).send("Food not found");
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error");
        });
});

// delete method
app.delete("/delete_food/:id", function (req, res) {
    const FoodId = req.params.id;

    // check if the food id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(FoodId)) {
        return res.status(400).send("Invalid food Id");
    }

    // delete the food by id using FoodData model
    FoodData.findByIdAndDelete(FoodId)
        .then((deletedFood) => {
            if (deletedFood) {
                res.send("Food item deleted successfully");
            } else {
                res.status(404).send("Food item not found");
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error");
        });
});


//delete all
app.delete("/delete_all", function (req, res) {
    FoodData.deleteMany({})
        .then(() => {
            res.send("All articles are deleted Succesfully");
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal server error");
        });
});
