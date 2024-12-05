import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import Swal from "sweetalert2";




const clientId = "556695054744-arqaruhda60fv774uephm2irh0uan4du.apps.googleusercontent.com";

function Logout()
{
    const navigate = useNavigate();

    const onSuccess = () => {
        console.log("Log Out Success!");
        googleLogout();  // Call this to handle the logout

        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have successfully logged out!',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FFB703',
            customClass:
            {
                
                confirmButton: 'swal-btn'
                
            }
            
        }).then(() => {
            navigate("/"); // Redirect to login page after alert confirmation
        });

    }

    return(

        <div id='signOut'>
            <button className="logout" onClick={onSuccess}>Log Out</button>
        </div>
        



    );
}

export default Logout;
