import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
const ResetPassword = ({
  setPassword,
  password,
  reEnterPassword,
  setReEnterPassword,
  setToken,
  token,
  active,
  setActive,
  numItemCart,
  setSearch,
  isAdmin,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    setToken(token);
    console.log("token: ", token);
  }, [location]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && reEnterPassword) {
      if (password === reEnterPassword) {
        console.log(
          "password: ",
          password,
          "\nReenter password: ",
          reEnterPassword
        );

        try {
          const response = await fetch(
            "http://localhost:3000/api/user/resetPassword",
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json", authtoken: token },
              body: JSON.stringify({ password }),
            }
          );
          const data = await response.json();
          console.log("data: ", data);
          if (data.message) {
            alert(data.message);
            setPassword("");
            setReEnterPassword("");
            navigate("/login");
          } else {
            setPassword("");
            setReEnterPassword("");
          }
        } catch (error) {
          console.log("Error while resetting the password: ", error);
        }
      } else {
        alert("Both passwords don't match!!");
      }
    } else {
      alert("Both fields are required!!");
    }
  };
  return (
    <>
      <NavBar
        active={active}
        setActive={setActive}
        token={token}
        setToken={setToken}
        numItemCart={numItemCart}
        setSearch={setSearch}
        isAdmin={isAdmin}
      />
      <form onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <input
          value={password}
          type="password"
          placeholder="Create new password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          value={reEnterPassword}
          type="password"
          placeholder="Re-enter your password..."
          onChange={(e) => setReEnterPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ResetPassword;
