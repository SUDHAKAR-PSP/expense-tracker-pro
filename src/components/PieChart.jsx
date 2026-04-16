import { Pie } from "react-chartjs-2";

function PieChart({ transactions }) {
  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type !== "EXPENSE") return;

    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }

    categoryMap[t.category] += t.amount;
  });

  const data = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40"
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="card p-3">
      <h5>Category Split</h5>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;