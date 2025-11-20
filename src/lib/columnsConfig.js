// Canonical sheet columns for consistent visual layout
// Per-template or per-dataset can hide/override as needed

export const canonicalColumns = [
  { id: 'id', label: 'ID', width: 80 },
  { id: 'title', label: 'Title', flex: 1 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'owner', label: 'Owner', width: 160 },
  { id: 'dueDate', label: 'Due Date', width: 140 },
  { id: 'notes', label: 'Notes', flex: 1 },
]

// Helper to hide or override columns
export function buildTemplateColumns(base = canonicalColumns, { hide = [], overrides = {} } = {}) {
  return base
    .filter(col => !hide.includes(col.id))
    .map(col => ({ ...col, ...(overrides[col.id] || {}) }))
}
