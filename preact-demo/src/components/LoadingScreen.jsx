const LoadingScreen = ({ message = "Ładowanie pytania..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-white text-xl">{message}</div>
    </div>
  );
};

export default LoadingScreen;