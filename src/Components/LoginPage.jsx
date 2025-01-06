import { useNavigate } from "react-router-dom";

const LoginPage = ({ username, password, setUsername, setPassword }) => {
  const navigate = useNavigate();

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

  return (
    <form>
      <div className="option-container">
        <h3>SignIn</h3>
        <h3 onClick={() => navigate("/signup")}>SignUp</h3>
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
    </form>
  );
};

export default LoginPage;
