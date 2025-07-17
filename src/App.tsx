import { useState } from "react";
import "./App.css";

function App() {
    const [systemUsersCount, setSystemUsersCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSystemUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/data/v9.1/systemusers");
            const data = await response.json();
            setSystemUsersCount(data.value?.length || 0);
        } catch (error) {
            console.error("Error fetching systemusers:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1>Dataverse System Users</h1>
            <div className="card">
                <button onClick={fetchSystemUsers} disabled={loading}>
                    {loading ? "Loading..." : "Fetch System Users"}
                </button>
                {systemUsersCount !== null && <p>System Users Count: {systemUsersCount}</p>}
            </div>
        </>
    );
}

export default App;
