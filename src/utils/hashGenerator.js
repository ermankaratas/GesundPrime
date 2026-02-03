import bcrypt from 'bcryptjs';

// React Native'de crypto yok, fallback kullan
bcrypt.setRandomFallback((len) => {
  const buf = [];
  for (let i = 0; i < len; i++) {
    buf.push(Math.floor(Math.random() * 256));
  }
  return buf;
});

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

// Şifre sıfırlama token'ı oluştur 6 haneli kod
export const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 100000-999999
};

// Şifre sıfırlama tokeni, gerekirse kullanılır, karışık üretiyor
export const generateResetToken = () => {
  // React Native compatible random token generator
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token + Date.now(); // Uniqueness için timestamp ekle
};

// Şifreyi hash'le
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Şifreyi doğrula
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
