// src/pages/NotesHubPage.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Note } from '../types';

// Dummy data for now.
const initialNotesData: Note[] = [
    { courseCode: '23Z202', courseName: 'Sensors and Applications', semester: 2, topic: 'Chapter 2 Notes', uploader: 'Priya M.', category: 'Notes', format: 'Online', price: 'Free' },
    { courseCode: '23Z203', courseName: 'Digital Design', semester: 2, topic: 'Chapters 1,2,3 (Combined)', uploader: 'Rohan S.', category: 'Notes', format: 'In-Person', price: '₹200' },
    { courseCode: '23Z401', courseName: 'Probability & Statistics', semester: 4, topic: 'Midterm 2022 Paper', uploader: 'Admin', category: 'PYQ', format: 'PYQ', price: 'Free' },
];

type NoteFilter = 'all' | 'Online' | 'In-Person' | 'PYQ';

const NotesHubPage = () => {
    const [notes] = useState<Note[]>(initialNotesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<NoteFilter>('all');

    const filteredNotes = notes
        .filter(note => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'PYQ') return note.category === 'PYQ';
            return note.format === activeFilter;
        })
        .filter(note =>
            note.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <>
            <header className="app-header">
                <Link to="/" className="back-arrow">←</Link>
                <h1>Notes Hub</h1>
                <div style={{ width: 24 }}></div>
            </header>
            <main className="app-main">
                <section className="search-container">
                    <input type="text" placeholder="Search by course name or code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </section>
                <section className="tabs">
                    {(['all', 'Online', 'In-Person', 'PYQ'] as NoteFilter[]).map(filter => (
                        <button key={filter} onClick={() => setActiveFilter(filter)} className={activeFilter === filter ? 'active' : ''}>
                            {filter === 'In-Person' ? 'Offline' : filter}
                        </button>
                    ))}
                </section>
                <section id="notes-list">
                    {filteredNotes.length > 0 ? filteredNotes.map((item, index) => {
                         const tagClass = `format-${item.format.toLowerCase().replace('-', '')}`;
                         return (
                            <div key={index} className="note-card-v2">
                                <div className="note-header">
                                    <div className="note-header-info">
                                        <h4>{item.courseName}</h4>
                                        <p>Sem {item.semester} • {item.courseCode}</p>
                                    </div>
                                    <span className={`format-tag ${tagClass}`}>{item.format}</span>
                                </div>
                                <div className="note-body">{item.topic}</div>
                                <div className="note-footer">
                                    <span className="note-uploader">Posted by {item.uploader}</span>
                                    <span className="note-price">{item.price}</span>
                                </div>
                            </div>
                         )
                    }) : <p>No notes found for this criteria.</p>}
                </section>
            </main>
        </>
    );
};

export default NotesHubPage;