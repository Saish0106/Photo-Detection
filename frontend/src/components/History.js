import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/history")
            .then(response => setHistory(response.data))
            .catch(error => console.error("Error fetching history:", error));
    }, []);

    return (
        <div className="container">
            <h2>📜 Upload History</h2>
            {history.length > 0 ? (
                history.map((item, index) => (
                    <div key={index} className="history-item">
                        <img src={item.image} alt="Uploaded" />
                        <p>{item.result.isOriginal}</p>
                    </div>
                ))
            ) : (
                <p>No upload history found.</p>
            )}
        </div>
    );
}

export default History;
