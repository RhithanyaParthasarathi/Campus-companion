// src/pages/LostAndFoundPage.tsx

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import {
  collection, query, where, orderBy, onSnapshot,
  doc, updateDoc, serverTimestamp, addDoc
} from 'firebase/firestore';
import type { LostFoundItem } from '../types';
import { useUIStore } from '../stores/uiStore';
import Modal from '../components/Modal';

// --- Sub-component to display a single item card ---
const ItemCard = ({ item, isOwner, onMarkAsFound }: { item: LostFoundItem, isOwner: boolean, onMarkAsFound: () => void }) => (
  <div className="item-card lost-found-card">
    <div className="item-card-left">
      {item.itemImageURL ? (
        <img src={item.itemImageURL} alt={item.itemName} className="item-image-preview" />
      ) : (
        <div className="item-image-placeholder">📷</div>
      )}
    </div>
    <div className="item-card-right">
      <div className="item-header">
        <h4>{item.itemName}</h4>
        <span className={`status-tag status-${item.status}`}>{item.status}</span>
      </div>
      <p className="item-meta"><strong>Lost Around:</strong> {item.lostTime}</p>
      <p className="item-meta"><strong>Last Seen:</strong> {item.lastSeen}</p>
      {item.description && <p className="item-meta"><strong>Description:</strong> {item.description}</p>}
      <p className="item-meta"><strong>Contact:</strong> {item.contactInfo}</p>

      {item.status === 'found' && (
        <>
          <p className="item-meta found-by-meta">Found by: {item.foundBy}</p>
          {item.thankYouMessage && <p className="item-meta thank-you-meta">"{item.thankYouMessage}"</p>}
        </>
      )}

      <div className="card-footer">
        <p className="posted-by-meta">
          Posted by {item.reporterName} on {item.postedAt ? item.postedAt.toLocaleDateString() : 'Just now'}
        </p>
        {isOwner && item.status === 'lost' && (
          <button className="btn btn-success btn-sm" onClick={onMarkAsFound}>
            Mark as Found
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
const LostAndFoundPage = () => {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [loading, setLoading] = useState(true);
  
  const { openModal, hideModal } = useUIStore();
  const isAddModalOpen = openModal === 'lostAndFound';
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<LostFoundItem | null>(null);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemLastSeen, setNewItemLastSeen] = useState('');
  const [newItemLostTime, setNewItemLostTime] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemContact, setNewItemContact] = useState('');
  const [newItemImage, setNewItemImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [finderName, setFinderName] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('');

  // Effect to fetch items from Firestore
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const itemsCollection = collection(db, "lostAndFoundItems");
    let q;

    if (activeTab === 'mine') {
      q = query(itemsCollection, where('reporterId', '==', user.uid), orderBy('postedAt', 'desc'));
    } else {
      q = query(itemsCollection, orderBy('postedAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt?.toDate(),
      } as LostFoundItem));
      setItems(itemsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab, user]);

  // Function to post a new item
  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItemName.trim() || !newItemContact.trim()) {
      return alert("Please fill all required fields (*).");
    }
    setIsUploading(true);

    let imageURL = "";
    if (newItemImage) {
      const formData = new FormData();
      formData.append('file', newItemImage);
      formData.append('upload_preset', 'campus-companion-uploads'); // <-- ACTION: Replace with your preset

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dqcqifwqz/image/upload`, // <-- ACTION: Replace with your cloud name
          { method: 'POST', body: formData }
        );
        const data = await response.json();
        if (!data.secure_url) throw new Error('Image upload failed.');
        imageURL = data.secure_url;
      } catch (error) {
        alert("Image upload failed. Please try again.");
        console.error("Cloudinary upload error:", error);
        setIsUploading(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, "lostAndFoundItems"), {
        itemName: newItemName,
        lastSeen: newItemLastSeen,
        lostTime: newItemLostTime,
        description: newItemDescription,
        contactInfo: newItemContact,
        itemImageURL: imageURL,
        status: "lost",
        postedAt: serverTimestamp(),
        reporterId: user.uid,
        reporterName: user.displayName || "Anonymous Student",
      });

      alert("Item posted successfully!");
      hideModal();
      // Reset form fields
      setNewItemName('');
      setNewItemLastSeen('');
      setNewItemLostTime('');
      setNewItemDescription('');
      setNewItemContact('');
      setNewItemImage(null);
    } catch (error) {
      alert("Failed to post item details.");
      console.error("Firestore post error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const openUpdateModal = (item: LostFoundItem) => {
    setItemToUpdate(item);
    setIsUpdateModalOpen(true);
  };

  // Function to handle updating the status to "found"
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToUpdate || !finderName.trim()) {
      return alert("Please enter who found the item.");
    }

    const itemDocRef = doc(db, "lostAndFoundItems", itemToUpdate.id!);
    await updateDoc(itemDocRef, {
      status: "found",
      foundBy: finderName,
      thankYouMessage: thankYouMessage,
      resolvedAt: serverTimestamp(),
    });

    alert("Status updated successfully!");
    // Reset and close the update modal
    setIsUpdateModalOpen(false);
    setFinderName('');
    setThankYouMessage('');
    setItemToUpdate(null);
  };

  return (
    <>
      <div className="page-header-controls">
        <h2 className="page-title">Lost & Found</h2>
      </div>
      
      <section className="tabs">
        <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? 'active' : ''}>All Items</button>
        <button onClick={() => setActiveTab('mine')} className={activeTab === 'mine' ? 'active' : ''}>My Posts</button>
      </section>

      <div className="item-list-container">
        {loading && <p>Loading items...</p>}
        {!loading && items.length === 0 && <p>No items found in this section.</p>}
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            isOwner={user?.uid === item.reporterId}
            onMarkAsFound={() => openUpdateModal(item)}
          />
        ))}
      </div>

      {/* --- ADD ITEM MODAL --- */}
      <Modal isOpen={isAddModalOpen} onClose={hideModal}>
        <form onSubmit={handlePostItem}>
          <div className="modal-header">
            <h3 className="modal-title">Report a Lost Item</h3>
          </div>
          <div className="modal-form-group">
            <label htmlFor="itemName">Item Name*</label>
            <input id="itemName" type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} required />
          </div>
          <div className="modal-form-group">
            <label htmlFor="lostTime">Time Lost (approx.)*</label>
            <input id="lostTime" type="text" placeholder="e.g., Around 2:30 PM" value={newItemLostTime} onChange={(e) => setNewItemLostTime(e.target.value)} required />
          </div>
          <div className="modal-form-group">
            <label htmlFor="lastSeen">Last Seen Location*</label>
            <input id="lastSeen" type="text" value={newItemLastSeen} onChange={(e) => setNewItemLastSeen(e.target.value)} required />
          </div>
          <div className="modal-form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea id="description" rows={2} value={newItemDescription} onChange={(e) => setNewItemDescription(e.target.value)} />
          </div>
          <div className="modal-form-group">
            <label>Upload an Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewItemImage(e.target.files[0])} />
          </div>
          <div className="modal-form-group">
            <label htmlFor="contactInfo">Your Contact Info*</label>
            <input id="contactInfo" type="text" value={newItemContact} onChange={(e) => setNewItemContact(e.target.value)} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={hideModal}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {isUploading ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- UPDATE STATUS MODAL --- */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <form onSubmit={handleUpdateStatus}>
          <div className="modal-header">
            <h3 className="modal-title">Update Item Status</h3>
          </div>
          <p style={{ marginTop: '1rem' }}>
            That's great you found your "{itemToUpdate?.itemName}"! Let's update the details.
          </p>
          <div className="modal-form-group">
            <label htmlFor="finderName">Who found the item?*</label>
            <input id="finderName" type="text" placeholder="e.g., Priya M. or 'I found it myself'" value={finderName} onChange={(e) => setFinderName(e.target.value)} required />
          </div>
          <div className="modal-form-group">
            <label htmlFor="thankYou">Thank You Message (Optional)</label>
            <textarea id="thankYou" rows={3} placeholder="A quick thanks to the finder!" value={thankYouMessage} onChange={(e) => setThankYouMessage(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Update to "Found"</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default LostAndFoundPage;