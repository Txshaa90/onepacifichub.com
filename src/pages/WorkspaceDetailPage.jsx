import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, FileText, Layers } from 'lucide-react'
import SharedViewBar from '../components/SharedViewBar'
import SheetLayout from '../components/SheetLayout'
import { applyFilters } from '../lib/filtering'

const STORAGE_KEY = 'workspaces_v1'

const ensureDatasets = (w) => {
  if (w && !Array.isArray(w.datasets)) {
    // Seed minimal sample sheets when missing
    w.datasets = [
      {
        id: 'sheet-1',
        name: 'Projects',
        columns: ['Name', 'Owner', 'Status'],
        rows: [
          { Name: 'Website Redesign', Owner: 'Ava', Status: 'In Progress' },
          { Name: 'Mobile App', Owner: 'Ben', Status: 'Planning' },
        ],
      },
      {
        id: 'sheet-2',
        name: 'Tasks',
        columns: ['Title', 'Assignee', 'Priority'],
        rows: [
          { Title: 'Hero animation', Assignee: 'Cara', Priority: 'High' },
          { Title: 'Cart bug fix', Assignee: 'Dan', Priority: 'Medium' },
        ],
      },
    ]
  }
  return w
}

export default function WorkspaceDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    try { return saved ? JSON.parse(saved) : [] } catch { return [] }
  })
  // Namespaced per-workspace filter state: { [datasetId]: { filters: [], searchQuery: '' } }
  const [datasetFilters, setDatasetFilters] = useState({})

  const wsIndex = useMemo(() => workspaces.findIndex(w => String(w.id) === String(params.id)), [workspaces, params.id])
  const workspace = useMemo(() => {
    const w = workspaces[wsIndex]
    return w ? ensureDatasets({ ...w }) : undefined
  }, [workspaces, wsIndex])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces))
  }, [workspaces])

  // Load saved filters for this workspace
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`pud:filters:${params.id}`)
      if (saved) setDatasetFilters(JSON.parse(saved))
    } catch {}
  }, [params.id])

  // Persist filters for this workspace
  useEffect(() => {
    try {
      localStorage.setItem(`pud:filters:${params.id}`, JSON.stringify(datasetFilters))
    } catch {}
  }, [params.id, datasetFilters])

  const saveWorkspace = (nextWs) => {
    setWorkspaces(prev => prev.map((w, i) => i === wsIndex ? nextWs : w))
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline inline-flex items-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
          </div>
          <h1 className="text-2xl font-bold">Workspace not found</h1>
          <Link to="/workspaces" className="text-blue-600 hover:underline mt-2 inline-block">Go to Workspaces</Link>
        </div>
      </div>
    )
  }

  const totalRecords = workspace.datasets?.reduce((sum, d) => sum + d.rows.length, 0) ?? 0
  const datasetCount = workspace.datasets?.length ?? 0

  const addDataset = () => {
    const name = window.prompt('Dataset name?') || 'New Dataset'
    const columns = ['Name', 'Value']
    const newDataset = { id: `ds-${Date.now()}`, name, columns, rows: [] }
    const next = { ...workspace, datasets: [newDataset, ...(workspace.datasets || [])] }
    saveWorkspace(next)
  }

  const addRow = (datasetId) => {
    const dsIdx = workspace.datasets.findIndex(d => d.id === datasetId)
    if (dsIdx === -1) return
    const ds = workspace.datasets[dsIdx]
    const newRow = Object.fromEntries(ds.columns.map(c => [c, '']))
    const next = { ...workspace }
    next.datasets = next.datasets.map((d, i) => i === dsIdx ? { ...d, rows: [newRow, ...d.rows] } : d)
    saveWorkspace(next)
  }

  const deleteRow = (datasetId, rowIndex) => {
    const dsIdx = workspace.datasets.findIndex(d => d.id === datasetId)
    if (dsIdx === -1) return
    const ds = workspace.datasets[dsIdx]
    const nextRows = ds.rows.filter((_, i) => i !== rowIndex)
    const next = { ...workspace }
    next.datasets = next.datasets.map((d, i) => i === dsIdx ? { ...d, rows: nextRows } : d)
    saveWorkspace(next)
  }

  const updateCell = (datasetId, rowIndex, column, value) => {
    const dsIdx = workspace.datasets.findIndex(d => d.id === datasetId)
    if (dsIdx === -1) return
    const next = { ...workspace }
    next.datasets = next.datasets.map((d, i) => {
      if (i !== dsIdx) return d
      const rows = d.rows.map((r, ri) => ri === rowIndex ? { ...r, [column]: value } : r)
      return { ...d, rows }
    })
    saveWorkspace(next)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate('/workspaces')} className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft size={18} /> Back to Workspaces
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{workspace.name}</h1>
            <p className="text-gray-600">{workspace.description}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><Layers size={16} /> {datasetCount} datasets</div>
            <div className="flex items-center gap-1"><FileText size={16} /> {totalRecords} records</div>
            <button onClick={addDataset} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:shadow-md inline-flex items-center gap-2">
              <Plus size={18} /> Add Dataset
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {(workspace.datasets || []).map((ds) => {
            const fstate = datasetFilters[ds.id] || { filters: [], searchQuery: '' }
            const fieldOptions = (ds.columns || []).map(c => ({ value: c, label: c, type: 'text' }))

            // Apply filters then search
            let filtered = applyFilters(ds.rows || [], fstate.filters || [])
            if (fstate.searchQuery) {
              const q = String(fstate.searchQuery).toLowerCase()
              filtered = filtered.filter(row => (ds.columns || []).some(c => String(row[c] ?? '').toLowerCase().includes(q)))
            }

            const rowsToRender = filtered

            const setFiltersForDataset = (next) => setDatasetFilters(prev => ({ ...prev, [ds.id]: { ...(prev[ds.id] || { searchQuery: '' }), filters: typeof next === 'function' ? next((prev[ds.id]?.filters || [])) : next } }))
            const setSearchForDataset = (q) => setDatasetFilters(prev => ({ ...prev, [ds.id]: { ...(prev[ds.id] || { filters: [] }), searchQuery: q } }))

            return (
              <motion.div
                key={ds.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SheetLayout
                  title={ds.name}
                  subtitle={`${rowsToRender.length} records`}
                  rightActions={(
                    <button onClick={() => addRow(ds.id)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
                      <Plus size={18} /> Add Record
                    </button>
                  )}
                  toolbar={(
                    <SharedViewBar
                      fieldOptions={fieldOptions}
                      filters={fstate.filters}
                      onFiltersChange={setFiltersForDataset}
                      searchQuery={fstate.searchQuery}
                      onSearchChange={setSearchForDataset}
                    />
                  )}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-t border-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          {(ds.columns || []).map((c) => (
                            <th key={c} className="sticky top-0 z-10 bg-neutral-50 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider px-4 py-3">
                              <span className="min-w-max whitespace-nowrap">{c}</span>
                            </th>
                          ))}
                          <th className="sticky top-0 z-10 bg-neutral-50 w-24 px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {rowsToRender.map((row, ri) => (
                          <tr key={ri} className="border-t border-neutral-200 hover:bg-neutral-50">
                            {(ds.columns || []).map((c) => (
                              <td key={c} className="px-4 py-3">
                                <input
                                  value={row[c] ?? ''}
                                  onChange={(e) => updateCell(ds.id, ri, c, e.target.value)}
                                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder={c}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteRow(ds.id, ri)}
                                className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                                aria-label="Delete row"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {rowsToRender.length === 0 && (
                          <tr>
                            <td colSpan={(ds.columns?.length || 0) + 1} className="px-4 py-8 text-center text-gray-500 text-sm">
                              No matching records. Try clearing filters or search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </SheetLayout>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
