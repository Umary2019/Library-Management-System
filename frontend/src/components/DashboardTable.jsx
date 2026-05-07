export default function DashboardTable({ columns, rows, renderRow, emptyMessage = 'No data available yet.' }) {
  return (
    <div className="table-wrap">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-semibold uppercase tracking-wide">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => renderRow(row, index))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
