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
            <p>{`Signed in as ${props.authUser.email}`}</p>
            <button className="main-button icon-button" onClick={userSignOut}>
              <span>Logout</span>
              {/* <img src="./media/logout.svg" alt="" /> */}
            </button>
          </div>
        ) : (
          "Signed Out"
        )}
      </div>
      
    </div>
  );
};

export default AuthDetails;