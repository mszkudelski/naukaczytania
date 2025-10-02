export function EndGameModal({ level, score, isComplete, onRestart }) {
    const message = isComplete 
        ? "Super Mistrz Czytania! Ukończyłeś wszystkie poziomy!"
        : `Koniec Poziomu ${level}! Spróbuj ponownie, by odblokować kolejny!`;

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="title" style={{ color: '#3b82f6', marginBottom: '1rem' }}>
                    {isComplete ? "Gratulacje!" : "Koniec Gry"}
                </div>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: isComplete ? '#10b981' : '#6b7280',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                }}>
                    {isComplete ? '🎉' : '🎯'}
                </div>
                <p className="subtitle" style={{ marginBottom: '1rem' }}>
                    {message}
                </p>
                <div className="subtitle" style={{ color: '#374151', marginBottom: '2rem' }}>
                    Twój wynik: <span className="score-value">{score}</span>
                </div>
                <button 
                    className="btn btn-primary" 
                    style={{ fontSize: '1.25rem' }}
                    onClick={onRestart}
                >
                    Zagraj ponownie
                </button>
            </div>
        </div>
    );
}