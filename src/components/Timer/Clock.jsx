import React, { useState, useEffect } from "react";
import "../styles/water.css"; // Importa los estilos

const WaterTimer = () => {
  const [seconds, setSeconds] = useState(0); // Tiempo transcurrido en segundos
  const [isRunning, setIsRunning] = useState(false); // Estado del cronómetro

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const totalTime = 60; // Tiempo total en segundos (1 minuto)
  const percentage = (seconds / totalTime) * 100;  // Porcentaje de tiempo transcurrido

  return (
    <div className="water-timer">
      <h2>Cronómetro con Agua</h2>
      <div className="circle-container">
        <div
          className="water-level"
          style={{
            height: `${100 - percentage}%`, // Agua comienza llena y va bajando
          }}
        >
          <div className="water-surface"></div> {/* Superficie del agua con ondas */}
        </div>
        <div className="circle">
          <span className="timer-text">{totalTime - seconds}s</span>
        </div>
      </div>
      <div>
        <button onClick={startTimer} disabled={isRunning}>Iniciar</button>
        <button onClick={stopTimer} disabled={!isRunning}>Detener</button>
        <button onClick={resetTimer}>Reiniciar</button>
      </div>
    </div>
  );
};

export default WaterTimer;
