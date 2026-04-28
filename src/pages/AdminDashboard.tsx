import ServiceManager from '../components/ServiceManager';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, serverTimestamp, addDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Navigate } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock, Search, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

type BookingFormInputs = z.infer<typeof bookingSchema>;

const defaultServices = [
  { id: '1', name: 'Haircut (Men & Women)', duration: 45 },
  { id: '2', name: 'Beard Trim & Styling', duration: 30 },
  { id: '3', name: 'Hair Wash & Treatment', duration: 30 },
  { id: '4', name: 'Hair Coloring', duration: 120 },
  { id: '5', name: 'Facial & Skin Care', duration: 45 },
  { id: '6', name: 'Kids Haircut', duration: 30 },
  { id: '7', name: 'Bridal & Party Makeup', duration: 90 },
];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<any[]>(defaultServices);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    setLoading(true);
    const q = query(collection(db, 'appointments'));
    const unsubscribeAppointments = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      apps.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : Date.now());
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : Date.now());
        return timeB - timeA;
      });
      setAppointments(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
      setLoading(false);
    });

    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        if (!snapshot.empty) {
          const svcs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setServices(svcs);
        }
      } catch (error) {
        // Safe to ignore
      }
    };
    fetchServices();

    return () => {
      unsubscribeAppointments();
    };
  }, [user]);

  const handleUpdateStatus = async (id: string, status: string, currentStatus: string) => {
    if (status === currentStatus) return;
    
    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
      alert(`Failed to update appointment: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleCreateAppointment = async (data: BookingFormInputs) => {
    setIsCreating(true);
    try {
      const selectedService = services.find(s => s.id === data.serviceId);
      
      const appointmentData = {
        userId: 'admin-created',
        serviceId: data.serviceId,
        serviceName: selectedService?.name || 'Service',
        date: data.date,
        time: data.time,
        name: data.name,
        email: data.email || 'N/A',
        phone: data.phone,
        status: 'Approved', // Admin created ones are implicitly approved
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
      alert(`Failed to create appointment: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  const filteredApps = appointments.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="py-24 px-4 bg-blue-50 min-h-[80vh] border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">Admin Portal</h1>
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-12">Manage appointments and salon schedules.</p>
          
          <div className="flex flex-wrap gap-4 justify-center filter-buttons items-center">
            {['all', 'Pending', 'Approved', 'Cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border ${
                  filter === f ? 'bg-gold-500 text-black border-gold-500' : 'bg-transparent text-neutral-500 border-neutral-200 hover:border-gold-500 hover:text-gold-500'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-8 bg-neutral-200 mx-2 hidden md:block"></div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-2"
            >
              <Plus className="w-3 h-3" /> New Appointment
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-gold-500/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gold-500/20 text-gold-500 uppercase text-[10px] tracking-[0.2em] bg-blue-100">
                  <th className="p-8 font-normal">Guest</th>
                  <th className="p-8 font-normal">Service</th>
                  <th className="p-8 font-normal">Schedule</th>
                  <th className="p-8 font-normal">Contact</th>
                  <th className="p-8 font-normal">Status</th>
                  <th className="p-8 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-neutral-500 text-[11px] uppercase tracking-[0.2em]">No appointments found.</td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-blue-100 transition-colors">
                      <td className="p-8">
                        <p className="font-serif text-lg text-neutral-900">{app.name}</p>
                      </td>
                      <td className="p-8">
                        <p className="font-serif text-neutral-700">{app.serviceName}</p>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gold-500" />
                            <span>{app.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gold-500" />
                            <span>{app.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.1em] text-neutral-500">
                          <p>{app.phone}</p>
                          <p className="text-neutral-400 overflow-hidden text-ellipsis">{app.email}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                          app.status === 'Approved' ? 'border-green-500/50 text-green-600 bg-green-50' :
                          app.status === 'Cancelled' ? 'border-red-500/50 text-red-600 bg-red-50' :
                          'border-yellow-500/50 text-yellow-600 bg-yellow-50'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-4">
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Approved', app.status)}
                              className="text-green-600 hover:text-green-700 font-bold uppercase tracking-widest text-[9px] border border-green-200 px-3 py-2 hover:bg-green-50 transition-colors bg-blue-50"
                              title="Approve"
                            >
                              Approve
                            </button>
                          )}
                          {app.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'Cancelled', app.status)}
                              className="text-red-600 hover:text-red-700 font-bold uppercase tracking-widest text-[9px] border border-red-200 px-3 py-2 hover:bg-red-50 transition-colors bg-blue-50"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <ServiceManager services={services} setServices={setServices} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-blue-50 border border-gold-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-blue-50 border-b border-gold-500/20 px-8 py-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-serif text-neutral-900">New Appointment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-900 transition-colors px-2 py-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleCreateAppointment)} className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Service</label>
                  <select 
                    {...register('serviceId')} 
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors appearance-none"
                  >
                    <option value="" className="bg-blue-50">-- Select Service --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id} className="bg-blue-50">{s.name}</option>
                    ))}
                  </select>
                  {errors.serviceId && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.serviceId.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Guest Name</label>
                  <input 
                    type="text" 
                    {...register('name')} 
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    {...register('phone')} 
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300"
                    placeholder="(555) 000-0000"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.phone.message}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Email (Optional)</label>
                  <input 
                    type="email" 
                    {...register('email')} 
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-300"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Date</label>
                  <input 
                    type="date" 
                    {...register('date')} 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors"
                  />
                  {errors.date && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">Time</label>
                  <select 
                    {...register('time')} 
                    className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors appearance-none"
                  >
                    <option value="" className="bg-blue-50">-- Select Time --</option>
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                      <option key={t} value={t} className="bg-blue-50">{t}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.time.message}</p>}
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-transparent border border-neutral-300 text-neutral-600 font-bold uppercase tracking-[0.1em] text-[11px] hover:border-neutral-400 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-8 py-4 bg-neutral-900 text-white font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-neutral-800 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all"
                >
                  {isCreating ? 'Creating...' : 'Create Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

