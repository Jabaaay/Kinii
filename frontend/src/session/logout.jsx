import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import Swal from "sweetalert2";

const clientId = "556695054744-arqaruhda60fv774uephm2irh0uan4du.apps.googleusercontent.com";

function Logout() {
  const navigate = useNavigate();
  

  const onSuccess = async () => {
    console.log("Log Out Success!");
  
    // Handles Google session logout
    googleLogout();
  
    // Clear all session data on the client
    sessionStorage.clear();  // Clears all session items, including 'token' and 'userInfo'

    // Retrieve the token from session storage if needed
    const token = sessionStorage.getItem('token');
  
    // Make an API call to logout on the server
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
          'Content-Type': 'application/json',  // Optional, but useful if you send JSON data
        },
        credentials: 'include',  // Send cookies with the request (if necessary)
      });
  
      const data = await response.json();
  
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have successfully logged out!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#FFB703',
          customClass: {
            confirmButton: 'swal-btn'
          }
        }).then(() => {
          navigate("/"); // Redirect to login page after alert confirmation
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#FFB703',
        customClass: {
          confirmButton: 'swal-btn'
        }
      });
    }
  };
  

  return (
    <div id='signOut'>
      <button className="logout" onClick={onSuccess}>Log Out</button>
    </div>
  );
}

export default Logout;
