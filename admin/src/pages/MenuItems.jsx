import { useState, useEffect, useCallback } from 'react'
import adminApi from '../api/api'

const EMPTY = { name:'', description:'', price:'', unit:'kg', category:'Fruits', image_url:'', is_available:true }
const CATEGORIES = ['Fruits','Seasonal','Exotic','Berries']
const UNITS = ['kg','gram','dozen','piece','bundle']

export default function MenuItems() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getMenu()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); setError('') }
  const openEdit = item => { setEditing(item); setForm({ ...item, price: String(item.price) }); setModal(true); setError('') }
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      if (editing) await adminApi.updateItem(editing.id, payload)
      else         await adminApi.addItem(payload)
      setSuccess(editing ? 'Item updated!' : 'Item added!')
      closeModal(); load()
      setTimeout(() => setSuccess(''), 3000)
    } catch(err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this item?')) return
    try { await adminApi.deleteItem(id); load(); setSuccess('Deleted.'); setTimeout(()=>setSuccess(''),3000) }
    catch(e) { setError(e.message) }
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }))

  return (
    <>
      <div className="topbar">
        <span className="topbar__title">Menu Items</span>
        <span className="topbar__badge">🍑 Fruits</span>
      </div>
      <div className="page-content">
        {success && <div className="alert alert-success">{success}</div>}
        {error && !modal && <div className="alert alert-error">{error}</div>}

        <div className="page-header">
          <h2>Menu Items</h2>
          <button className="btn btn-gold" onClick={openAdd}>+ Add Item</button>
        </div>

        <div className="data-card">
          {loading ? <div style={{padding:40}}><div className="spinner"/></div>
          : items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🍑</div>
              <p>No menu items yet. Add your first fruit!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Name</th><th>Category</th><th>Price</th><th>Unit</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{fontWeight:600}}>{item.name}</div>
                      {item.description && <div style={{fontSize:'0.75rem',color:'var(--grey)',marginTop:2}}>{item.description.slice(0,60)}{item.description.length>60?'…':''}</div>}
                    </td>
                    <td><span className="badge badge-gold">{item.category}</span></td>
                    <td className="td-price">₹{item.price}</td>
                    <td style={{color:'var(--grey)'}}>{item.unit}</td>
                    <td><span className={`badge ${item.is_available?'badge-green':'badge-red'}`}>{item.is_available?'Available':'Unavailable'}</span></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={()=>openEdit(item)}>Edit</button>
                        <button className="btn btn-red btn-sm" onClick={()=>handleDelete(item.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">{editing ? 'Edit Item' : 'Add Menu Item'}</h3>
              <button className="modal__close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                {error && <div className="alert alert-error" style={{marginBottom:16}}>{error}</div>}
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={e=>f('name',e.target.value)} required placeholder="e.g. Alphonso Mango" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e=>f('description',e.target.value)} placeholder="Short description..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e=>f('price',e.target.value)} required placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-select" value={form.unit} onChange={e=>f('unit',e.target.value)}>
                      {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e=>f('category',e.target.value)}>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL (optional)</label>
                  <input className="form-input" value={form.image_url} onChange={e=>f('image_url',e.target.value)} placeholder="https://..." />
                </div>
                <div className="form-check">
                  <input type="checkbox" id="avail" checked={form.is_available} onChange={e=>f('is_available',e.target.checked)} />
                  <label htmlFor="avail">Available for customers</label>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-gold" disabled={saving}>{saving?'Saving…':editing?'Update Item':'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
