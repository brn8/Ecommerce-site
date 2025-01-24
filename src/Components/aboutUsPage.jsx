// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import NavBar from "./NavBar";
// import Footer from "./Footer";

const AboutUsPage = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <main>
        <section>
          <h1>About Us</h1>
          <p>
            We are an retail online shop that sells both teachnology products
            and office supplies.
          </p>
        </section>
        <section>
          <h2>Technology Products Details</h2>
          <p>
            For our technology product, we sell a wide range of consumer
            technology, such as smartphones, laptops, TVs, cameras, smart
            watches, gaming consoles, etc. Most of these products will come from
            brands such as Apple, Sony, Samsung, Microsoft, HP, LG, Motorola,
            and so on.
          </p>
        </section>
        <section>
          <h2>Office Supplies Details</h2>
          <p>
            For our office supplies, we sell products that are paper, pens and
            pencils, markers and highlighters, binders and folders, and so on.
          </p>
        </section>
        <section>
          <h2>Contact Us</h2>
          <p>Contact Customer Service if you need help.</p>
        </section>
      </main>
    </div>
  );
};

export default AboutUsPage;
