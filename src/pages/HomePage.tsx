// src/pages/HomePage.tsx

// import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import type { Activity } from '../types';

// New, more accurate data to match the design image
const initialActivityData: Activity[] = [
    { title: 'Found: Blue Water Bottle', subtitle: 'Posted in Lost & Found', category: 'lost-found' },
    { title: 'For Sale: Barely used Calculator', subtitle: 'Posted in Marketplace', category: 'marketplace'},
    { title: 'Uploaded: Physics SEM-1 Notes', subtitle: 'Posted in Notes Hub', category: 'notes-hub'},
    { title: 'Lost: ID Card near Canteen', subtitle: 'Posted in Lost & Found', category: 'lost-found'},
];

// Helper to get icon details based on the design
function getCategoryDetails(category: Activity['category']) {
    switch (category) {
        case 'lost-found': 
            return { icon: 'https://img.icons8.com/fluency-systems-filled/48/007AFF/water-bottle.png' };
        case 'marketplace': 
            return { icon: 'https://img.icons8.com/ios-filled/50/34C759/calculator.png' };
        case 'notes-hub': 
            return { icon: 'https://img.icons8.com/ios-filled/50/FF9500/documents.png'};
        default: 
            return { icon: 'https://img.icons8.com/ios-filled/50/8A8A8E/help.png' };
    }
}

const HomePage = () => {
    const [user] = useAuthState(auth);

    return (
        <>
            <section className="welcome-header">
                <h2>Hi, {user?.displayName?.split(' ')[0] || 'Student'}!</h2>
                <p>Let's make campus life easier.</p>
            </section>

            <section className="quick-actions">
                <Link to="/lost-and-found" className="action-card">
                    <div className="icon-bg blue">
                        {/* Search Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <span>Lost &<br/>Found</span>
                </Link>
                <Link to="/notes-hub" className="action-card">
                    <div className="icon-bg orange">
                        {/* Note Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <span>Notes<br/>Hub</span>
                </Link>
                <Link to="/borrow-lend" className="action-card">
                    <div className="icon-bg green">
                        {/* Borrow/Lend Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                    </div>
                    <span>Borrow<br/>& Lend</span>
                </Link>
            </section>

            <section className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-feed">
                    {initialActivityData.map((item, index) => {
                        const details = getCategoryDetails(item.category);
                        return (
                            <div key={index} className="activity-card">
                                <div className="icon-container">
                                    <img src={details.icon} alt={`${item.category} icon`} />
                                </div>
                                <div className="activity-card-text">
                                    <h4>{item.title}</h4>
                                    <p>{item.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <Link to="#" className="fab">+</Link>
        </>
    );
};

export default HomePage;