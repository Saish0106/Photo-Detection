import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import "./Auth.css"; // Import CSS file

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [uploadHistory, setUploadHistory] = useState([]);

    const navigate = useNavigate(); // Navigation function

    useEffect(() => {
        const savedHistory = localStorage.getItem("uploadHistory");
        if (savedHistory) {
            setUploadHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("❌ Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setResult(response.data);
            const newHistory = [...uploadHistory, { image: imagePreview, result: response.data }];
            setUploadHistory(newHistory);
            localStorage.setItem("uploadHistory", JSON.stringify(newHistory));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("❌ Failed to analyze image.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        navigate("/"); // Redirect to login page
    };

    return (
        <div className="main-container">
            {/* Top Bar with Profile Menu */}
            <div className="top-bar">
                <div className="profile-section">
                    <button className="profile-button" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>👤</button>
                    {profileMenuOpen && (
                        <div className="profile-menu" onBlur={() => setProfileMenuOpen(false)} tabIndex={0}>
                            <button onClick={() => navigate("/edit-profile")}>✏️ Edit Profile</button>
                            <button onClick={() => navigate("/history")}>📜 History</button>
                            <button onClick={handleLogout}>🚪 Logout</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                <h2>🔍 AI Image Detector</h2>

                {/* File Input & Upload Button */}
                <label htmlFor="file-upload" className="custom-file-upload">📸 Choose Image</label>
                <input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                />
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Selected Preview" />
                    </div>
                )}
                <button onClick={handleUpload}>🚀 Upload</button>

                {/* Display Result */}
                {result && (
                    <div className="result-container">
                        <h3>✅ Result: {result.isOriginal}</h3>
                        {result.metadata && (
                            <div className="metadata-scroll">
                                <h3>📸 Image Metadata</h3>
                                <table className="metadata-table">
                                    <tbody>
                                        {Object.entries(result.metadata).map(([key, value]) => (
                                            <tr key={key}>
                                                <td className="metadata-key">{key.replace(/([A-Z])/g, " $1").trim()}</td>
                                                <td className="metadata-value">{value?.toString() || "N/A"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                
            </div>
        </div>
    );
}

export default App;
