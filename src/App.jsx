import { useState } from "react";
import SignupPage from "./Components/SignupPage";
import "./App.css";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <SignupPage
        firstName={firstName}
        lastName={lastName}
        username={username}
        password={password}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    </>
  );
}

export default App;
