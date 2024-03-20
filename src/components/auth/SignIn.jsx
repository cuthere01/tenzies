import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../data/firebase";

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function logIn(e) {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        setError("");
        setEmail("");
        setPassword("");
      })
        .catch((error) => {
            console.log(error);
            setError("SORRY, COULDN'T FIND YOUR ACCOUNT")
      });
  }
  return (
    <form>
      <div className="auth">
        <h2>{props.langText(18)}</h2>
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
        <button className="main-button" onClick={logIn}>{props.langText(15)}</button>
        {error && <p className="auth__error">{error}</p>}
        <p>{props.langText(21)} <span className="auth__link" onClick={props.openReg}>{props.langText(25)}</span></p>
      </div>
    </form>
  );
};

export default SignIn;