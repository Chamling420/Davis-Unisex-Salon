import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be positive'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
});

type ServiceFormInputs = z.infer<typeof serviceSchema>;

interface ServiceManagerProps {
  services: any[];
  setServices: (services: any[]) => void;
}

export default function ServiceManager({ services, setServices }: ServiceManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormInputs>({
    resolver: zodResolver(serviceSchema),
  });

  const handleOpenCreate = () => {
    reset({ name: '', price: 0, duration: 30, description: '', category: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    reset({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description || '',
      category: service.category || '',
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
      alert(`Failed to delete service: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  };

  const handleSave = async (data: ServiceFormInputs) => {
    setIsSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), {
          ...data,
          updatedAt: new Date().toISOString(),
        });
        setServices(services.map(s => s.id === editingId ? { ...s, ...data } : s));
      } else {
        const docRef = await addDoc(collection(db, 'services'), {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setServices([...services, { id: docRef.id, ...data }]);
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'services');
      alert(`Failed to save service: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-24 mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-slate-100 mb-2">Services</h2>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">Manage available services.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-6 py-3 self-start text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border border-slate-700 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-3 h-3" /> New Service
        </button>
      </div>

      <div className="bg-slate-950 border border-blue-500/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-blue-500/20 text-blue-500 uppercase text-[10px] tracking-[0.2em] bg-slate-900">
                <th className="p-8 font-normal">Service Name</th>
                <th className="p-8 font-normal">Category</th>
                <th className="p-8 font-normal">Duration</th>
                <th className="p-8 font-normal">Price</th>
                <th className="p-8 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400 text-[11px] uppercase tracking-[0.2em]">No services found.</td>
                </tr>
              ) : (
                services.map(service => (
                  <tr key={service.id} className="hover:bg-slate-900 transition-colors">
                    <td className="p-8">
                      <p className="font-serif text-lg text-slate-100">{service.name}</p>
                      {service.description && (
                        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400 mt-2 line-clamp-2 shrink w-64">{service.description}</p>
                      )}
                    </td>
                    <td className="p-8 text-[11px] uppercase tracking-widest text-slate-400">
                      {service.category || 'Uncategorized'}
                    </td>
                    <td className="p-8 text-[11px] uppercase tracking-widest text-slate-400">
                      {service.duration} mins
                    </td>
                    <td className="p-8 text-[11px] font-bold text-slate-100">
                      ${service.price}
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="text-slate-300 hover:text-neutral-200 bg-slate-950 p-2 border border-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-blue-400 hover:text-blue-700 bg-slate-950 p-2 border border-blue-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-950 border border-blue-500/20 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950 border-b border-blue-500/20 px-8 py-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-serif text-slate-100">{editingId ? 'Edit Service' : 'New Service'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-100 transition-colors px-2 py-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleSave)} className="p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Service Name</label>
                  <input 
                    type="text" 
                    {...register('name')} 
                    className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300"
                    placeholder="Classic Haircut"
                  />
                  {errors.name && <p className="text-blue-500 text-[10px] uppercase mt-2 tracking-widest">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Category</label>
                  <input 
                    type="text" 
                    {...register('category')} 
                    className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300"
                    placeholder="Haircare"
                  />
                  {errors.category && <p className="text-blue-500 text-[10px] uppercase mt-2 tracking-widest">{errors.category.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      {...register('price', { valueAsNumber: true })} 
                      className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300"
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-blue-500 text-[10px] uppercase mt-2 tracking-widest">{errors.price.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Duration (mins)</label>
                    <input 
                      type="number" 
                      {...register('duration', { valueAsNumber: true })} 
                      className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300"
                      placeholder="30"
                    />
                    {errors.duration && <p className="text-blue-500 text-[10px] uppercase mt-2 tracking-widest">{errors.duration.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Description</label>
                  <textarea 
                    {...register('description')} 
                    rows={3}
                    className="w-full py-3 bg-transparent border-b border-slate-800 text-slate-100 text-sm outline-none focus:border-blue-500 transition-colors placeholder:text-slate-300 resize-none"
                    placeholder="Optional description of the service..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 bg-transparent border border-slate-800 text-slate-400 font-bold uppercase tracking-[0.1em] text-[11px] hover:border-neutral-400 focus:outline-none transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-4 bg-blue-600 text-white font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-blue-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
