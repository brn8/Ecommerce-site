require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const nodemailer = require("nodemailer");

const Stripe = require("stripe");

const cors = require("cors");

const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = 3000;
const prisma = require("../Server/prisma");
const { data } = require("react-router-dom");

app.use(express.json());

app.use(morgan("dev"));

app.use(cors());

app.use(require("morgan")("dev"));

const JWT = process.env.JWT;
const pass = process.env.pass;
const frontendurl = process.env.frontendurl;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "pritpatel7311@gmail.com",
    pass: pass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error with email configuration: ", error);
  } else {
    console.log("Emaiil configuration successfull: ", success);
  }
});

app.post("/api/product", async (req, res, next) => {
  try {
    const {
      name,
      img,
      description,
      price,
      quantity,
      discountAmount,
      productCategoryName,
      created_at,
      modified_at,
    } = req.body;

    const productCategoryExist = await prisma.productCategory.findMany({
      where: {
        name: productCategoryName,
      },
    });
    if (productCategoryExist.length == 0) {
      const respnse = await prisma.productCategory.create({
        data: {
          name: productCategoryName,
        },
      });
      console.log(respnse);
    }
    const response = await prisma.product.create({
      data: {
        name,
        img,
        description,
        price,
        quantity,
        discountAmount,
        productCategoryName,
        created_at,
        modified_at,
      },
    });
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
});

app.post("/api/OrderItem", async (req, res, next) => {
  try {
    const { productId, quantity, price } = req.body;
    const response = await prisma.orderItem.create({
      data: {
        productId,
        quantity,
        price,
      },
    });
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
});

app.get("/api/product", async (req, res, next) => {
  try {
    const response = await prisma.product.findMany();
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

app.get("/api/OrderItem", async (req, res, next) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        products: {
          select: {
            name: true,
            description: true,
            price: true,
            img: true,
            discountAmount: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(orderItems);
  } catch (err) {
    next(err);
  }
});

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error.";
  res.status(status).json({ message });
});

app.post("/api/register/user", async (req, res, next) => {
  try {
    /*Retriving the data that is provided by the user */
    const user_data = req.body;
    // console.log("Length of user data: ", user_data.length);

    const firstName = user_data.firstName;
    const lastName = user_data.lastName;
    const username = user_data.username;
    const password = user_data.password;
    const email = user_data.email;
    const contact = user_data.contact;

    /* 
    -Using bcrypt library to hash the password
    -genSalt(): crates a string that is being used to hash the password which can be used to verify the password
    -hash(): create a hashed password
    */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /*
    -Checking if the user already exist into the db if exist send a appropriate message
    -if the user doesn't exist, then creating a user using prism.users.create function; where users is table 
     */
    const ifExist = await prisma.users.findMany({
      where: { username },
    });

    if (ifExist.length == 0) {
      await prisma.users.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: hashedPassword,
          email: email,
          contact: contact,
        },
      });
      return res.status(200).json("Congratulations!! You are registered!");
    } else {
      res.status(409).json("This user already exists!!");
    }
  } catch (error) {
    if (
      error.code === "P2002" &&
      error.meta &&
      error.meta.target.includes("email")
    ) {
      return res.status(409).json("This email is already registered!");
    }
    next(error);
  }
});

/*Function to authenticate the loggedIn user */
const aunthenticate = async (user_data, res) => {
  // console.log("user data: ", user_data);

  /*Retriving username and password from user_data variable */
  const username = user_data.username;
  const password = user_data.password;

  /*Checking if user exist wit that username into the database */
  const ifExist = await prisma.users.findMany({ where: { username } });

  /*
  -if the user exist then it retrives the user's id 
  -verify the provided password with the one stored into the db 
  -once the password matches generate a json web token using user's id and return it
  */
  if (ifExist.length > 0) {
    const user = ifExist[0];
    const id = user.id;
    // console.log("User id: ", id);
    const verifyPassword = await bcrypt.compare(password, user.password);
    // console.log("Result of password verification: ", verifyPassword);

    if (verifyPassword == false) {
      res.status(401).json({ message: `Your password doesn't match!` });
      return null;
    } else {
      const token = await jwt.sign(id, JWT);
      // console.log("token: ", token);
      return token;
    }
  }
  res.status(404).json({ message: `User not found` });
  return null;
};

