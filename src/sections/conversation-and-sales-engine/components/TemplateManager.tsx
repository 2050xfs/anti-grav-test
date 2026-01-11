'use client'

import { useState } from 'react'
import type { Template } from '../../../../product/sections/conversation-and-sales-engine/types'

export interface TemplateManagerProps {
  templates: Template[]
  onCreateTemplate?: (template: Omit<Template, 'id' | 'useCount'>) => void
  onUpdateTemplate?: (id: string, template: Partial<Template>) => void
  onDeleteTemplate?: (id: string) => void
  onUseTemplate?: (id: string) => void
}

const categoryColors: Record<string, string> = {
  qualification: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  meeting: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  nurture: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300',
  'follow-up': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  closing: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
}

export function TemplateManager({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onUseTemplate
}: TemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({
    name: '',
    category: 'qualification',
    content: ''
  })

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    if (selectedCategory && template.category !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        template.name.toLowerCase().includes(query) ||
        template.content.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Group by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = []
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  const handleSave = () => {
    if (selectedTemplate) {
      onUpdateTemplate?.(selectedTemplate.id, editingTemplate)
    } else {
      onCreateTemplate?.(editingTemplate as Omit<Template, 'id' | 'useCount'>)
    }
    setIsCreating(false)
    setSelectedTemplate(null)
    setEditingTemplate({ name: '', category: 'qualification', content: '' })
  }

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template)
    setEditingTemplate(template)
    setIsCreating(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setSelectedTemplate(null)
    setEditingTemplate({ name: '', category: 'qualification', content: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Response Templates
            </h1>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + New Template
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Templates</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {templates.length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Most Used</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.max(...templates.map(t => t.useCount))}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Categories</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Object.keys(templatesByCategory).length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Uses</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {templates.reduce((sum, t) => sum + t.useCount, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isCreating ? (
          /* Create/Edit Template Form */
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
              {selectedTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  placeholder="e.g., High-Value Lead Response"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={editingTemplate.category}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as Template['category'] })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  <option value="qualification">Qualification</option>
                  <option value="meeting">Meeting</option>
                  <option value="nurture">Nurture</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="closing">Closing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Template Content
                </label>
                <textarea
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  placeholder="Write your template here. Use [brackets] for merge tags like [name], [company], etc."
                  rows={10}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none font-mono text-sm"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Available merge tags: [name], [company], [title], [pain point], [metric], [timeline], [next step]
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={!editingTemplate.name || !editingTemplate.content}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {selectedTemplate ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Template List */
          <div>
            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    All
                  </button>
                  {Object.keys(categoryColors).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="text-slate-400 dark:text-slate-500 mb-2">No templates found</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your filters or create a new template
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                          {template.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[template.category]}`}>
                          {template.category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                          {template.useCount}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">uses</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 font-mono">
                        {template.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => onUseTemplate?.(template.id)}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        Use Template
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteTemplate?.(template.id)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
