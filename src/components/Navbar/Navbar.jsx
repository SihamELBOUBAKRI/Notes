import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import axiosApi from "../Axios";

const Navbar = ({UserInfo ,setSearchQuery, setIsConnected }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setshowToast] = useState(false);

  // Function to toggle the modal
  const toggleModal = () => setShowModal(!showModal);

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirmation) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await axiosApi.put('/update-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      });
      console.log(response)

      if (response.message === "Password updated successfully") {
        setshowToast(true); 
        setShowModal(false); 
        setNewPassword('');
        setCurrentPassword('');
        setNewPasswordConfirmation('');


        // Hide the toast after 3 seconds
        setTimeout(() => {
          setshowToast(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Password change failed:', err);
      alert('Error updating password. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear local storage and logout
    localStorage.removeItem("cin");
    localStorage.removeItem("password");
    setIsConnected(false);
    navigate("/"); // Redirect to login
  };

  return (
    <div className="Navbar">
      <div className="greeting">
        <h1 className="salutation"><img className="hi" src="./images/smile.png"/>  Hello, {UserInfo?.userfirstname || "Guest"}</h1>
      </div>
      <input
        type="text"
        placeholder="Search notes..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button onClick={toggleModal}>Change Password</button>

     
       {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="changePasswordModal" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                 <h5 className="modal-title" id="changePasswordModal">Change Your Password</h5>
                 <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
               </div>
               <div className="modal-body">
                 <form onSubmit={handlePasswordChange}>
                   <div className="mb-3">
                     <label htmlFor="currentPassword" className="form-label">Current Password</label>
                     <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                   </div>
                   <div className="mb-3">
                     <label htmlFor="newPasswordConfirmation" className="form-label">Confirm New Password</label>
                     <input
                      type="password"
                      className="form-control"
                      id="newPasswordConfirmation"
                      value={newPasswordConfirmation}
                      onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Change Password</button>
                 </form>
               </div>
             </div>
           </div>
         </div>
      )}

      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div
            id="liveToast"
            className="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">SUCCESS</strong>
              <small>Now</small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setshowToast(false)} // Close the toast manually
              ></button>
            </div>
            <div className="toast-body">Password updated successfully!</div>
          </div>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;

