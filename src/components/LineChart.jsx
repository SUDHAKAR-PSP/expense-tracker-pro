import { Line } from "react-chartjs-2";

function LineChart({ transactions }) {
  const dateMap = {};

  transactions.forEach((t) => {
    const date = new Date(t.created_at).toLocaleDateString();

    if (!dateMap[date]) dateMap[date] = 0;

    if (t.type === "INCOME") {
      dateMap[date] += t.amount;
    } else {
      dateMap[date] -= t.amount;
    }
  });

  const data = {
    labels: Object.keys(dateMap),
    datasets: [
      {
        label: "Daily Balance",
        data: Object.values(dateMap),
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4, // smooth curve
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#4bc0c0"
      }
    ]
  };

  return (
    <div className="card p-3">
      <h5>Daily Trend</h5>
      <Line data={data} />
    </div>
  );
}

export default LineChart;