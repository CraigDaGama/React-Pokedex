function LoadingScreen({ progress }) {
  return (
    <div className="loading-screen">
      <h1>Loading Pokédex...</h1>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
