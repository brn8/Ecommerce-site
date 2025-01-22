import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import NavBar from "./NavBar";
// import * as jwt_decode from "jwt-decode";

const LoginPage = ({
  active,
  setActive,
  username,
  password,
  setUsername,
  setPassword,
  setFirstName,
  setLastName,
  setEmail,
  setContact,
  token,
  setToken,
  isAdmin,
  setSearch,
  cartItem
}) => {
  const navigate = useNavigate();

  async function googleauthhandler(obj) {
    console.log("first name: ", obj.firstName);
    try {
      const response = await fetch(
        "http://localhost:3000/api/googleauth/login/user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        }
      );
      const data = await response.json();
      console.log("data after logging in: ", data);
      if (data) {
        alert(data.message);
        if (data.token) {
          sessionStorage.setItem("authToken", data.token);
          setFirstName("");
          setLastName("");
          setEmail("");
          setContact("");
          navigate("/");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error while signing in with google auth: ", error);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!username || !password) {
      alert("All fields are required!!");
      return;
    }
    const obj = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/api/login/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      const data = await response.json();
      //   console.log("after Login: ", data.token);

      setUsername("");
      setPassword("");
      alert(data.message);
      if (data.token) {
        sessionStorage.setItem("authToken", data.token);
        navigate("/");
      }
    } catch (error) {
      console.log("Error while registering a user ", error);
    }
  }
  function handleClick(option) {
    setActive(option);
    if (option == "signup") {
      navigate("/signup");
    }
  }

  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        cartItem={cartItem}
        token={token}
        setToken={setToken}
        isAdmin={isAdmin}
        setSearch={setSearch}
      />
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
        <h1>Welcome Back!</h1>

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

        <button onClick={submitHandler}>Sign In</button>
        <a href="">Forgot Password</a>

        <GoogleLogin
          className="google-login"
          onSuccess={(credentialResponse) => {
            console.log("credentialResponse: ", credentialResponse);
            const userInfo = jwtDecode(credentialResponse.credential);
            console.log(userInfo);
            const userName = userInfo.email.split("@");
            console.log("username: ", userName[0]);
            const obj = {
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              email: userInfo.email,
              username: userName[0],
              emailVerified: userInfo.email_verified,
            };
            googleauthhandler(obj);
          }}
          onError={() => {
            console.log("Login failed!!");
          }}
        />
      </form>
    </>
  );
};

export default LoginPage;
