import React, { useState } from "react";

function EditProfile() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const handleSave = () => {
        alert("Profile updated successfully!"); 
    };

    return (
        <div className="container">
            <h2>✏️ Edit Profile</h2>
            <label>Full Name:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleSave}>💾 Save</button>
        </div>
    );
}

export default EditProfile;
