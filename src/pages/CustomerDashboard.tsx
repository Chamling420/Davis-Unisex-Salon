import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, ReactElement, FormEvent } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Navigate } from 'react-router-dom';
import { Calendar, Clock, Scissors, XCircle, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: '', date: '', time: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') {
      setLoading(false);
      return;
    }
    
    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAppointments(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleCancel = async (id: string, currentStatus: string) => {
    if (currentStatus === 'Cancelled') return;
    
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status: 'Cancelled',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const handleOpenEdit = (app: any) => {
    setEditingAppointment(app);
    setEditForm({ name: app.name || '', date: app.date || '', time: app.time || '' });
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;
    
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'appointments', editingAppointment.id), {
        name: editForm.name,
        date: editForm.date,
        time: editForm.time,
        updatedAt: new Date().toISOString()
      });
      setEditingAppointment(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${editingAppointment.id}`);
      alert('Failed to update appointment');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="py-24 px-4 bg-slate-950 min-h-[80vh] border-b border-blue-500/20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl font-serif text-slate-100 mb-4">My Dashboard</h1>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">Welcome back, {user.displayName || 'Guest'}. Manage your appointments below.</p>
        </div>

        <div className="bg-slate-950 border border-blue-500/20 overflow-hidden shadow-sm">
          <div className="border-b border-blue-500/20 p-8">
            <h2 className="text-xl font-serif text-slate-100 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              Appointment History
            </h2>
          </div>
          
          <div className="p-8">
            {appointments.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-[11px] uppercase tracking-[0.2em] leading-loose">
                <p>You have no appointments yet.</p>
                <a href="/book" className="text-blue-500 hover:text-blue-400 mt-4 inline-block font-bold">Book an appointment</a>
              </div>
            ) : (
              <div className="space-y-6">
                {appointments.map(app => (
                  <div key={app.id} className="border border-slate-800 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-blue-500/40 transition-colors bg-slate-900">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                          app.status === 'Approved' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                          app.status === 'Cancelled' ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' :
                          'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                        }`}>
                          {app.status}
                        </span>
                        <h3 className="font-serif text-lg text-slate-100">{app.serviceName}</h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.1em] text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{app.date} at {app.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Scissors className="w-3 h-3 text-blue-500" />
                          <span>Davis Unisex Salon</span>
                        </div>
                      </div>
                    </div>
                    
                    {(app.status !== 'Cancelled' && app.status !== 'Approved') && (
                      <div className="flex flex-col gap-2 md:w-auto w-full">
                        <button 
                          onClick={() => handleOpenEdit(app)}
                          className="text-slate-300 hover:text-neutral-200 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border border-slate-800 bg-slate-950 p-3 w-full md:w-auto justify-center hover:bg-slate-900 transition-colors group"
                        >
                          <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Edit
                        </button>
                        <button 
                          onClick={() => handleCancel(app.id, app.status)}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border border-blue-500 bg-slate-900 p-3 w-full md:w-auto justify-center hover:bg-blue-500/20 transition-colors group"
                        >
                          <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-950 border border-blue-500/20 max-w-lg w-full">
            <div className="border-b border-blue-500/20 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-slate-100">Edit Appointment</h2>
              <button 
                onClick={() => setEditingAppointment(null)} 
                className="text-slate-400 hover:text-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Time</label>
                  <select 
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    required
                    className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="" disabled>Select Time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setEditingAppointment(null)}
                  className="px-8 py-4 bg-transparent border border-slate-800 text-slate-400 font-bold uppercase tracking-[0.1em] text-[11px] hover:border-neutral-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-blue-700 disabled:opacity-70 transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
