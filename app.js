const mongoose = require("mongoose");
require("./db")
const express = require("express")
const app = express();
const cors = require("cors")

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())



const Enquiry = require("./model/EnquiryModel");
const Shirt = require("./model/ShirtModel")
const Cargo = require('./model/CargoModel');
const Chain = require('./model/ChainModel');
const SweatShirt = require('./model/SweatShirtModel');
const BestSeller = require('./model/BestSellerModel');
const Tshirt = require('./model/TshirtModel');
const Necktshirt = require('./model/NecktshirtModel');
const Home = require('./model/HomeModel');
const usersModel = require('./model/UserModel');
const UserModel = require("./model/UserModel");
const  jwt  = require("jsonwebtoken");
const  tok = require("jsonwebtoken")
const auth = require("./auth");
const FuserModel = require("./model/FuserModel");
const routeAuth1 = require("./routeAuth1");
const Cart = require('./model/CartModel');
const CartModel = require('./model/CartModel')
const adminAuth = require("./adminAuth");
const AdminModel = require("./model/AdminModel");
const Order = require('./model/OrderModel')
const cartRoute = require("./cartRoute")
const Fuser = require("./model/FuserModel")
const getUserRoute = require("./getUserRoute")

app.use(getUserRoute)
app.use("/", cartRoute)



//  getUser

app.get("/getuser", routeAuth1, async (req, res) => {
  try {
    const user = await FuserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//---------------------------

// Adminlogin ----------------- //
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await AdminModel.findOne({ email });

  if (!admin || admin.password !== password) {
    return res.status(400).json({ message: "Invalid admin credentials" });
  }

  const payload = { user: { id: admin._id } };
  const token = jwt.sign(payload, "adminsecret", { expiresIn: "1h" });

  res.json({ message: "Admin login successful", token });
});


//  Signup------------------------------------
app.post("/signup", async (req, res) => {
    const {email, password, cpassword} = req.body;
    let exist =await usersModel.findOne({email: email})
    //already exists
    if(exist){
        return res.status(400)/express.json({ message : "Email already exist"})
    }
    //password confirmation
    if (password !== cpassword){
        return res.status(400).json({ message: "Password and Confirm Password Doesn't match"})
    }

    const signup = new UserModel(req.body)
    const result = await signup.save();
    res.json({ message: "Signup Successfull", result: result})
}) 
// Login -----------------------------
app.post('/Clogin', async(req, res) => {
    const {email, password} = req.body;
    const exists = await UserModel.findOne({ email: email});
    if(!exists){
        return res.status(400).json ({message: "Email doesn't exists"})
    }
    //password match
    if(exists.password !== password){
        return res.status(400).json({ message: "Password Doesn't Match"})
    }
    //payload
        const payload = {
            user: {
                id: exists._id,
            }
        }
    //jwt creation
        const token = jwt.sign(payload, "jsonSecret", {expiresIn: '7d'})
        res.json({message: "Login Successfull", token: token})
})
//Protected Route
app.get("/dashboard",adminAuth, async (req, res) => {
    const admin = await AdminModel.findById(req.user.id);
    if(!admin)
        return res.status(403).json({ message: "Access denied"})
    
        res.json(admin)
})
// ------------------------------------






//--------------- userLogin -----------------
app.post("/signin", async (req, res) => {
    const {email, password, cpassword} = req.body;
    let exist = await FuserModel.findOne({email: email})

    //already exists
    if(exist){
        return res.status(400).json({message: "Email already exist"})
    }
    //password confirmation
    if(password !== cpassword){
        return res.status(400).json({ message: "Password and Confirm Password doesn't match"})
    }

    const signup = new FuserModel(req.body)
    const result = await signup.save();
    res.json({ message: "Signup Successfull", result: result})
})

app.post("/Ulogin", async (req, res) => {
    const {email, password} = req.body;
    const exists = await FuserModel.findOne({email:email});
    if(!exists){
        return res.status(400).json({ message: "Email doesn't exists"})
    }
    if(exists.password !== password){
        return res.status(400).json({message:"Password doesn't match"})
    }
    const payload = {
        user: {
            id: exists._id,
        }
    }

    const token = tok.sign(payload, "jsonSecret", { expiresIn: '7d' });
    res.json({ message: "Login Successful", token });    })

app.get("/fuser", routeAuth1, async (req, res) => {
    const exists = await FuserModel.findOne({ _id: req.user.id });
    if (!exists) {
        return res.status(400).json({ message: "You are not authorized" });
    } else {
        res.json(exists);
    }
});
//----------------------------------------------
//  CREATE enquiry
app.post("/enquiries", async (req, res) => {
    const enquiry = new Enquiry(req.body);
    const result = await enquiry.save();
    res.send(result);
});

//  READ all enquiries
app.get("/enquiries", async (req, res) => {
    const enquiries = await Enquiry.find();
    if(enquiries.length > 0){
    res.send(enquiries);
    }else{
    res.send("No Enquiries found")
}
});

// READ a single enquiry
app.get("/enquiries/:_id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findById( req.params._id );
    if (!enquiry) {
      return res.status(404).send("Enquiriy is not founded")
    } res.send(enquiry)
  } catch (err) {
    res.status(400).send({ error: "Error fetching enquiry" });
  }
});