/*Route for user login 
-Calling the authenticate function to authenticate the user
-Returning a token once the user is verified
*/
app.post("/api/login/user", async (req, res, next) => {
  try {
    const user_data = req.body;
    const token = await aunthenticate(user_data, res);
    if (token) {
      res
        .status(200)
        .json({ message: "You are sucessfully logged In!!", token: token });
    }
  } catch (ex) {
    next(ex);
  }
});

/*
  -For the users logging in with google auth
*/
app.post("/api/googleauth/login/user", async (req, res, next) => {
  try {
    const user_data = req.body;
    console.log("user info: ", user_data);
    const username = user_data.username;
    const firstName = user_data.firstName;
    const lastName = user_data.lastName;
    const email = user_data.email;
    const email_verified = user_data.emailVerified;

    if (email_verified && username && firstName && lastName && email) {
      const findUser = await prisma.users.findMany({ where: { username } });
      // console.log("findUser: ", findUser);

      if (!findUser.length) {
        const createUser = await prisma.users.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            contact: "",
            password: "",
          },
        });

        const findRecentCreateUser = await prisma.users.findMany({
          where: { username },
        });
        // console.log("findRecentCreateUser: ", findRecentCreateUser);

        const id = findRecentCreateUser[0].id;
        const token = await jwt.sign(id, JWT);
        // console.log("token: ", token);

        return res.json({
          message: `Congratulations!! You are loggedIn successfully!`,
          data: createUser,
          token: token,
        });
      } else {
        const id = findUser[0].id;
        const token = await jwt.sign(id, JWT);
        // console.log("token: ", token);
        return res.json({
          message: `Congratulations!! You are loggedIn successfully!`,
          token: token,
        });
      }
    } else {
      return res.status(401).json({ message: `The user is not authorized!` });
    }
  } catch (ex) {
    next(ex);
  }
});

/*
-isLoggedIn functioin to check whether a user is authenticated by verifying the provided token
-jwt.verify(): verify the token using the same key, that is used to sign a token
-Once the user is verified, retriving the user from db using the id,
 and attaching user's data to the req.user object
 -next(): makes the user data available for the further processing in other routes 
 */
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authtoken; // Extract token part

    if (!token) {
      res.status(401).json({ message: `You are not loggedIn!!` });
    } else {
      const verifyToken = await jwt.verify(token, JWT);
      // console.log("verifytoken: ", verifyToken);

      if (verifyToken) {
        // console.log("After verifying token the username is: ", verifyToken);
        const id = Number(verifyToken);
        const userWithToken = await prisma.users.findMany({
          where: { id },
        });

        if (userWithToken.length >= 0) {
          // console.log("query result: ", userWithToken);
          const verifiedUser = userWithToken[0];

          req.user = verifiedUser;
          next();
        } else {
          return res.status(404).json({ message: `User is not found!` });
        }
      } else {
        return res.status(401).json({ message: `You are not authorized!!` });
      }
    }
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error.message);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

app.get("/api/address", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await prisma.users.findFirst({
      where: {
        id: userId,
      },
      include: { address: true, payment: true },
    });
    res.send(response);
  } catch (err) {
    next(err);
  }
});

app.patch("/api/address", isLoggedIn, async (req, res, next) => {
  try {
    const { streetAddress, city, state, zipCode, country } = req.body;
    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        address: true,
      },
    });
    if (user.address == null) {
      const updateAddress = await prisma.address.create({
        data: {
          streetAddress,
          city,
          state,
          zipCode,
          country,
          users: { connect: { id: userId } },
        },
      });
      res.send(updateAddress);
    } else {
      const updateAddress = await prisma.address.update({
        where: { id: user.address.id },
        data: {
          streetAddress: streetAddress || user.address.streetAddress,
          city: city || user.address.city,
          state: state || user.address.state,
          zipCode: zipCode || user.address.zipCode,
          country: country || user.address.country,
        },
      });
      res.send(updateAddress);
    }
  } catch (err) {
    next(err);
  }
});

