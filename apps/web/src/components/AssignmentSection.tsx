import type { ProjectData } from '@rochade/shared'
import { assignmentRows, statusCounts } from '../lib/assignmentRows'
import { AssignmentTable } from './AssignmentTable'
import { Section } from './Section'
import { SummaryChips } from './SummaryChips'

export const AssignmentSection = ({ data }: { data: ProjectData }) => {
  const rows = assignmentRows(data)
  return (
    <Section title="Zuteilungen" aside={<SummaryChips counts={statusCounts(rows)} />}>
      <AssignmentTable rows={rows} />
    </Section>
  )
}
