export function MasterModeModal({ onStartLevel, onClose }) {
    const levels = [
        { level: 1, label: '1 (Litery)', className: 'btn-info' },
        { level: 2, label: '2 (Litery, słuch)', className: 'btn-success' },
        { level: 3, label: '3 (Litery PL, słuch)', style: { backgroundColor: '#ef4444', color: 'white' } },
        { level: 4, label: '4 (Sylaby 2-lit.)', style: { backgroundColor: '#f59e0b', color: 'white' } },
        { level: 5, label: '5 (Sylaby 2-lit., słuch)', style: { backgroundColor: '#ec4899', color: 'white' } },
        { level: 6, label: '6 (Sylaby 3-lit.)', style: { backgroundColor: '#6366f1', color: 'white' } },
        { level: 7, label: '7 (Sylaby 3-lit., słuch)', style: { backgroundColor: '#14b8a6', color: 'white' } },
        { level: 8, label: '8 (Sylaby 2-lit. PL, słuch)', style: { backgroundColor: '#f97316', color: 'white' } },
        { level: 9, label: '9 (Sylaby 3-lit. PL, słuch)', style: { backgroundColor: '#84cc16', color: 'white' } },
        { level: 10, label: '10 (Słowa 2-syl. bez PL, słuch)', style: { backgroundColor: '#06b6d4', color: 'white' } },
        { level: 11, label: '11 (Słowa 2-syl. PL, słuch)', style: { backgroundColor: '#8b5cf6', color: 'white' } },
        { level: 12, label: '12 (Słowa 3-syl. PL, słuch)', style: { backgroundColor: '#10b981', color: 'white' } }
    ];

    return (
        <div className="modal" style={{ zIndex: 1050 }}>
            <div className="modal-content" style={{ maxWidth: '32rem' }}>
                <div className="title" style={{ color: '#8b5cf6', marginBottom: '1.5rem' }}>
                    Tryb Mistrza
                </div>
                <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
                    Wybierz poziom, od którego chcesz zacząć:
                </p>
                <div className="master-mode-grid">
                    {levels.map(({ level, label, className, style }) => (
                        <button
                            key={level}
                            className={`btn ${className || ''}`}
                            style={style}
                            onClick={() => onStartLevel(level)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button 
                    className="btn btn-gray" 
                    style={{ marginTop: '1.5rem' }}
                    onClick={onClose}
                >
                    Zamknij
                </button>
            </div>
        </div>
    );
}