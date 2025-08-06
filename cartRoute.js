const express = require("express");
const router = express.Router();
const Cart = require("./model/CartModel");
const verifyToken = require("./routeAuth1");
const FuserModel = require('./model/FuserModel');

// ✅ Add item to cart
router.post("/cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED HERE
    const { items } = req.body;

    const userCart = await Cart.findOne({ userId });

    if (userCart) {
      userCart.items = items;
      await userCart.save();
    } else {
      await Cart.create({ userId, items }); // ✅ Use correct model name (Cart)
    }

    res.send({ message: "Cart updated successfully" });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).send("Cart update failed");
  }
});

// ✅ Fetch cart
router.get("/cart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    res.json({ items: cart?.items || [] });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ✅ Remove item from cart
router.post('/remove-cart-item', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send("Cart not found");

    cart.items = cart.items.filter(
      item => item.productId !== productId && item._id.toString() !== productId
    );
    await cart.save();

    res.json({ message: "Item removed", items: cart.items });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// ✅ Get cart items (duplicate route; you can remove one if unnecessary)
router.get("/getcart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    res.json({ items: cart?.items || [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// ✅ Delete entire cart by ID (if you’re using this route for admin or testing)
router.delete("/cart/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED HERE
    const itemId = req.params.id;

    const cart = await Cart.findOne({ _id: itemId, userId }); // ✅ Fixed match on userId
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await Cart.deleteOne({ _id: itemId, userId });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting item" });
  }
});

module.exports = router;
