import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../data/firebase";

const SignUp = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copyPassword, setCopyPassword] = useState("");
  const [error, setError] = useState("");
  function register(e) {
    e.preventDefault();
    if (copyPassword !== password) {
      setError("Passwords didn't match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user.user.email, user.user.uid);
        setError("");
        setEmail("");
        setCopyPassword("");
        setPassword("");
        props.created(user.user.email, user.user.uid);
      })
      .catch((error) => console.log(error));
  }
  return (
    <form onSubmit={register}>
      <div className="auth">
        <h2>{props.langText(23)}</h2>
        <input
          placeholder={props.langText(19)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <input
          placeholder={props.langText(20)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <input
          placeholder={props.langText(24)}
          value={copyPassword}
          onChange={(e) => setCopyPassword(e.target.value)}
          type="password"
        />
        <button className="main-button">Create</button>
        {error && <p className="auth__error">{error}</p>}
        <p>{props.langText(26)} <span className="auth__link" onClick={props.openReg}>{props.langText(15)}</span></p>
      </div>  
    </form>
  );
};

export default SignUp;