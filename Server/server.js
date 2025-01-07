const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const cors = require("cors");

const app = express();
const PORT = 3000;
const prisma = require("../Server/prisma");

require("dotenv").config();
app.use(express.json());

app.use(morgan("dev"));

app.use(cors());

app.use(require("morgan")("dev"));

const JWT = process.env.JWT;

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

/*Route for registering the user */
app.post("/api/register/user", async (req, res, next) => {
  try {
    /*Retriving the data that is provided by the user */
    const user_data = req.body;
    console.log("Length of user data: ", user_data.length);

    const firstName = user_data.firstName;
    const lastName = user_data.lastName;
    const username = user_data.username;
    const password = user_data.password;

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
        },
      });
      return res.status(200).json("Congratulations!! You are registered!");
    } else {
      res.status(409).json("This user already exists!!");
    }
  } catch (error) {
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
    console.log("User id: ", id);
    const verifyPassword = await bcrypt.compare(password, user.password);
    // console.log("Result of password verification: ", verifyPassword);

    if (verifyPassword == false) {
      res.status(401).json(`Your password doesn't match!`);
      return null;
    } else {
      const token = await jwt.sign(id, JWT);
      console.log("token: ", token);
      return token;
    }
  }
  res.status(404).json(`User not found`);
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
      res.send(token);
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
    const token = req.headers.authtoken;

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

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`));
