import React, { useEffect } from 'react';
import { generateHashes } from './src/utils/hashGenerator_old';

export default function App() {
  useEffect(() => {
    // Sadece bir kere çalıştır, hash'leri al, sonra kodu kaldır
    generateHashes();
  }, []);

  return null;
}
