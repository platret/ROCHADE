import { Card } from './Card'

const Code = ({ children }: { children: string }) => <code className="font-mono text-body-sm">{children}</code>

export const SetupNotice = () => (
  <Card className="space-y-3">
    <h2 className="text-h3">Supabase-Zugang fehlt</h2>
    <ol className="list-decimal space-y-1 pl-5">
      <li>
        <Code>apps/web/.env.example</Code> nach <Code>apps/web/.env</Code> kopieren.
      </li>
      <li>
        <Code>VITE_SUPABASE_URL</Code> und <Code>VITE_SUPABASE_ANON_KEY</Code> eintragen.
      </li>
      <li>
        <Code>npm run dev</Code> neu starten.
      </li>
    </ol>
  </Card>
)
