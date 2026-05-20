import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    const { data, error } = await getSupabase()
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setContacts(data);
  }

  async function addContact(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 모두 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    const { error } = await getSupabase()
      .from('contacts')
      .insert({ name: name.trim(), phone: phone.trim() });
    setLoading(false);
    if (error) {
      setError('추가에 실패했습니다: ' + error.message);
    } else {
      setName('');
      setPhone('');
      fetchContacts();
    }
  }

  function startEdit(contact) {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id) {
    if (!editName.trim() || !editPhone.trim()) return;
    const { error } = await getSupabase()
      .from('contacts')
      .update({ name: editName.trim(), phone: editPhone.trim() })
      .eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchContacts();
    }
  }

  async function deleteContact(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await getSupabase().from('contacts').delete().eq('id', id);
    fetchContacts();
  }

  return (
    <div className="container">
      <h1>전화번호부</h1>

      <div className="form-card">
        <form onSubmit={addContact}>
          <div className="form-row">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '추가 중...' : '추가'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>

      <div className="contact-list">
        {contacts.length === 0 ? (
          <p className="empty">저장된 연락처가 없습니다.</p>
        ) : (
          contacts.map((contact) =>
            editingId === contact.id ? (
              <div key={contact.id} className="contact-card">
                <div className="edit-row">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="이름"
                  />
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="전화번호"
                  />
                </div>
                <div className="contact-actions">
                  <button className="btn btn-save" onClick={() => saveEdit(contact.id)}>저장</button>
                  <button className="btn btn-cancel" onClick={cancelEdit}>취소</button>
                </div>
              </div>
            ) : (
              <div key={contact.id} className="contact-card">
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                </div>
                <div className="contact-actions">
                  <button className="btn btn-edit" onClick={() => startEdit(contact)}>수정</button>
                  <button className="btn btn-danger" onClick={() => deleteContact(contact.id)}>삭제</button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
