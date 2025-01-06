const SignupPage = ({
  firstName,
  lastName,
  username,
  password,
  setFirstName,
  setLastName,
  setUsername,
  setPassword,
}) => {
  async function submitHandler(e) {
    e.preventDefault();
    // console.log(firstName, " ", lastName, " ", username, " ", password);
    if (!firstName || !lastName || !username || !password) {
      alert("All fields are required!!");
      return;
    }
    const obj = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:3000/api/register/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      const data = await response.json();
      console.log("after register: ", data);
      setFirstName("");
      setLastName("");
      setUsername("");
      setPassword("");
      alert(data);
    } catch (error) {
      console.log("Error while registering a user ", error);
    }
  }
  return (
    <form>
      <div className="option-container">
        <h3>SignIn</h3>
        <h3>SignUp</h3>
      </div>
      <h1>Create Account</h1>
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

      <button onClick={submitHandler}>Register</button>
    </form>
  );
};

export default SignupPage;
