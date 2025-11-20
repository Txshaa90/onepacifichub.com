import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Filter, Trash2, Plus, FileText, Users, Clock, Layers } from 'lucide-react'

const STORAGE_KEY = 'workspaces_v1'

const seedWorkspaces = [
  {
    id: 'pm',
    name: 'Project Management Hub',
    description: 'Track all team projects and deadlines',
    tags: ['Projects', 'Tasks', 'Team Members'],
    records: 156,
    members: 8,
    updatedAgo: '2 hours ago',
    color: 'from-blue-500 to-cyan-500',
    starred: true,
  },
  {
    id: 'crm',
    name: 'Customer CRM',
    description: 'Manage leads, contacts, and sales pipeline',
    tags: ['Contacts', 'Deals', 'Companies'],
    records: 342,
    members: 5,
    updatedAgo: '1 day ago',
    color: 'from-emerald-500 to-teal-500',
    starred: false,
  },
  {
    id: 'calendar',
    name: 'Content Calendar',
    description: 'Plan and schedule social media content',
    tags: ['Posts', 'Campaigns', 'Analytics'],
    records: 89,
    members: 3,
    updatedAgo: '3 days ago',
    color: 'from-fuchsia-500 to-purple-500',
    starred: true,
  },
  {
    id: 'inventory',
    name: 'Inventory System',
    description: 'Track products, stock levels, and orders',
    tags: ['Products', 'Orders', 'Suppliers'],
    records: 567,
    members: 12,
    updatedAgo: '1 week ago',
    color: 'from-orange-500 to-amber-500',
    starred: false,
  },
  {
    id: 'events',
    name: 'Event Planning',
    description: 'Organize events and manage attendees',
    tags: ['Events', 'Attendees', 'Vendors'],
    records: 234,
    members: 6,
    updatedAgo: '2 weeks ago',
    color: 'from-pink-500 to-rose-500',
    starred: false,
  },
  {
    id: 'hr',
    name: 'HR Dashboard',
    description: 'Employee records and recruitment tracking',
    tags: ['Employees', 'Candidates', 'Positions'],
    records: 178,
    members: 4,
    updatedAgo: '3 weeks ago',
    color: 'from-teal-500 to-emerald-500',
    starred: true,
  },
]

const WorkspacesPage = () => {
  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedWorkspaces
  })
  const [filter, setFilter] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces))
  }, [workspaces])

  const filtered = useMemo(() => {
    if (!filter) return workspaces
    const f = filter.toLowerCase()
    return workspaces.filter(w =>
      w.name.toLowerCase().includes(f) ||
      w.description.toLowerCase().includes(f) ||
      w.tags.some(t => t.toLowerCase().includes(f))
    )
  }, [filter, workspaces])

  const toggleStar = (id) => {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, starred: !w.starred } : w))
  }

  const deleteWorkspace = (id) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id))
  }

  const addWorkspace = () => {
    const name = window.prompt('Workspace name?')
    if (!name) return
    const description = window.prompt('Short description?') || 'New workspace'
    const newWs = {
      id: `${Date.now()}`,
      name,
      description,
      tags: ['General'],
      records: 0,
      members: 1,
      updatedAgo: 'just now',
      color: 'from-blue-500 to-cyan-500',
      starred: false,
    }
    setWorkspaces(prev => [newWs, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Workspaces</h1>
            <p className="text-gray-500 mt-1">{filtered.length} workspaces</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter workspaces..."
                className="pl-10 pr-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((w, index) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
            >
              <div className={`h-1.5 bg-gradient-to-r ${w.color}`} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Link to={`/workspaces/${w.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-gray-900">{w.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStar(w.id) }}
                      className={`p-2 rounded-lg transition-colors ${w.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      aria-label="Toggle favorite"
                    >
                      <Star size={20} className={w.starred ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteWorkspace(w.id) }}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      aria-label="Delete workspace"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <Link to={`/workspaces/${w.id}`}>
                  <p className="text-gray-600 mb-4">{w.description}</p>
                </Link>

                <div className="flex flex-wrap gap-2 mb-5">
                  {w.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {(() => {
                  const datasetCount = Array.isArray(w.datasets) ? w.datasets.length : 0
                  const computedRecords = Array.isArray(w.datasets)
                    ? w.datasets.reduce((sum, d) => sum + (Array.isArray(d.rows) ? d.rows.length : 0), 0)
                    : (typeof w.records === 'number' ? w.records : 0)
                  return (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1"><Layers size={16} /> {datasetCount} datasets</div>
                      <div className="flex items-center gap-1"><FileText size={16} /> {computedRecords} records</div>
                      <div className="flex items-center gap-1"><Users size={16} /> {w.members}</div>
                      <div className="flex items-center gap-1"><Clock size={16} /> {w.updatedAgo}</div>
                    </div>
                  )
                })()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={addWorkspace}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl flex items-center justify-center"
        aria-label="Add workspace"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}

export default WorkspacesPage
