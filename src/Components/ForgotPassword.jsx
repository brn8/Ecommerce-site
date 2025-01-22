const ForgotPassword = ({ setEmail, email }) => {
  const submitHandler = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/forgotpassword",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          }
        );
        const data = await response.json();
        console.log("data: ", data);
        if (data.url) {
          alert(data.message);
          setEmail("");
        } else {
          alert(data.message);
          setEmail("");
        }
      } catch (error) {
        console.log("Error while sending email: ", error);
      }
    } else {
      alert("Email is required!");
    }
    console.log("Email: ", email);
  };
  return (
    <>
      <form onSubmit={submitHandler}>
        <h1>Forgot Passowrd</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter Your Email..."
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ForgotPassword;
