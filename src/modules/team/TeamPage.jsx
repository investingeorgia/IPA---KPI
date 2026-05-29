import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTeam } from '@shared/hooks/useTeam';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Button from '@shared/components/ui/Button';
import Modal from '@shared/components/ui/Modal';
import SearchInput from '@shared/components/ui/SearchInput';
import MemberTable from './components/MemberTable';

export function TeamPage() {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { members } = useTeam();

  const filtered = (members || []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAdd() {
    if (!newName.trim() || !newEmail.trim()) return;
    setSaving(true);
    try {
      const initials = newName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const colors = ['#1F5A45', '#3E8367', '#C77A2B', '#5A6FB8', '#8B4A8E', '#0B3D2E'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      await addDoc(collection(db, 'users'), {
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        initials,
        color,
        language: 'en',
        active: true,
      });
      setNewName('');
      setNewEmail('');
      setNewRole('user');
      setAddOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>{t('team')}</h1>
        <Button variant="primary" onClick={() => setAddOpen(true)}>+ Add user</Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder={t('search')} />

      <MemberTable members={filtered} onRowClick={(member) => navigate(`/team/${member.id}`)} />

      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add team member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd} loading={saving} disabled={!newName.trim() || !newEmail.trim()}>Add member</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label">Full name</label>
            <input className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nino Beridze" autoFocus />
          </div>
          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="nino@enterprise.gov.ge" />
          </div>
          <div className="field">
            <label className="field-label">Role</label>
            <select className="input" value={newRole} onChange={e => setNewRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>
            After adding, create their login in Firebase console → Authentication → Add user.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default TeamPage;
