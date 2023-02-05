const express = require('express');
const restaurantModel = require('../models/Restaurant');
const app = express();

//Read ALL
//http://localhost:8081/restaurants
app.get('/restaurants', async (req, res) => {
  // REST API to return the selected columns columns must include id, cuisines, name, city, resturant_id
  // The sorting by the restaurant_id in Ascending or Descending Order based on parameter passed.
  //http://localhost:8081/restaurants?sortBy=ASC
  //http://localhost:8081/restaurants?sortBy=DESC
  if (req.query.sortBy) {
    restaurants = await restaurantModel
      .find({})
      .select("restaurant_id cuisine city name _id")
      .sort({ restaurant_id: req.query.sortBy.toLowerCase() });
  } else {
    restaurants = await restaurantModel.find({});
  }
  try {
    res.status(200).send(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By Cuisine - PATH Parameter
//http://localhost:8081/restaurants/cuisine/Japanese
app.get('/restaurants/cuisine/:name', async (req, res) => {
  const name = req.params.name
  const restaurants = await restaurantModel.find({cuisine : name});
  try {
    if(restaurants.length != 0){
      res.send(restaurants);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create REST API to return restaurants details where all cuisines are equal to Delicatessen and the city is not equal to Brooklyn
// -	The selected columns must include cuisines, name and city, but exclude id
// -	The sorting order must be Ascending Order on the name

app.get("/restaurants/Delicatessen", async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({
      cuisine: "Delicatessen",
      city: { $ne: "Brooklyn" },
    });
    res.send(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});
//Create New Record
/*
    //Sample Input as JSON
    //application/json as Body
    {
      "cuisine":"Pritesh",
      "lastname":"Patel",
      "email":"p@p.com",
      "gender":"Male",
      "city":"Toronto",
      "designation":"Senior Software Engineer",
      "salary": 10000.50
    }
*/
//http://localhost:8081/restaurant
app.post('/restaurant', async (req, res) => {
  
    console.log(req.body)
    const restaurant = new restaurantModel(req.body);
    
    try {
      await restaurant.save((err) => {
        if(err){
          //Custome error handling
          //console.log(err.errors['cuisine'].message)
          //console.log(err.errors['lastname'].message)
          //console.log(err.errors['gender'].message)
          //console.log(err.errors['salary'].message)
          res.send(err)
        }else{
          res.send(restaurant);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Update Record
//http://localhost:8081/restaurant/60174acfcde1ab2e78a3a9b0
app.patch('/restaurant/:id', async (req, res) => {
  try {
    console.log(req.body)
    const restaurant =  await restaurantModel.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
    //const restaurant =  await restaurantModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
})

//Delete Record by ID
//http://localhost:8081/restaurant/5d1f6c3e4b0b88fb1d257237
app.delete('/restaurant/:id', async (req, res) => {
    try {
      const restaurant = await restaurantModel.findByIdAndDelete(req.params.id)

      if (!restaurant) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

  //Delete Record using findOneAndDelete()
//http://localhost:8081/restaurant/delete?emailid=5d1f6c3e4b0b88fb1d257237
app.get('/restaurant/delete', async (req, res) => {
  try {
    const restaurant = await restaurantModel.findOneAndDelete({email: req.query.emailid})

    if (!restaurant) 
    {
      res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
    }else{
      //restaurant.remove() //Update for Mongoose v5.5.3 - remove() is now deprecated
      res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
    }
  } catch (err) {
    res.status(500).send(err)
  }
})
module.exports = app

//Insert Multiple Records
/*
restaurantModel.create(
  [{"cuisine":"Keriann","lastname":"Qualtro","email":"kqualtro3@mediafire.com","gender":"Female","city":"Ulricehamn","designation":"Nurse Practicioner","salary":"9288.95"},
  {"cuisine":"Bette","lastname":"Elston","email":"belston4@altervista.org","gender":"Female","city":"Xinhang","designation":"Staff Accountant III","salary":"3086.99"},
  {"cuisine":"Editha","lastname":"Feasby","email":"efeasby5@ovh.net","gender":"Female","city":"San Francisco","designation":"Mechanical Systems Engineer","salary":"1563.63"},
  {"cuisine":"Letizia","lastname":"Walrond","email":"lwalrond6@ibm.com","gender":"Male","city":"Ricardo Flores Magon","designation":"Research Associate","salary":"6329.05"},
  {"cuisine":"Molly","lastname":"MacTrustrie","email":"mmactrustrie7@adobe.com","gender":"Female","city":"Banjarejo","designation":"Quality Control Specialist","salary":"4059.61"}]
)
*/