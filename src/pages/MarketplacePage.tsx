// src/pages/MarketplacePage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MarketplaceItem } from '../types';

// Dummy data for now.
const initialItemsData: MarketplaceItem[] = [
    { name: 'Scientific Calculator FX-991', borrowCost: '₹20/day', sellPrice: '₹800', postedBy: 'Rohan S.' },
    { name: 'EG Drafter', borrowCost: '₹40/day', sellPrice: null, postedBy: 'Priya M.' },
    { name: 'Arduino Uno Kit', borrowCost: '₹150/week', sellPrice: '₹1,200', postedBy: 'Meera K.' }
];

const MarketplacePage = () => {
    const [items] = useState<MarketplaceItem[]>(initialItemsData);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <header className="app-header">
                <Link to="/" className="back-arrow">←</Link>
                <h1>Borrow & Lend</h1>
                <div style={{ width: 24 }}></div>
            </header>
            <main className="app-main">
                <section className="search-container">
                    <input type="text" placeholder="Search for calculators, textbooks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                </section>
                <section className="item-grid">
                    {filteredItems.length > 0 ? filteredItems.map((item, index) => (
                        <a key={index} href="#" className="item-card-borrow">
                            <div className="item-image"><span>Image Placeholder</span></div>
                            <div className="item-info-borrow">
                                <h4 className="item-title">{item.name}</h4>
                                <p className="posted-by">by {item.postedBy}</p>
                                <div className="pricing-info">
                                    <div className="price-box">
                                        <span className="label">Borrow</span>
                                        <span className="amount">{item.borrowCost}</span>
                                    </div>
                                    {item.sellPrice && (
                                        <div className="price-box">
                                            <span className="label">Buy</span>
                                            <span className="amount">{item.sellPrice}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </a>
                    )) : <p>No items found. Try a different search.</p>}
                </section>
            </main>
        </>
    );
}

export default MarketplacePage;