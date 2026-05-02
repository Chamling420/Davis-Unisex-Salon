import { useState, ChangeEvent, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';

interface GalleryImage {
  id: string;
  url: string;
  storagePath?: string;
  uploadedAt: number;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setImages(fetchedImages);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const storagePath = `gallery/${filename}`;
      const storageRef = ref(storage, storagePath);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      await addDoc(collection(db, 'gallery'), {
        url,
        storagePath,
        uploadedAt: Date.now()
      });

    } catch (error) {
      console.error(error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    setIsDeleting(image.id);
    try {
      if (image.storagePath) {
        const storageRef = ref(storage, image.storagePath);
        await deleteObject(storageRef).catch(e => console.error("Could not delete from storage", e));
      }
      
      await deleteDoc(doc(db, 'gallery', image.id));
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, `gallery/${image.id}`);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="mt-16 bg-slate-950 border border-blue-500/20 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-slate-100 border-l-4 border-blue-500 pl-4">Gallery Management</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-2 pl-5">Add or remove photos from the homepage gallery</p>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            disabled={isUploading}
            aria-label="Upload new photo"
          />
          <button 
            type="button" 
            disabled={isUploading}
            className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-900 flex items-center gap-2 disabled:opacity-70"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">Uploading...</span>
            ) : (
              <><Upload className="w-4 h-4" /> Upload Photo</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative aspect-square group overflow-hidden border border-blue-500/10 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
            <img src={image.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <button 
                onClick={() => handleDelete(image)}
                disabled={isDeleting === image.id}
                className="bg-slate-900/10 hover:bg-slate-900/20 text-white p-3 backdrop-blur border border-white/20 transition-colors"
                title="Delete Image"
              >
                {isDeleting === image.id ? <span className="text-[10px] uppercase tracking-widest font-bold">Deleting...</span> : <Trash2 className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-800">
            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold">No images in gallery</p>
            <p className="text-[10px] uppercase tracking-widest mt-2 opacity-70">Upload photos to display them here</p>
          </div>
        )}
      </div>
    </div>
  );
}
