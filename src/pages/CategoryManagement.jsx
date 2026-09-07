import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, addCategory, updateCategory, deleteCategory } from '../utils/videoStorage'
import { generateId } from '../utils/videoUtils'

function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [view, setView] = useState('list') // 'list', 'add', 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const cats = await getCategories()
      setCategories(cats)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Failed to load categories. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please enter a category name')
        return
      }
      await addCategory(formData)
      await loadCategories()
      setView('list')
      setFormData({ name: '', description: '' })
    } catch (err) {
      console.error('Error adding category:', err)
      alert('Failed to add category. Please try again.')
    }
  }

  const handleEditCategory = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Please enter a category name')
        return
      }
      await updateCategory(selectedCategory.id, formData)
      await loadCategories()
      setView('list')
      setSelectedCategory(null)
      setFormData({ name: '', description: '' })
    } catch (err) {
      console.error('Error updating category:', err)
      alert('Failed to update category. Please try again.')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId)
      await loadCategories()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Failed to delete category. Please try again.')
    }
  }

  const startEdit = (category) => {
    setSelectedCategory(category)
    setFormData({ name: category.name, description: category.description })
    setView('edit')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Category Management</h1>
        <p className="text-gray-600">Manage video categories for organization</p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-navy-900">{loading ? '...' : categories.length}</div>
            <div className="text-gray-600">Total Categories</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setView('add')
                setFormData({ name: '', description: '' })
              }}
              className="px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors"
            >
              Add Category
            </button>
            <Link
              to="/admin/videos"
              className="px-6 py-3 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Videos
            </Link>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {view === 'list' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-electric-600"></div>
              <p className="text-gray-600 mt-2">Loading categories...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-navy-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(category)}
                          className="text-navy-600 hover:text-navy-700"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(category)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && categories.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600">Add your first category to get started.</p>
            </div>
          )}
        </div>
      )}

      {view === 'add' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Add New Category</h2>
            <button
              onClick={() => setView('list')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                placeholder="Enter category description"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddCategory}
                className="flex-1 px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors"
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setView('list')
                  setFormData({ name: '', description: '' })
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'edit' && selectedCategory && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Edit Category</h2>
            <button
              onClick={() => {
                setView('list')
                setSelectedCategory(null)
                setFormData({ name: '', description: '' })
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-500 focus:border-transparent"
                placeholder="Enter category description"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleEditCategory}
                className="flex-1 px-6 py-3 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg transition-colors"
              >
                Update Category
              </button>
              <button
                onClick={() => {
                  setView('list')
                  setSelectedCategory(null)
                  setFormData({ name: '', description: '' })
                }}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Delete Category</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement
