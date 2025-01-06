import { useState } from "react";
import SignupPage from "./Components/SignupPage";
import "./App.css";

function App() {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);

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
