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

app.post("/api/register/user", async (req, res, next) => {
  try {
    const user_data = req.body;
    console.log("Length of user data: ", user_data.length);

    const firstName = user_data.firstName;
    const lastName = user_data.lastName;
    const username = user_data.username;
    const password = user_data.password;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

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
const aunthenticate = async (user_data, res) => {
  const username = user_data.username;
  const password = user_data.password;
  const ifExist = await prisma.users.findMany({ where: { username } });

  if (ifExist.length > 0) {
    const user = ifExist[0];
    const verifyPassword = await bcrypt.compare(password, user.password);
    // console.log("Result of password verification: ", verifyPassword);

    if (verifyPassword == false) {
      res.status(401).json({ message: `Your password doesn't match!` });
      return null;
    } else {
      const token = await jwt.sign(username, JWT);
      console.log("token: ", token);
      return token;
    }
  }
  res.status(404).json({ message: `User not found` });
  return null;
};

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

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`));
