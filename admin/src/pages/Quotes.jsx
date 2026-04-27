import { useState, useEffect, useCallback } from 'react'
import adminApi from '../api/api'

const EMPTY = { text:'', author:'Tommy Shelby', is_active:true }
const AUTHORS = ['Tommy Shelby','Arthur Shelby','Polly Gray','John Shelby','Alfie Solomons','Michael Gray']

export default function Quotes() {
  const [quotes, setQuotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getAllQuotes()
      .then(setQuotes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true); setError('') }
  const openEdit = q => { setEditing(q); setForm({ text:q.text, author:q.author, is_active:q.is_active }); setModal(true); setError('') }
  const closeModal = () => { setModal(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSaving(true)
    try {
      if (editing) await adminApi.updateQuote(editing.id, form)
      else         await adminApi.addQuote(form)
      setSuccess(editing?'Quote updated!':'Quote added!')
      closeModal(); load()
      setTimeout(()=>setSuccess(''),3000)
    } catch(err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this quote?')) return
    try { await adminApi.deleteQuote(id); load(); setSuccess('Deleted.'); setTimeout(()=>setSuccess(''),3000) }
    catch(e) { setError(e.message) }
  }

  const toggleActive = async q => {
    try { await adminApi.updateQuote(q.id, { ...q, is_active: !q.is_active }); load() }
    catch(e) { setError(e.message) }
  }

  const f = (field, val) => setForm(p => ({ ...p, [field]: val }))

  return (
    <>
      <div className="topbar">
        <span className="topbar__title">Quotes Manager</span>
        <span className="topbar__badge">💬 Quotes</span>
      </div>
      <div className="page-content">
        {success && <div className="alert alert-success">{success}</div>}
        {error && !modal && <div className="alert alert-error">{error}</div>}

        <div className="page-header">
          <div>
            <h2>Rotating Quotes</h2>
            <p style={{color:'var(--grey)',fontSize:'0.83rem',marginTop:4}}>These quotes rotate on the customer homepage.</p>
          </div>
          <button className="btn btn-gold" onClick={openAdd}>+ Add Quote</button>
        </div>

        <div className="data-card">
          {loading ? <div style={{padding:40}}><div className="spinner"/></div>
          : quotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">💬</div>
              <p>No quotes yet. Add some Peaky Blinders wisdom!</p>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Quote</th><th>Character</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id}>
                    <td style={{maxWidth:400}}>
                      <em style={{color:'var(--cream)',fontStyle:'italic',fontFamily:"'IM Fell English',Georgia,serif",fontSize:'0.92rem'}}>
                        "{q.text}"
                      </em>
                    </td>
                    <td><span className="badge badge-gold">— {q.author}</span></td>
                    <td>
                      <button
                        className={`badge ${q.is_active?'badge-green':'badge-red'}`}
                        style={{cursor:'pointer',border:'none'}}
                        onClick={()=>toggleActive(q)}
                        title="Click to toggle"
                      >
                        {q.is_active ? '✓ Active' : '✗ Hidden'}
                      </button>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={()=>openEdit(q)}>Edit</button>
                        <button className="btn btn-red btn-sm" onClick={()=>handleDelete(q.id)}>Delete</button>
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
              <h3 className="modal__title">{editing?'Edit Quote':'Add Quote'}</h3>
              <button className="modal__close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                {error && <div className="alert alert-error" style={{marginBottom:16}}>{error}</div>}
                <div className="form-group">
                  <label className="form-label">Quote Text *</label>
                  <textarea className="form-textarea" style={{minHeight:100}} value={form.text} onChange={e=>f('text',e.target.value)} required placeholder="By order of the Peaky Blinders..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Character / Author</label>
                  <select className="form-select" value={form.author} onChange={e=>f('author',e.target.value)}>
                    {AUTHORS.map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="qactive" checked={form.is_active} onChange={e=>f('is_active',e.target.checked)} />
                  <label htmlFor="qactive">Show on website</label>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-gold" disabled={saving}>{saving?'Saving…':editing?'Update Quote':'Add Quote'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
