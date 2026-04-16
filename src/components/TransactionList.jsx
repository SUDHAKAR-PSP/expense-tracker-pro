function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p>No transactions yet</p>;
  }

  return (
    <div className="card p-3">
      <h5>Transactions</h5>

      {transactions.map((t) => (
        <div
          key={t.id}
          className="d-flex justify-content-between align-items-center border-bottom py-2"
        >
          <div>
            <strong>{t.title}</strong>
            <div className="small text-muted">{t.category}</div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className={t.type === "INCOME" ? "text-success" : "text-danger"}>
              ₹{Number(t.amount).toLocaleString()}
            </span>

            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => onDelete(t.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;