export const Footer = () => (
  <footer className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 font-mono text-label font-medium text-ink-muted">
    <span>Daten: Supabase · Realtime aktiv</span>
    <span>{window.location.host}</span>
  </footer>
)