//  UPDATE
app.put("/enquiries/:_id", async (req, res) => {
    const _id = req.params._id
    const enquiry = await Enquiry.updateOne({_id: _id}, {$set:req.body});
    res.send(enquiry)
});

//  DELETE an enquiry
app.delete("/enquiries/:_id", async (req, res) => {
    const _id = req.params._id;
    const enquiry = await Enquiry.deleteOne({_id: _id});
    res.send(enquiry);
});



// --------------cart-----------------------
// app.post("/cart", routeAuth1, async (req, res) => {
//   const { id } = req.user;
//   const product = req.body;

//   if (!id || !product) return res.status(400).send("Missing user or product");

//   try {
//     let cart = await CartModel.findOne({ userId: id });

//     if (!cart) {
//       cart = new CartModel({ userId: id, items: [product] });
//     } else {
//       // Check if item already in cart
//       const itemExists = cart.items.find((item) => item.id === product.id);
//       if (itemExists) {
//         itemExists.quantity += 1;
//       } else {
//         cart.items.push(product);
//       }
//     }

//     await cart.save();
//     res.status(200).json({ message: "Item added to cart", cart });
//   } catch (error) {
//     console.error("❌ Error adding to cart:", error.message);
//     res.status(500).send("Server error");
//   }
// });
// app.get('/Cart/:_id', async (req, res) =>{
//     const _id = req.params._id;
//     const cart = await Cart.findOne({_id: _id})
//     res.send(cart)
// })


// app.delete('/Cart/:_id', async (req, res) =>{
//     const _id = req.params._id;

//     if(!mongoose.Types.ObjectId.isValid(_id)){
//         return res.status(400).send({error: 'Invalid ObjectId'});
//     }
//     const cart = await Cart.deleteOne({_id: _id})
//     res.send(cart)
// })
app.get("/mycart", routeAuth1, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.json({ items: [] });

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

// // ---------------------mycart----------------------
// app.get("/mycart", routeAuth1, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("✅ req.user from token:", req.user);

//     const user = await Fuser.findById(userId); // 🔥 This works now
//     if (!user) {
//       console.log("❌ User not found");
//       return res.status(400).send("User not found");
//     }

//     res.json({ items: user.cart || [] });
//   } catch (err) {
//     console.error("❌ Error in /mycart:", err.message);
//     res.status(500).send("Server Error");
//   }
// });


//---------------------Order----------------------

app.post('/Order', async (req, res) => {
    console.log("Recevied body:", req.body);
    const order = new Order(req.body);
    const result = await order.save()
    res.send(result)
})

app.get('/Order', async (req, res) =>{
    const order  = await Order.find()
    if(order.length > 0){
        res.send(order)
    }
    else{
        res.send("No order found")
    }
})



app.get('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;
    const order = await Order.findOne({_id: _id})
    res.send(order)
})


app.delete('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId'});
    }
    const order = await Order.deleteOne({_id: _id})
    res.send(order)
})

app.put('/Order/:_id', async (req, res) =>{
    const _id = req.params._id;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ObjectId format'});
    }
    const order = await Order.updateOne({ _id}, {$set: req.body})
    res.send(order)
})





// ---------------------Shirts---------------------- //

// CREATE
app.post('/shirts', async (req, res) => {
    const shirt = new Shirt(req.body);
    const result = await shirt.save();
    res.send(result);
});

// READ ALL
app.get('/shirts', async (req, res) => {
    const shirts = await Shirt.find();
    if (shirts.length > 0) {
        res.send(shirts);
    } else {
        res.send("No shirts found");
    }
});

// READ SINGLE
app.get('/shirts/:_id', async (req, res) => {
    try{
        const shirt = await Shirt.findById(req.params._id);
        if(!shirt){
            return res.status(404).send("shirt Not founded")
        }
        res.send(shirt)
    }catch(error){
        res.status(400).send("Invalid ID or Server Error")
    }
});

