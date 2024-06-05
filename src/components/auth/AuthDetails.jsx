import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../data/firebase";

const AuthDetails = (props) => {
  const [account, setAccount] = useState(false)

  function userSignOut() {
    signOut(auth)
      .then(() => console.log("success"))
      .catch((e) => console.log(e));
  }

  return (
    
    <div className="account mr-r">
      <button className="main-button icon-button" onClick={() => setAccount(prevAccount => !prevAccount)}>
        <img src="./media/user.svg" alt="" />
      </button>
      <div className={`account__content ${account ? "active" : ""}`}>
        {props.authUser ? (
          <div>
            <p>
              {`${props.langText(27)} ${props.authUser.email}`}
              <br />
              <span className="account__action" onClick={userSignOut}>{props.langText(28)}</span>
            </p>
            
          </div>
        ) : (
          <div>
            <p>
              {props.langText(29)}
              <br />
              <span className="account__action" onClick={props.openAuth}>
                {props.langText(15)}
              </span>&nbsp;{props.langText(30)} <span className="account__action" onClick={props.openReg}>
                {props.langText(22)}
              </span>
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AuthDetails;