app.patch("/api/payment", isLoggedIn, async (req, res, next) => {
  try {
    const { cardNumber, nameOnCard, expiration, securityCode } = req.body;

    const userId = req.user.id;
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        payment: true,
      },
    });
    if (user.payment == null) {
      const updatePayment = await prisma.payment.create({
        data: {
          cardNumber,
          nameOnCard,
          expiration,
          // securityCode,
          users: { connect: { id: userId } },
        },
      });
      res.send(updatePayment);
    } else {
      const updatePayment = await prisma.payment.update({
        where: { id: user.payment.id },
        data: {
          cardNumber: cardNumber || user.payment.cardNumber,
          nameOnCard: nameOnCard || user.payment.nameOnCard,
          expiration: expiration || user.payment.expiration,
          securityCode: securityCode || user.payment.securityCode,
        },
      });
      res.send(updatePayment);
    }
  } catch (err) {
    next(err);
  }
});

app.patch("/api/products/:id", async (req, res, next) => {
  try {
    const {
      name,
      img,
      description,
      price,
      quantity,
      discountAmount,
      productCategoryName,
      modified_at,
    } = req.body;
    const id = +req.params.id;
    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        img,
        description,
        price,
        quantity,
        discountAmount,
        productCategoryName,
        modified_at,
      },
    });
    // console.log(updateProduct);
    res.send(updateProduct);
  } catch (err) {
    next(err);
  }
});

app.patch("/api/user", isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, contact } = req.body;

    const updateUser = await prisma.users.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        contact,
      },
    });
    res.send(updateUser);
  } catch (err) {
    next(err);
  }
});
/*
-Route for retriving and sending the logged in user's data
-Calling the isLoggedIn function to check the user's authenticity and retriving the user's data
*/
app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    const userinfo = req.user;
    res.status(200).send(userinfo);
  } catch (error) {
    next(error);
  }
});

/*Route to post a orderItem into orderItem table and a order into orders table for the currently loggedin user*/
app.post("/api/user/additem", isLoggedIn, async (req, res, next) => {
  try {
    const loggedinUser = req.user;
    const product = req.body;
    // console.log("Product is: ", product);
    // console.log("user ID: ", loggedinUser.id);
    // console.log("Product id: ", product.id);

    if (Object.keys(product).length >= 0) {
      const createOrderItem = await prisma.OrderItem.create({
        data: {
          productId: product.id,
          quantity: 1,
          price: product.price - product.discountAmount,
        },
      });
      if (createOrderItem) {
        const totalPrice = 1 * product.price - product.discountAmount;
        // console.log("totalPrice: ", totalPrice);
        // console.log(createOrderItem.id);
        const createOrder = await prisma.Orders.create({
          data: {
            userId: loggedinUser.id,
            orderItemId: createOrderItem.id,
            totalPrice: totalPrice,
          },
        });

        res.json({
          message: "Your product has been added to the cart!",
          orderItem: createOrderItem,
          createdOrder: createOrder,
        });
      } else {
        return res.json({
          message: `Error while creating your order into db!`,
        });
      }
    } else {
      return res.json({ message: `Your product has not been received!` });
    }
  } catch (error) {
    next(error);
  }
});
const findProductId = async (id) => {
  const findProductId = await prisma.OrderItem.findMany({
    where: { id },
  });
  return findProductId[0].productId;
};
const findProductQuantity = async (id) => {
  const findProductId = await prisma.OrderItem.findMany({
    where: { id },
  });
  return findProductId[0].quantity;
};
const findProducts = async (id) => {
  const findProductId = await prisma.Product.findMany({
    where: { id },
  });
  return findProductId[0];
};

const findProductPrice = async (id) => {
  const findProductId = await prisma.Product.findMany({
    where: { id },
  });
  return findProductId[0].price - findProductId[0].discountAmount;
};

