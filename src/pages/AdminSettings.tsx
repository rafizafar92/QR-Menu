import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { 
  Settings, 
  Save, 
  Lock, 
  User,
  Check,
  AlertCircle,
  QrCode,
  Upload
} from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingQris, setUploadingQris] = useState(false);
  
  // Form States
  const [venueData, setVenueData] = useState({
    name: '',
    description: '',
    logo_url: '',
    currency: '$',
    opening_hours: '',
    accept_qris: false,
    qris_image_url: ''
  });
  
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!user?.venueId) return;

    const fetchVenue = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select('name, description, logo_url, currency, opening_hours, accept_qris, qris_image_url')
        .eq('id', user.venueId)
        .single();

      if (data && !error) {
        setVenueData({
          name: data.name || '',
          description: data.description || '',
          logo_url: data.logo_url || '',
          currency: data.currency || '$',
          opening_hours: data.opening_hours || '',
          accept_qris: data.accept_qris || false,
          qris_image_url: data.qris_image_url || ''
        });
      }
      setLoading(false);
    };

    fetchVenue();
  }, [user?.venueId]);

  const handleSaveBranding = async () => {
    if (!user?.venueId) return;
    setSaving('branding');
    
    const { error } = await supabase
      .from('venues')
      .update({
        name: venueData.name,
        description: venueData.description,
        logo_url: venueData.logo_url
      })
      .eq('id', user.venueId);

    if (error) alert(error.message);
    else {
      setSuccess('branding');
      setTimeout(() => setSuccess(null), 2000);
    }
    setSaving(null);
  };

  const handleSavePreferences = async () => {
    if (!user?.venueId) return;
    setSaving('preferences');
    
    const { error } = await supabase
      .from('venues')
      .update({
        currency: venueData.currency,
        opening_hours: venueData.opening_hours
      })
      .eq('id', user.venueId);

    if (error) alert(error.message);
    else {
      setSuccess('preferences');
      setTimeout(() => setSuccess(null), 2000);
    }
    setSaving(null);
  };

  const handleQrisImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingQris(true);
      if (!e.target.files || e.target.files.length === 0) return;
      if (!user?.venueId) throw new Error('Venue tidak ditemukan.');

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.venueId}/qris-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      setVenueData(prev => ({ ...prev, qris_image_url: data.publicUrl }));
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingQris(false);
    }
  };

  const handleSaveQris = async () => {
    if (!user?.venueId) return;
    setSaving('qris');

    const { error } = await supabase
      .from('venues')
      .update({
        accept_qris: venueData.accept_qris,
        qris_image_url: venueData.qris_image_url
      })
      .eq('id', user.venueId);

    if (error) alert(error.message);
    else {
      setSuccess('qris');
      setTimeout(() => setSuccess(null), 2000);
    }
    setSaving(null);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return;
    setSaving('password');
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) alert(error.message);
    else {
      setSuccess('password');
      setNewPassword('');
      setTimeout(() => setSuccess(null), 2000);
    }
    setSaving(null);
  };

  if (loading) return <AdminLayout title="Settings"><div className="p-8 text-center text-slate-400 font-bold">Loading configuration...</div></AdminLayout>;

  return (
    <AdminLayout
      title="Pengaturan Toko"
      subtitle="Customize your venue branding, system preferences, and account security."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        
        {/* Branding Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900">Identitas Merek</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Tempat</label>
              <input type="text" value={venueData.name} onChange={(e) => setVenueData({...venueData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi</label>
              <textarea rows={3} value={venueData.description} onChange={(e) => setVenueData({...venueData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Logo URL</label>
              <input type="text" value={venueData.logo_url} onChange={(e) => setVenueData({...venueData, logo_url: e.target.value})} placeholder="https://example.com/logo.png" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <button onClick={handleSaveBranding} disabled={saving === 'branding'} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
            {success === 'branding' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving === 'branding' ? 'Menyimpan...' : success === 'branding' ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>

        {/* System Preferences Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6 space-y-6 text-left">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900">System Preferences</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Currency Symbol</label>
              <input type="text" value={venueData.currency} onChange={(e) => setVenueData({...venueData, currency: e.target.value})} placeholder="$" maxLength={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Opening Hours</label>
              <input type="text" value={venueData.opening_hours} onChange={(e) => setVenueData({...venueData, opening_hours: e.target.value})} placeholder="08:00 - 22:00" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <button onClick={handleSavePreferences} disabled={saving === 'preferences'} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
            {success === 'preferences' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving === 'preferences' ? 'Saving...' : success === 'preferences' ? 'Preferences Saved' : 'Save Preferences'}
          </button>
        </div>

        {/* QRIS Payment Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900">Pembayaran QRIS</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={venueData.accept_qris}
                  onChange={(e) => setVenueData({ ...venueData, accept_qris: e.target.checked })}
                  className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  <span className="block text-xs font-bold text-slate-700">Terima pembayaran QRIS</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Pelanggan bisa memilih QRIS di halaman pesanan.</span>
                </span>
              </label>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gambar QRIS</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-lg py-2.5 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Upload size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase">
                    {uploadingQris ? 'Mengunggah...' : 'Unggah Gambar QRIS'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrisImageUpload}
                    className="hidden"
                    disabled={uploadingQris || saving === 'qris'}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pratinjau QRIS</span>
              {venueData.qris_image_url ? (
                <img
                  src={venueData.qris_image_url}
                  alt="Pratinjau QRIS"
                  className="max-h-56 w-auto max-w-full rounded-xl border border-slate-200 bg-slate-50 object-contain mx-auto"
                />
              ) : (
                <div className="h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-300">
                  <QrCode size={36} strokeWidth={1.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Belum ada gambar</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={handleSaveQris} disabled={saving === 'qris' || uploadingQris} className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
            {success === 'qris' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving === 'qris' ? 'Menyimpan...' : success === 'qris' ? 'Tersimpan' : 'Simpan Pembayaran'}
          </button>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs p-6 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900">Keamanan Akun</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Masuk sebagai</span>
                <span className="text-sm font-bold text-slate-700">{user?.email}</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Masukkan password baru" title="Update password akses" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={handleUpdatePassword} disabled={saving === 'password' || !newPassword} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                {success === 'password' ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {saving === 'password' ? 'Memperbarui...' : success === 'password' ? 'Password Diperbarui' : 'Ubah Password'}
              </button>
              <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium px-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <p>Ensure your password is at least 6 characters. You will remain logged in after changing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}