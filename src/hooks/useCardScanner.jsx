import { useEffect, useState, useRef } from 'react';

const useCardScanner = (onScanComplete, timeout = 100) => {
  const [scanning, setScanning] = useState(false);
  const buffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;
      lastKeyTime.current = currentTime;

      // Se demorou muito, resetar buffer
      if (timeDiff > timeout) {
        buffer.current = '';
      }

      // Tecla Enter ou Tab finaliza leitura
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (buffer.current.length > 0) {
          onScanComplete(buffer.current);
          buffer.current = '';
          setScanning(false);
        }
      } else {
        buffer.current += e.key;
        setScanning(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScanComplete, timeout]);

  return scanning;
};

export default useCardScanner;
