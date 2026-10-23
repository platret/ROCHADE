import type { AssignmentRow } from '../lib/assignmentRows'
import { AssignmentTableRow } from './AssignmentTableRow'
import { Card } from './Card'

const columns = ['Haushalt', 'Zuhause', 'Bedarf', 'Rochade-Wohnung', 'Auszug', 'Rückkehr', 'Status']

export const AssignmentTable = ({ rows }: { rows: AssignmentRow[] }) => (
  <Card padded={false} className="overflow-x-auto">
    <table className="min-w-full text-left text-body-sm">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-4 py-3 text-label whitespace-nowrap text-ink-muted">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <AssignmentTableRow key={row.household.id} row={row} />
        ))}
      </tbody>
    </table>
  </Card>
)
