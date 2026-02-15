import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.css";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:8750/api/admin/leaderboard",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const json = await response.json();

        // Expecting: { status: 'success', data: [...] }
        setLeaderboard(json.data ?? []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className={styles.message}>Loading leaderboard...</p>;
  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (leaderboard.length === 0)
    return <p className={styles.message}>No leaderboard data available.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Leaderboard</h2>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} ${styles.rank}`}>#</th>
            <th className={`${styles.th} ${styles.player}`}>Player</th>
            <th className={`${styles.th} ${styles.level}`}>Level</th>
            <th className={styles.th}>Last Solve</th>
          </tr>
        </thead>

        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className={styles.row}>
              <td className={`${styles.td} ${styles.rank}`}>{index + 1}</td>
              <td className={`${styles.td} ${styles.player}`}>
                {entry.playerId}
              </td>
              <td className={`${styles.td} ${styles.level}`}>{entry.level}</td>
              <td className={`${styles.td} ${styles.time}`}>
                {new Date(entry.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
