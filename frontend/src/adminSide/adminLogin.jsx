import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
const clientId = "556695054744-arqaruhda60fv774uephm2irh0uan4du.apps.googleusercontent.com";

function Logins() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null); // State to hold user information

  const handleSuccess = (response) => {
    console.log("Login successful", response);

    try {
      const decoded = jwtDecode(response.credential); // Decode the JWT token
      console.log(decoded); // Log decoded info for debugging
      setUserInfo(decoded); // Set user info in state

      // Navigate to profile page with user info
      navigate('/adminDashboard', { state: { userInfo: decoded } });
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  };

  const handleFailure = (error) => {
    console.log("Login failed", error);
  };

  return (
    <>
      <div id='signIn'>
        <GoogleLogin 
          clientId={clientId}
          buttonText="Login"
          onSuccess={handleSuccess}
          onFailure={handleFailure}
          cookiePolicy={'single-host-origin'}
          isSignedIn={true}
        />
      </div>
    </>
  );
}

export default Logins;
