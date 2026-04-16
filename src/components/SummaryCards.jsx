function SummaryCards({ transactions }) {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    const amount = Number(t.amount) || 0;

    if (t.type === "INCOME") income += amount;
    else expense += amount;
  });

  const balance = income - expense;

  return (
    <div className="row text-center mb-4">

      <div className="col-md-4">
        <div className="card p-3">
          <h6>Total Balance</h6>
          <h3 className={balance >= 0 ? "text-success" : "text-danger"}>
            ₹{balance.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3">
          <h6>Income</h6>
          <h3 className="text-success">
            ₹{income.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card p-3">
          <h6>Expense</h6>
          <h3 className="text-danger">
            ₹{expense.toLocaleString()}
          </h3>
        </div>
      </div>

    </div>
  );
}

export default SummaryCards;