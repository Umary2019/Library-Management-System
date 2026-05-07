import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', registrationNumber: user?.registrationNumber || '', department: user?.department || '', level: user?.level || '', address: user?.address || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      await changePassword(password);
      setPassword({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to change password');
    }
  };

  const handleChange = (setter) => (event) => setter((value) => ({ ...value, [event.target.name]: event.target.value }));

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <div className="card">
        <h3 className="text-xl font-bold">Profile Information</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
          {Object.keys(profile).map((field) => <input key={field} className="input-field" name={field} value={profile[field]} onChange={handleChange(setProfile)} placeholder={field} />)}
          <button className="btn-primary md:col-span-2" disabled={saving} type="submit">{saving ? 'Saving...' : 'Update Profile'}</button>
        </form>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold">Change Password</h3>
        <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
          <input className="input-field" name="currentPassword" type="password" value={password.currentPassword} onChange={handleChange(setPassword)} placeholder="Current password" required />
          <input className="input-field" name="newPassword" type="password" value={password.newPassword} onChange={handleChange(setPassword)} placeholder="New password" required />
          <button className="btn-secondary" type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}