// UPDATE
app.put('/shirts/:_id', async (req, res) => {
    const _id = req.params._id;
    const shirt = await Shirt.updateOne({ _id: _id }, { $set: req.body });
    res.send(shirt);
});

// DELETE
app.delete('/shirts/:_id', async (req, res) => {
    const _id = req.params._id;
    const shirt = await Shirt.deleteOne({ _id: _id });
    res.send(shirt);
});



// ---------------------Cargo---------------------- //

// CREATE
app.post('/Cargo', async (req, res) => {
    const cargo = new Cargo(req.body);
    const result = await cargo.save();
    res.send(result);
});

// READ ALL
app.get('/Cargo', async (req, res) => {
    const cargos = await Cargo.find();
    if (cargos.length > 0) {
        res.send(cargos);
    } else {
        res.send("No Cargo found");
    }
});

// READ SINGLE
app.get('/Cargo/:_id', async (req, res) => {
    // const _id = req.params._id;
    // const cargo = await Cargo.findOne({ _id: _id });
    // res.send(cargo);
    try{
        const cargo = await Cargo.findById(req.params._id);
        if (!cargo){
            return res.status(404).send("Cargo not found");
        }
        res.send(cargo);
    }catch(error){
        res.status(400).send("Invalid Id Or Server Error")
    }
});

// UPDATE
app.put('/Cargo/:_id', async (req, res) => {
    const _id = req.params._id;
    const cargo = await Cargo.updateOne({ _id: _id }, { $set: req.body });
    res.send(cargo);
});

// DELETE
app.delete('/Cargo/:_id', async (req, res) => {
    const _id = req.params._id;
    const cargo = await Cargo.deleteOne({ _id: _id });
    res.send(cargo);
});

// ---------------------Chain---------------------- //

// CREATE
app.post('/Chains', async (req, res) => {
    const chain = new Chain(req.body);
    const result = await chain.save();
    res.send(result);
});

// READ ALL
app.get('/Chains', async (req, res) => {
    const chains = await Chain.find();
    if (chains.length > 0) {
        res.send(chains);
    } else {
        res.send("No Chains found");
    }
});

// READ SINGLE
app.get('/Chains/:_id', async (req, res) => {
    // const _id = req.params._id;
    // const chain = await Chain.findOne({ _id: _id });
    // res.send(chain);
    try{
        const chain = await Chain.findById(req.params._id);
        if(!chain){
            return res.status(404).send("Chains and Accerioss are not Founded")
        }
        res.send(chain)
    } catch (error) {
        res.status(400).send("Invalid Id or server Error")
    }
});

// UPDATE
app.put('/Chains/:_id', async (req, res) => {
    const _id = req.params._id;
    const chain = await Chain.updateOne({ _id: _id }, { $set: req.body });
    res.send(chain);
});

// DELETE
app.delete('/Chains/:_id', async (req, res) => {
    const _id = req.params._id;
    const chain = await Chain.deleteOne({ _id: _id });
    res.send(chain);
});

// ---------------------SweatShirt---------------------- //

// CREATE
app.post('/SweatShirt', async (req, res) => {
    const sweatshirt = new SweatShirt(req.body);
    const result = await sweatshirt.save();
    res.send(result);
});

// READ ALL
app.get('/SweatShirt', async (req, res) => {
    const sweatshirts = await SweatShirt.find();
    if (sweatshirts.length > 0) {
        res.send(sweatshirts);
    } else {
        res.send("No SweatShirt found");
    }
});

// READ SINGLE
app.get('/SweatShirt/:_id', async (req, res) => {
    // const _id = req.params._id;
    // const sweatshirt = await SweatShirt.findOne({ _id: _id });
    // res.send(sweatshirt);
    try{
        const sweatshirt = await SweatShirt.findById(req.params._id);
        if (!sweatshirt){
            return res.status(404).send("Sweat Shirts are Not found");
        }
        res.send(sweatshirt);
    }catch(error){
        res.status(400).send("Invalid ID or Server Error")
    }
});

// UPDATE
app.put('/SweatShirt/:_id', async (req, res) => {
    const _id = req.params._id;
    const sweatshirt = await SweatShirt.updateOne({ _id: _id }, { $set: req.body });
    res.send(sweatshirt);
});

// DELETE
app.delete('/SweatShirt/:_id', async (req, res) => {
    const _id = req.params._id;
    const sweatshirt = await SweatShirt.deleteOne({ _id: _id });
    res.send(sweatshirt);
});

// ---------------------BestSeller---------------------- //

// CREATE
app.post('/BestSeller', async (req, res) => {
    const bestseller = new BestSeller(req.body);
    const result = await bestseller.save();
    res.send(result);
});