/*Route to send currently loggedin user's products, quantities, prices and orderItemIds for the currently loggedin user*/
app.get("/api/user/orders", isLoggedIn, async (req, res, next) => {
  try {
    let orderItemIds = [];
    let orderItemQuantity = [];
    let productIds = [];
    let products = [];
    let productPrices = [];
    const loggedinUser = req.user;
    const userId = loggedinUser.id;
    const findOrders = await prisma.Orders.findMany({ where: { userId } });
    let id = 1;

    console.log("Order Item ID: ", findOrders);
    for (let i = 0; i < findOrders.length; i++) {
      orderItemIds.push(findOrders[i].orderItemId);
    }
    // console.log("Order item ids are: ", orderItemIds);

    // const findProductId = await prisma.OrderItem.findMany({
    //   where: { id },
    // });

    for (let i = 0; i < orderItemIds.length; i++) {
      productIds.push(await findProductId(orderItemIds[i]));
      orderItemQuantity.push(await findProductQuantity(orderItemIds[i]));
    }
    // console.log("find product id: ", findProductId);
    // console.log("Product id is: ", findProductId[0].productId);

    // console.log("Product ids are: ", productIds);
    // console.log("Product quantities: ", orderItemQuantity);

    // const productId = findProductId.id;

    for (let i = 0; i < productIds.length; i++) {
      products.push(await findProducts(productIds[i]));
    }

    const findProduct = await prisma.Product.findMany({ where: { id } });
    // console.log("Product is: ", findProduct);
    // console.log("Prodcts are: ", products);

    for (let i = 0; i < productIds.length; i++) {
      productPrices.push(await findProductPrice(productIds[i]));
    }
    // console.log("Product prices are: ", productPrices);
    let totalProductPrices = [];

    for (let i = 0; i < productPrices.length; i++) {
      totalProductPrices.push(
        (orderItemQuantity[i] * productPrices[i]).toFixed(2)
      );
    }
    // console.log("totalProductPrices: ", totalProductPrices);

    // if (findProduct.length >= 0) {
    //   return res.send(findProduct);
    // } else {
    //   res.json({ message: "You don't have any orders!" });
    // }
    res.json({
      products: products,
      orderItemQuantity: orderItemQuantity,
      orderItemIds: orderItemIds,
      productPrices: totalProductPrices,
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", async (req, res, next) => {
  const id = +req.params.id;
  try {
    const deleteProduct = await prisma.product.delete({ where: { id } });
    res.status(204).send(deleteProduct);
  } catch (err) {
    next(err);
  }
});

/*Route to modify the quantities in orderItem table and modify the total price in orders table for the loggedin user */
app.patch("/api/orderItem/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user_data = req.user;
    const userId = user_data.id;
    const orderItemId = +req.params.id;
    const { quantity } = req.body;
    // console.log("Quantity: ", quantity);
    // console.log("orderItemId: ", orderItemId);
    let id;

    const findUserFrmOrders = await prisma.Orders.findMany({
      where: { userId },
    });
    // console.log("findUserFrmOrders", findUserFrmOrders);

    // for (let i = 0; i < findUserFrmOrders.length; i++) {
    //   ids.push(findUserFrmOrders[i].orderItemId);
    // }
    // console.log("ids: ", ids);

    const orderitemid = findUserFrmOrders.find(
      (order) => order.orderItemId === orderItemId
    );

    // console.log("orderitemid: ", orderitemid.orderItemId);

    id = orderitemid.orderItemId;
    const orderid = orderitemid.id;

    // console.log("orderid: ", orderid);

    if (findUserFrmOrders.length >= 0) {
      const findItemIdfromOrderItem = await prisma.orderItem.findMany({
        where: { id },
      });

      // console.log("findItemIdfromOrderItem: ", findItemIdfromOrderItem);

      let price = findItemIdfromOrderItem[0].price;

      if (findItemIdfromOrderItem.length >= 0) {
        const response = await prisma.orderItem.update({
          where: {
            id: id,
          },
          data: {
            quantity: Number(quantity),
          },
        });
        if (Object.keys(response).length >= 0) {
          // console.log("Response: ", response);
          id = orderid;

          const findorderitemidfromorders = await prisma.Orders.update({
            where: { id },
            data: {
              totalPrice: price * Number(quantity),
            },
          });

          res.send(response);
        }
      }
    }
  } catch (err) {
    next(err);
  }
});

/*Route to delete loggedin user's order from orders table and order item from the orderItem table from the database*/
app.delete("/api/orderItem/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user_data = req.user;
    const userId = user_data.id;
    let id = +req.params.id;
    let orderItemId = id;

    // console.log("OrderItemID: ", orderItemId);

    const findUserfrmOrder = await prisma.Orders.findMany({
      where: { userId },
    });

    // console.log("findUserfrmOrder: ", findUserfrmOrder);

    if (findUserfrmOrder.length >= 0) {
      const itemid = findUserfrmOrder.find((order) => order.orderItemId == id);
      // console.log("itemid length: ", itemid);
      id = itemid.id;

      if (Object.keys(itemid).length >= 0) {
        const findOrderItemfrmOrders = await prisma.Orders.delete({
          where: { id },
        });
        // console.log("findOrderItemfrmOrders: ", findOrderItemfrmOrders);
        if (Object.keys(findOrderItemfrmOrders).length >= 0) {
          id = findOrderItemfrmOrders.orderItemId;
          // console.log("findOrderItemfrmOrders.id: ", id);

          const findorderitemfrmorderitem = await prisma.OrderItem.findMany({
            where: { id },
          });
          // console.log("findorderitemfrmorderitem: ", findorderitemfrmorderitem);
          if (findorderitemfrmorderitem.length >= 0) {
            const findorderitemfrmorderitem = await prisma.OrderItem.delete({
              where: { id },
            });
          } else {
            res.json({ message: `Order Item is not found in orderItem!` });
          }
        } else {
          res.json({ message: `Order Item is not found in Orders!` });
        }
        return res.json({ deletedOrderItemId: findOrderItemfrmOrders });
      } else {
        return res.json({ message: `Order item is not found!` });
      }
    } else {
      return res.json({ message: `User is not found!` });
    }

    // const response = await prisma.orderItem.delete({
    //   where: {
    //     id: id,
    //   },
    // });
    // res.status(204).send(response);
  } catch (err) {
    next(err);
  }
});

