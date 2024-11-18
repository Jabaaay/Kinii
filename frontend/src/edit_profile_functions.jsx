// Import any necessary assets and styles
import React from 'react';
import logo from './assets/1.png';
import { useNavigate } from 'react-router-dom';

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
    
    
    <button onClick={() => handleNavigation('/profile')}>Account Overview</button>
    <button onClick={() => handleNavigation('/edit_profile')}>Edit Account</button>
  
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
      <td className='td2'>Course</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Department</td>
      <td className='td2'><input type="text" className='inp1'  /></td>
    </tr>
    <tr className='tr2'>
      <td className='td2'>Role</td>
      <td className='td2'><input type="text" className='inp' placeholder='Student' readOnly/></td>
    </tr>
    <tr>
      <button className='editBtn' onClick={() => handleNavigation('/profile')}>Save Changes</button>
    </tr>
  </table>


            
        </div>

</div>
    

  </>
     
  );
}

export default EditProfileF;
