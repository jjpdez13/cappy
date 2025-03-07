import { useEffect, useState } from "react";
import "./PlanktonModal.css";

const PlanktonModal = ({ onClose }) => {
  const [spongebobs, setSpongebobs] = useState([]);

  useEffect(() => {
    const alarm = new Audio("/sounds/alarm.mp3");
    alarm.play();

    const spongebobCount = 30;
    const spongebobArr = Array.from({ length: spongebobCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw",
      top: Math.random() * 100 + "vh",
      animationDelay: Math.random() * 2 + "s",
    }));

    setSpongebobs(spongebobArr);

    return () => {
      alarm.pause();
      alarm.currentTime = 0;
    };
  }, []);

  return (
    <div className="plankton-alert-modal">
      <div className="plankton-alert-content">
        <h2>🚨 RED ALERT! 🚨 INTRUDER ALERT! 🚨 RED ALERT! 🚨</h2>
        <h3>-PLANKTON DETECTED-</h3>
        <p>
          🚨 <strong>ALL EMPLOYEES TO BATTLE STATIONS!</strong>🚨
        </p>
        <button onClick={onClose}>Dismiss Alarm</button>
          </div>
          
          {spongebobs.map((spongebob) => (
        <img
          key={spongebob.id}
          src="/images/spongebob_panic.gif"
          className="flying-spongebob"
          style={{
            left: spongebob.left,
            top: spongebob.top,
            animationDelay: spongebob.animationDelay,
          }}
          alt="Panicking Spongebob"
        />
      ))}
    </div>
  );
};

export default PlanktonModal;