/*Route to delete all orders from loggedin user from orders table and all order items from the orderItem table from the database*/
app.delete("/api/orderItem/", isLoggedIn, async (req, res, next) => {
  try {
    const user_data = req.user;
    const userId = user_data.id;

    async function deleteOrders() {
      const orders = await prisma.Orders.findMany({
        where: { userId },
      });
      for (const order of orders) {
        await prisma.orderItem.delete({
          where: { id: order.orderItemId },
        });
      }
    }

    deleteOrders();
    await prisma.Orders.deleteMany({
      where: { userId },
    });
    res.status(204);
  } catch (err) {
    next(err);
  }
});

/*Route to create a loggedin user's review for each product */
app.post("/api/user/product/review/:id", isLoggedIn, async (req, res, next) => {
  try {
    const loggedin_User_Data = req.user;
    const userId = loggedin_User_Data.id;
    const data = req.body;
    const productId = Number(req.params.id);
    const comment = data.comment;
    const rating = data.rating;

    // console.log("loggedin_User_Data: ", loggedin_User_Data);
    // console.log("data: ", data);

    if (
      Object.keys(loggedin_User_Data).length >= 0 &&
      Object.keys(data).length >= 0 &&
      userId
    ) {
      const createReview = await prisma.Review.create({
        data: {
          userId: userId,
          productId: productId,
          comment: comment,
          review: rating,
        },
      });
      return res.status(200).json({
        message: `Thank you for your review!!`,
        data: createReview,
      });
    } else {
      return res.json({ message: `Please, provide necessary information!!` });
    }
  } catch (error) {
    next(error);
  }
});

/*Route for sending reatings and reviews for each products */
app.get("/api/product/review", async (req, res, next) => {
  try {
    const getProductReview = await prisma.Review.findMany();
    // console.log("getProductReview: ", getProductReview);

    const userIds = getProductReview.map((review) => review.userId);
    // console.log("userIds", userIds);

    const users = (
      await Promise.all(
        userIds.map(
          async (id) => await prisma.users.findMany({ where: { id } })
        )
      )
    ).flat();

    // console.log("users: ", users);

    const productRatings = getProductReview.reduce((acc, productReview) => {
      let rating = Number(productReview.review);
      let productId = productReview.productId;

      if (!acc[productId]) {
        acc[productId] = { sum: 0, count: 0 };
      }
      acc[productId].sum += rating;
      acc[productId].count += 1;
      return acc;
    }, {});
    // console.log("productRatings: ", productRatings);

    const avgProductRating = Object.entries(productRatings).map(
      ([productId, { sum, count }]) => ({
        productId: Number(productId),
        average: (sum / count).toFixed(1),
        count,
      })
    );

    // console.log("avgProductRating: ", avgProductRating);

    return res.json({
      productReview: getProductReview,
      productAvgRating: avgProductRating,
      users: users,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/product/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // console.log("id: ", typeof id);

    if (id !== null) {
      const findProduct = await prisma.Product.findMany({ where: { id } });
      // console.log("findProduct: ", findProduct);
      return res.json({ product: findProduct[0] });
    } else {
      return res.json({ message: `Product ID is not provided!!` });
    }
  } catch (error) {
    next(error);
  }
});

// purchases
app.post("/api/purchases", isLoggedIn, async (req, res, next) => {
  try {
    const loggedinUser = req.user;
    const userId = loggedinUser.id;
    // const { address, amountPaid, products } = req.body;
    const { address, amountPaid } = req.body;
    const currentDate = new Date();

    const purchase = await prisma.Purchases.create({
      data: {
        address,
        amountPaid,
        created_at: currentDate,
        userId: loggedinUser.id,
      },
    });

    const getOrders = await prisma.Orders.findMany({
      where: { userId },
    });

    getOrders.forEach(async (element) => {
      const orderItem = await prisma.OrderItem.findFirst({
        where: { id: element.orderItemId },
      });
      const product = await prisma.product.findFirst({
        where: { id: orderItem.productId },
      });
      await prisma.LineItems.create({
        data: {
          purchaseId: purchase.id,
          quantity: orderItem.quantity,
          productId: orderItem.productId,
          productName: product.name,
          productDesc: product.description,
          productImg: product.img,
          price: orderItem.price,
        },
      });
    });
    res.status(201).send(purchase);
  } catch (err) {
    next(err);
  }
});

// change a purchase's order status
app.patch("/api/purchases", async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const updateStatus = await prisma.Purchases.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    res.send(updateStatus);
  } catch (error) {
    next(error);
  }
});

