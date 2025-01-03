import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import React from "react";

function App() {
  return (
    <GoogleOAuthProvider clientId="321072450591-dhbam1ksuk3qcmino2h45fvvv7qurnha.apps.googleusercontent.com">
      <GoogleLogin
        buttonText="Login"
        onSuccess={(response) => {
          console.log(response);
          fetch("http://localhost:3000/auth/google-authentication", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: response.credential,
            }),
          })
            .then((response) => console.log(response))
            .then((data) => console.log(data));
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App;
