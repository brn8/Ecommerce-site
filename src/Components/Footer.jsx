import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  function handleClick(option) {
    switch (option) {
      case "contactus":
        navigate("/contactus");
        break;
      default:
        navigate("/");
    }
  }

  return (
    <div className="footer">
      <div className="footer-button">
        <button>About Us</button>
        <button onClick={() => handleClick("contactus")}>Contact Us</button>
      </div>
    </div>
  );
};

export default Footer;
