const prisma = require("../prisma");
const seed = async () => {
  const UserData = async () => {
    const users = [
      {
        firstName: "Steph",
        lastName: "Curry",
        username: "sc30",
        password: "sc30",
      },
      {
        firstName: "Lebron",
        lastName: "James",
        username: "lj23",
        password: "lj23",
      },
    ];
    await prisma.users.createMany({ data: users });
  };
  const userAddress = async () => {
    const userAddress = [
      {
        streetAddress: "182 central ave",
        city: "New York city",
        state: "NY",
        zipCode: "07842",
        country: "USA",
      },
      {
        streetAddress: "150 hoboken ave",
        city: "clifton",
        state: "NJ",
        zipCode: "07482",
        country: "USA",
      },
      {
        streetAddress: "300 congress street",
        city: "Parsippany ",
        state: "NJ",
        zipCode: "03923",
        country: "USA",
      },
    ];
    await prisma.address.createMany({ data: userAddress });
  };
  const ProductCatorgy = async () => {
    const productcategories = [
      {
        name: "ELECTRONIC",
      },
      {
        name: "OFFICE",
      },
      {
        name: "BOOK",
      },
    ];
    await prisma.productCategory.createMany({ data: productcategories });
  };
  const Products = async () => {
    const products = [
      {
        name: "iPhone16",
        description:
          "All-new cameras — Hello, Apple Intelligence. Five vibrant colors. A18 chip.",
        price: 999.99,
        quantity: 300,
        discountAmount: 0,
        productCategoryName: "ELECTRONIC",
        created_at: new Date(),
        modified_at: new Date(),
      },
      {
        name: "Samsung - 85” Class DU7200 Series Crystal UHD 4K Smart Tizen TV",
        description:
          "This essential TV features a range of contrast and color and smart capabilities. Enjoy your content with richer details, brighter images and clearer resolution with 4K Upscaling. ",
        price: 799.99,
        quantity: 100,
        discountAmount: 100.0,
        productCategoryName: "ELECTRONIC",
        created_at: new Date(),
        modified_at: new Date(),
      },
      {
        name: "Scotch Desktop Tape Dispenser",
        description:
          "Weighted, nonskid base for one-hand dispensing.Designed to hold tapes up to 1,500 inch long.",
        price: 5.99,
        quantity: 100,
        discountAmount: 1.0,
        productCategoryName: "OFFICE",
        created_at: new Date(),
        modified_at: new Date(),
      },
    ];
    await prisma.product.createMany({ data: products });
  };
  // UserData();
  // userAddress();
  // ProductCatorgy();
  // Products();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
