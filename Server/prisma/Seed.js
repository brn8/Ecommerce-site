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
        name: "Electronics",
      },
      {
        name: "Office Supplies",
      },
    ];
    await prisma.productCategory.createMany({ data: productcategories });
  };
  const Products = async () => {
    const products = [
      {
        name: "Wireless Bluetooth Headphones",
        img: "https://i5.walmartimages.com/asr/375d2852-d985-4aa9-b69c-b686da6e513f_1.eef652ba8620bde5c2b792e0ce74f113.jpeg",
        description:
          "High-quality wireless Bluetooth headphones with noise cancellation and a comfortable fit.",
        price: "99.98999999999999",
        discountAmount: "10",
        quantity: 50,
        productCategoryName: "Electronics",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
      {
        name: "Smart LED TV",
        img: "https://i5.walmartimages.com/seo/SAMSUNG-32-Class-N5300-Series-Full-HD-1080P-LED-Smart-Television-UN32N5300AFXZA_2b2943fd-73d6-4d7b-9c54-e22db0c660f1_4.e79d68ec3a718064170de6cbd82e6030.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        description:
          "4K Ultra HD Smart LED TV with built-in streaming apps and voice control.",
        price: "499.99",
        discountAmount: "50",
        quantity: 20,
        productCategoryName: "Electronics",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
      {
        name: "Wireless Mouse",
        img: "https://m.media-amazon.com/images/I/61qpQ7ZsSmL.jpg",
        description:
          "Ergonomic wireless mouse with precision tracking and a long-lasting battery.",
        price: "19.99",
        discountAmount: "5",
        quantity: 150,
        productCategoryName: "Electronics",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
      {
        name: "Premium Notebook",
        img: "https://neromanetti.com/wp-content/uploads/2021/02/6.jpg",
        description:
          "Soft-touch cover, 200 pages of high-quality paper for smooth writing.",
        price: "9.99",
        discountAmount: "1",
        quantity: 100,
        productCategoryName: "Office Supplies",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
      {
        name: "Office Desk Chair",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCtZlnpc4PNX0GGIRTskchjzKrIoBAFmjaw&s",
        description:
          "Ergonomically designed office chair with lumbar support and adjustable height.",
        price: "129.99",
        discountAmount: "20",
        quantity: 30,
        productCategoryName: "Office Supplies",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
      {
        name: "A4 Printer Paper",
        img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSR6AzkgUhdvFjbY5ezZ0wCd_KwwGzTUOBZGqaIfEBujr8Jmfk1S0F2Fnrab7EL71N1hdG0In97m3o6AsrByoosEX5WT3nmkOkEIwB8e8TN",
        description:
          "500 sheets of high-quality A4 printer paper for everyday office use.",
        price: "5.99",
        discountAmount: "0.5",
        quantity: 200,
        productCategoryName: "Office Supplies",
        created_at: "2024-01-01T10:00:00.000Z",
        modified_at: "2024-01-01T10:00:00.000Z",
      },
    ];
    await prisma.product.createMany({ data: products });
  };
  // UserData();
  // userAddress();
  ProductCatorgy();
  Products();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
