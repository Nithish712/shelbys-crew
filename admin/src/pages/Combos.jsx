import { useState, useEffect, useCallback } from 'react'
import adminApi from '../api/api'

const EMPTY = { name:'', description:'', price:'', items:'', is_available:true }

export default function Combos() {
  const [combos, setCombos]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getCombos()
      .then(setCombos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); setError('') }
  const openEdit = c => {
    setEditing(c)
    setForm({ ...c, price: String(c.price), items: (c.items||[]).join('\n') })
    setModal(true); setError('')
  }
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      const itemsArr = form.items.split('\n').map(s=>s.trim()).filter(Boolean)
      const payload  = { ...form, price: parseFloat(form.price), items: itemsArr }
      if (editing) await adminApi.updateCombo(editing.id, payload)
      else         await adminApi.addCombo(payload)
      setSuccess(editing ? 'Combo updated!' : 'Combo added!')
      closeModal(); load()
      setTimeout(()=>setSuccess(''),3000)
    } catch(err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this combo?')) return
    try { await adminApi.deleteCombo(id); load(); setSuccess('Deleted.'); setTimeout(()=>setSuccess(''),3000) }
    catch(e) { setError(e.message) }
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }))

  return (
    <>
      <div className="topbar">
        <span className="topbar__title">Combo Deals</span>
        <span className="topbar__badge">🛒 Combos</span>
      </div>
      <div className="page-content">
        {success && <div className="alert alert-success">{success}</div>}
        {error && !modal && <div className="alert alert-error">{error}</div>}

        <div className="page-header">
          <h2>Combo Deals</h2>
          <button className="btn btn-gold" onClick={openAdd}>+ Add Combo</button>
        </div>

        <div className="data-card">
          {loading ? <div style={{padding:40}}><div className="spinner"/></div>
          : combos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🛒</div>
              <p>No combos yet. Create a bundle deal!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Name</th><th>Items</th><th>Price</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {combos.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{fontWeight:600}}>{c.name}</div>
                      {c.description && <div style={{fontSize:'0.75rem',color:'var(--grey)',marginTop:2}}>{c.description}</div>}
                    </td>
                    <td>
                      <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                        {(c.items||[]).map((it,i)=>
                          <span key={i} style={{background:'var(--smoke)',border:'1px solid var(--border-light)',borderRadius:12,padding:'1px 8px',fontSize:'0.72rem',color:'var(--grey-light)'}}>{it}</span>
                        )}
                      </div>
                    </td>
                    <td className="td-price">₹{c.price}</td>
                    <td><span className={`badge ${c.is_available?'badge-green':'badge-red'}`}>{c.is_available?'Available':'Unavailable'}</span></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={()=>openEdit(c)}>Edit</button>
                        <button className="btn btn-red btn-sm" onClick={()=>handleDelete(c.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&closeModal()}>
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">{editing?'Edit Combo':'Add Combo'}</h3>
              <button className="modal__close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                {error && <div className="alert alert-error" style={{marginBottom:16}}>{error}</div>}
                <div className="form-group">
                  <label className="form-label">Combo Name *</label>
                  <input className="form-input" value={form.name} onChange={e=>f('name',e.target.value)} required placeholder="e.g. The Garrison Special" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e=>f('description',e.target.value)} placeholder="Brief combo description..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e=>f('price',e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Items (one per line)</label>
                  <textarea className="form-textarea" style={{minHeight:100}} value={form.items} onChange={e=>f('items',e.target.value)} placeholder={"Alphonso Mango 500g\nPomegranate 500g\nGrapes 500g"} />
                </div>
                <div className="form-check">
                  <input type="checkbox" id="cavail" checked={form.is_available} onChange={e=>f('is_available',e.target.checked)} />
                  <label htmlFor="cavail">Available for customers</label>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-gold" disabled={saving}>{saving?'Saving…':editing?'Update Combo':'Add Combo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
