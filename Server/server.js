const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const prisma = require("../Server/prisma");
require("dotenv").config();
app.use(express.json());
const JWT = process.env.JWT;

app.post("/api/register/user", async (req, res, next) => {
  try {
    const user_data = req.body;
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
      return res.send("Congratulations!! You are registered!");
    } else {
      res.send("This user already exists!!");
    }
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => console.log(`Listening to the port ${PORT}`));
