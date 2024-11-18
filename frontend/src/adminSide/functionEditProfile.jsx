// Import any necessary assets and styles
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar';

function EditProfileF() {

  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <>
    
    <h1>Account Overview</h1>

<div className="prof-card">

<div className="prof-card1">

  <div className="prof"><button>Image</button>
  </div>

  <div className="prof1">
    
    
    <button onClick={() => handleNavigation('/adminProfile')}>Account Overview</button>
    <button onClick={() => handleNavigation('/functionEditProfile')}>Edit Account</button>
  
  </div>


</div>

        <div className="prof-card2">

  <span className='profInfo'>Profile Information</span>

  <table className='t2'>
    <tr className='tr2'>
      <td className='td2'>ID Number</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Full Name</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Email</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Position</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Role</td>
      <td className='td2'><input type="text" className='inp' placeholder='Admin' readOnly/></td>
    </tr>
    <tr>
      <button className='editBtn' onClick={() => handleNavigation('/adminProfile')}>Save Changes</button>
    </tr>
  </table>


            
        </div>

</div>
    

  </>
     
  );
}

export default EditProfileF;
