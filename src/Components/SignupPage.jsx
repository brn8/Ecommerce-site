import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import CartButton from "./CartButton";
const SignupPage = ({
  active,
  setActive,
  firstName,
  lastName,
  username,
  password,
  setFirstName,
  setLastName,
  setUsername,
  setPassword,
  cartItem,
  email,
  setEmail,
  contact,
  setContact,
  token,
  setToken,
  isAdmin,
  setSearch,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setEmail("");
    setContact("");
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    // console.log(firstName, " ", lastName, " ", username, " ", password);
    if (
      !firstName ||
      !lastName ||
      !username ||
      !password ||
      !email ||
      !contact
    ) {
      alert("All fields are required!!");
      return;
    }
    const obj = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      contact: contact,
    };
    try {
      const response = await fetch("http://localhost:3000/api/register/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      const status = await response.status;
      const data = await response.json();
      // console.log("after register: ", data);

      alert(data);
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      setEmail("");
      setContact("");
      if (status == 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error while registering a user ", error);
    }
  }
  function handleClick(option) {
    setActive(option);
    if (option == "signin") {
      navigate("/login");
    }
  }
  return (
    <>
      {/* <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
        isAdmin={isAdmin}
        setSearch={setSearch}
      /> */}
      <form>
        <div className="option-container">
          <h3
            className={active === "signin" ? "active" : ""}
            onClick={() => handleClick("signin")}
          >
            SignIn
          </h3>
          <h3
            className={active === "signup" ? "active" : ""}
            onClick={() => handleClick("signup")}
          >
            SignUp
          </h3>
        </div>
        <h1>Create Account</h1>
        <div className="register-info">
          <div className="firstname-lastname-email-container">
            <input
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
            />

            <input
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
            />

            <input
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="text"
            />
          </div>

          <div className="contact-username-password-container">
            <input
              value={contact}
              required
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact No."
              type="text"
            />

            <input
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
            />

            <input
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
          </div>
        </div>
        <button onClick={submitHandler}>Register</button>
      </form>
    </>
  );
};

export default SignupPage;
