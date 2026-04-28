import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
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

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>(defaultServices);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    }
  });

  useEffect(() => {
    if (user?.displayName) setValue('name', user.displayName);
    if (user?.email) setValue('email', user.email);
  }, [user, setValue]);

  // Optionally fetch real services from firestore if admin added them
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        if (!snapshot.empty) {
          const svcs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setServices(svcs);
        }
      } catch (error) {
        // Safe to ignore, fallback to defaultServices
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data: BookingFormInputs) => {
    if (!user) {
      alert("Please login first or continue as guest to book an appointment.");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const selectedService = services.find(s => s.id === data.serviceId);
      
      const appointmentData = {
        userId: user.uid,
        serviceId: data.serviceId,
        serviceName: selectedService?.name || 'Service',
        date: data.date,
        time: data.time,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-blue-50 p-8 rounded-xl shadow border border-neutral-200 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold uppercase text-neutral-900 mb-2">Booking Confirmed</h2>
          <p className="text-neutral-600 mb-8">
            Thank you for choosing Davis Unisex Salon. We have received your appointment request.
          </p>
          <div className="space-y-4">
            <button onClick={() => navigate('/dashboard')} className="w-full bg-neutral-900 text-white py-3 rounded font-bold uppercase transition hover:bg-neutral-800">
              View My Appointments
            </button>
            <button onClick={() => navigate('/')} className="w-full text-neutral-600 hover:text-neutral-900 font-medium">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-4 bg-blue-50 min-h-[80vh] border-b border-gold-500/20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-neutral-900 mb-4">Reservations</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            Secure your session with our master barbers and stylists.
          </p>
        </div>

        <div className="bg-blue-50 p-10 lg:p-14 border border-gold-500/20 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Service</label>
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
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Date</label>
                <input 
                  type="date" 
                  {...register('date')} 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-400"
                />
                {errors.date && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Time</label>
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

              <div className="md:col-span-2 pt-6">
                <h3 className="font-serif text-xl text-neutral-900 mb-2">Guest Details</h3>
                <div className="h-px w-full bg-neutral-200" />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  {...register('name')} 
                  className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-400"
                  placeholder="Alexander Davis"
                />
                {errors.name && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Contact Number</label>
                <input 
                  type="tel" 
                  {...register('phone')} 
                  className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-400"
                  placeholder="+1 234 567 890"
                />
                {errors.phone && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.phone.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase tracking-[0.1em] text-gold-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  {...register('email')} 
                  className="w-full py-3 bg-transparent border-b border-neutral-200 text-neutral-900 text-sm outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-400"
                  placeholder="alexander@example.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] uppercase mt-2 tracking-widest">{errors.email.message}</p>}
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gold-500 text-black py-4 font-bold uppercase tracking-[0.1em] text-[12px] hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
            {!user && (
              <p className="text-center text-[10px] uppercase tracking-[0.1em] text-neutral-500 mt-6 pt-6 border-t border-neutral-100">
                You are booking as a guest. <a href="/login" className="text-gold-500 hover:text-gold-400 underline">Sign in</a> to manage appointments.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
