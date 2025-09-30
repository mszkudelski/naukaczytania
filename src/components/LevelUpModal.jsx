export function LevelUpModal({ nextLevel, previousScore, onStartNextLevel, onRestartGame }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="title" style={{ color: '#3b82f6', marginBottom: '1rem' }}>
                    Poziom Wyżej!
                </div>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                }}>
                    🏆
                </div>
                <p className="subtitle" style={{ marginBottom: '1rem' }}>
                    Świetna robota! Odblokowałeś Poziom {nextLevel}!
                </p>
                <div className="subtitle" style={{ color: '#374151', marginBottom: '2rem' }}>
                    Wynik w poprzednim poziomie: <span className="score-value">{previousScore}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                        className="btn btn-success" 
                        style={{ fontSize: '1.25rem' }}
                        onClick={onStartNextLevel}
                    >
                        Start Poziom {nextLevel}
                    </button>
                    <button 
                        className="btn btn-gray" 
                        style={{ fontSize: '1.25rem' }}
                        onClick={onRestartGame}
                    >
                        Zagraj od początku (Poziom 1)
                    </button>
                </div>
            </div>
        </div>
    );
}