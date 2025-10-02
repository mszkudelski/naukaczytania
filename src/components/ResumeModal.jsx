export function ResumeModal({ savedGame, onResume, onNewGame }) {
    if (!savedGame) return null;

    return (
        <div className="modal" style={{ zIndex: 1060 }}>
            <div className="modal-content">
                <div className="title" style={{ color: '#374151', marginBottom: '1rem' }}>
                    Witaj z powrotem!
                </div>
                <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
                    Znaleziono zapisaną grę. Chcesz kontynuować?
                </p>
                <div className="subtitle" style={{ marginBottom: '1rem' }}>
                    Poziom: <span className="score-value">{savedGame.level}</span>, 
                    Punkty: <span className="score-value">{savedGame.score}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                        className="btn btn-success" 
                        style={{ fontSize: '1.25rem' }}
                        onClick={onResume}
                    >
                        Tak, kontynuuj
                    </button>
                    <button 
                        className="btn" 
                        style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '1.25rem' }}
                        onClick={onNewGame}
                    >
                        Nie, zacznij od nowa
                    </button>
                </div>
            </div>
        </div>
    );
}