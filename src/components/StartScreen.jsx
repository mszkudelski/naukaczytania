export function StartScreen({ onStartGame, onShowMasterMode }) {
    return (
        <div className="text-center">
            <h1 className="title">Nauka Czytania!</h1>
            <p className="subtitle">Zaczynamy przygodę z literkami, sylabami i słowami!</p>
            <button 
                className="btn btn-primary" 
                style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}
                onClick={() => onStartGame(1)}
            >
                Start! (Poziom 1)
            </button>
        </div>
    );
}