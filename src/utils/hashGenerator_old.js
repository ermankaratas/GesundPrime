import bcrypt from 'bcryptjs';

// Hash oluşturucu - sadece bir kere çalıştır, hash'leri al ve SQL'de kullan
export const generateHashes = async () => {
  const passwords = ['admin123', 'doctor123'];
  
  for (const password of passwords) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`Password: ${password} -> Hash: ${hash}`);
  }
};

// Bu fonksiyonu bir kere çalıştırıp console'dan hash'leri al
// generateHashes();