// READ ALL
app.get('/BestSeller', async (req, res) => {
    const bestsellers = await BestSeller.find();
    if (bestsellers.length > 0) {
        res.send(bestsellers);
    } else {
        res.send("No BestSeller found");
    }
});

// READ SINGLE
app.get('/BestSeller/:_id', async (req, res) => {
  try {
    const product = await BestSeller.findById(req.params._id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (error) {
    res.status(400).send("Invalid ID or Server Error");
  }
});
// UPDATE

app.put('/BestSeller/:_id', async (req, res) => {
    const _id = req.params._id;
    const bestseller = await BestSeller.updateOne({ _id: _id }, { $set: req.body });
    res.send(bestseller);
});

// DELETE
app.delete('/BestSeller/:_id', async (req, res) => {
    const _id = req.params._id;
    const bestseller = await BestSeller.deleteOne({ _id: _id });
    res.send(bestseller);
});


// ---------------------Tshirt---------------------- //

// CREATE
app.post('/Tshirts', async (req, res) => {
    const tshirt = new Tshirt(req.body);
    const result = await tshirt.save();
    res.send(result);
});

// READ All
app.get('/Tshirts', async (req, res) => {
    const tshirts = await Tshirt.find();
    if (tshirts.length > 0) {
        res.send(tshirts);
    } else {
        res.send("No Tshirts found");
    }
});

// READ SINGLE
app.get('/Tshirts', async (req, res) => {
    try{
        const tshirts = await Tshirt.findById(req.params._id);
        if(!tshirts){
            return res.status(404).send("Product not Found");
        }
        res.send(tshirts);
    }catch (error){
        res.status(400).send("Invalid Id or Server Error")
    }
});


// UPDATE
app.put('/Tshirts/:_id', async (req, res) => {
    const _id = req.params._id;
    const tshirt = await Tshirt.updateOne({ _id: _id }, { $set: req.body });
    res.send(tshirt);
});

// DELETE
app.delete('/Tshirts/:_id', async (req, res) => {
    const _id = req.params._id;
    const tshirt = await Tshirt.deleteOne({ _id: _id });
    res.send(tshirt);
});

// ---------------------Necktshirt---------------------- //

// CREATE
app.post('/Necktshirt', async (req, res) => {
    const necktshirt = new Necktshirt(req.body);
    const result = await necktshirt.save();
    res.send(result);
});

// READ ALL
app.get('/Necktshirt', async (req, res) => {
    const necktshirts = await Necktshirt.find();
    if (necktshirts.length > 0) {
        res.send(necktshirts);
    } else {
        res.send("No Necktshirts found");
    }
});

// READ SINGLE
app.get('/Necktshirt/:_id', async (req, res) => {
    try{
        const item = await Necktshirt.findById(req.params._id);
        if(!item){
            return res.status(404).send("Invalid ID Or Server Error")
        }
        res.send(item);
    }catch(error){
        res.status(400).send("Invalid Id or Server Error")
    }
});

// UPDATE
app.put('/Necktshirt/:_id', async (req, res) => {
    const _id = req.params._id;
    const necktshirt = await Necktshirt.updateOne({ _id: _id }, { $set: req.body });
    res.send(necktshirt);
});

// DELETE
app.delete('/Necktshirt/:_id', async (req, res) => {
    const _id = req.params._id;
    const necktshirt = await Necktshirt.deleteOne({ _id: _id });
    res.send(necktshirt);
});

// ---------------------Home---------------------- //

// CREATE
app.post('/home', async (req, res) => {
    const home = new Home(req.body);
    const result = await home.save();
    res.send(result);
});

// READ ALL
app.get('/home', async (req, res) => {
    const homes = await Home.find();
    if (homes.length > 0) {
        res.send(homes);
    } else {
        res.send("No Homes found");
    }
});

// READ SINGLE
app.get('/home/:_id', async (req, res) => {
    try{
        const home = await Home.findById(req.params._id);
        if(!home){
            return res.status(404).send("Product not founded")
        }
        res.send(home);
    }catch (error){
        res.status(400).send("Invalid ID or Server Error")
    }
});

// UPDATE
app.put('/home/:_id', async (req, res) => {
    const _id = req.params._id;
    const home = await Home.updateOne({ _id: _id }, { $set: req.body });
    res.send(home);
});

// DELETE
app.delete('/home/:_id', async (req, res) => {
    const _id = req.params._id;
    const home = await Home.deleteOne({ _id: _id });
    res.send(home);
});


// cart
app.listen(5000, ()=> console.log("API Started"))