import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import * as jwt_decode from "jwt-decode";

const LoginPage = ({
  active,
  setActive,
  username,
  password,
  setUsername,
  setPassword,
}) => {
  const navigate = useNavigate();

  //console.log("jwt_decode: ", jwt_decode); // Check what is being exported

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
          onSuccess={(credentialResponse) => {
            console.log("credentialResponse: ", credentialResponse);
            console.log(jwtDecode(credentialResponse.credential));
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