//get all purchases tied to a user ID
app.get("/api/purchases", isLoggedIn, async (req, res, next) => {
  try {
    const loggedIn = req.user;
    const userId = loggedIn.id;
    const response = await prisma.Purchases.findMany({
      where: { userId: userId },
    });
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

//get a specific purchase
app.get("/api/purchases/:id", async (req, res, next) => {
  try {
    const purchaseId = Number(req.params.id);
    const response = await prisma.Purchases.findFirst({
      where: { id: purchaseId },
    });
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

//get a specific item in a purchase
app.get("/api/lineItems/:id", async (req, res, next) => {
  try {
    const purchaseId = Number(req.params.id);
    const response = await prisma.LineItems.findMany({
      where: { purchaseId: purchaseId },
    });
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

app.post("/api/user/forgotpassword", async (req, res, next) => {
  try {
    const email = req.body.email;
    // console.log("email is: ", email);
    const frontend_url = frontendurl || `http://localhost:5173/reset-password`;
    // console.log("frontend_url: ", frontend_url);

    const findUser = await prisma.users.findMany({ where: { email } });
    // console.log("findUser: ", findUser);

    if (findUser.length != 0) {
      const id = findUser[0].id;
      // console.log("id: ", id);

      const token = await jwt.sign({ id }, JWT, { expiresIn: "5m" });
      // console.log("token: ", token);

      let url = `${frontend_url}?token=${token}`;

      const mailinfo = {
        from: "pritpatel7311@gmail.com",
        to: email,
        subject: "Password Recovery Link",
        text: `Click the following link to reset the password: \n\n${url}`,
      };

      const info = await transporter.sendMail(mailinfo);
      // console.log("Email sent: ", info.response);

      return res.json({ url: url, message: `Please check your email!!` });
    } else {
      res.json({ message: `User not found with the provided email!` });
    }
  } catch (error) {
    next(error);
  }
});

app.patch("/api/user/resetPassword", async (req, res, next) => {
  try {
    const user_data = req.body;
    // console.log("user_data", user_data);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user_data.password, salt);

    const token = req.headers.authtoken;
    // console.log("user_data: ", user_data);
    // console.log("token: ", token);
    // console.log(req.headers);

    if (token) {
      try {
        const tokenVerification = jwt.verify(token, JWT);
        // console.log("tokenVerification: ", tokenVerification);
        const id = tokenVerification.id;

        const findUser = await prisma.users.update({
          where: {
            id,
          },
          data: {
            password: hashedPassword,
          },
        });
        return res.json({
          message: "Your password has been reset successfully!!",
          user: findUser,
        });
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            message:
              "The token has expired. Please request a new password reset link!",
          });
        }
        return res
          .status(401)
          .json({ message: "Invalid token. Authorization failed!" });
      }
    } else {
      return res.status(401).json({ message: "You are not authorized!!" });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//get categories
app.get("/api/categories", async (req, res, next) => {
  try {
    const response = await prisma.ProductCategory.findMany();
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`));
