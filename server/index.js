
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// --- VERİTABANI YARDIMCI FONKSİYONLARI ---
const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    if (!data.trim()) {
      return { users: [], offices: [], reservations: [] }; // Tüm koleksiyonları içer
    }
    const db = JSON.parse(data);
    // Eksik koleksiyonlar varsa ekle
    return {
      users: db.users || [],
      offices: db.offices || [],
      reservations: db.reservations || [],
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { users: [], offices: [], reservations: [] };
    }
    console.error("db.json okuma hatası:", error);
    throw error;
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// --- YETKİLENDİRME (AUTHORIZATION) MIDDLEWARE ---
// Bu middleware, admin yetkisi gerektiren rotaları korur.
// NOT: Gerçek bir uygulamada bu, JWT gibi bir token mekanizmasıyla yapılmalıdır.
// Burada basitleştirilmiş bir "userId" ve rol kontrolü yapıyoruz.
const adminOnly = (req, res, next) => {
  const { userId } = req.body; // Veya req.headers['x-user-id']
  if (!userId) {
    return res.status(401).json({ message: 'Yetkilendirme için kullanıcı kimliği gereklidir.' });
  }
  const { users } = readDb();
  const user = users.find(u => u.id === parseInt(userId));

  if (user && user.role === 'admin') {
    next(); // Kullanıcı admin ise, isteğin devam etmesine izin ver.
  } else {
    res.status(403).json({ message: 'Yasak. Bu işlem için admin yetkisi gereklidir.' });
  }
};


// --- KİMLİK DOĞRULAMA (AUTH) ROTALARI ---
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'İsim, e-posta ve şifre alanları zorunludur.' });
  }
  const db = readDb();
  if (db.users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password: hashedPassword,
    role: 'user', // Yeni kullanıcılar varsayılan olarak 'user' rolündedir
  };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'E-posta ve şifre alanları zorunludur.' });
    }
    const { users } = readDb();
    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
    }
    res.status(200).json({ 
        message: "Giriş başarılı!",
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
});

app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(200).json({ message: "Eğer email kayıtlıysa, şifre sıfırlama kodu gönderilecektir." });
  }
  const resetCode = crypto.randomInt(100000, 999999).toString();
  const resetCodeExpiry = Date.now() + 15 * 60 * 1000;
  db.users[userIndex].resetCode = resetCode;
  db.users[userIndex].resetCodeExpiry = resetCodeExpiry;
  writeDb(db);
  console.log(`Şifre sıfırlama kodu (${email} için): ${resetCode}`);
  res.status(200).json({ message: "Şifre sıfırlama kodu başarıyla oluşturuldu." });
});

app.post('/api/reset-password', (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email === email && u.resetCode === resetCode && Date.now() < u.resetCodeExpiry);
  if (userIndex === -1) {
    return res.status(400).json({ message: "Geçersiz veya süresi dolmuş sıfırlama kodu." });
  }
  db.users[userIndex].password = bcrypt.hashSync(newPassword, 10);
  db.users[userIndex].resetCode = undefined;
  db.users[userIndex].resetCodeExpiry = undefined;
  writeDb(db);
  res.status(200).json({ message: "Şifreniz başarıyla güncellendi." });
});


// --- ADMİN YÖNETİM ROTALARI (CRUD) ---

// KULLANCI YÖNETİMİ
app.get('/api/admin/users', (req, res) => { // adminOnly middleware'i şimdilik devredışı
  const { users } = readDb();
  // Şifreleri gönderme, güvenlik!
  const safeUsers = users.map(({ password, ...user }) => user);
  res.status(200).json(safeUsers);
});

app.delete('/api/admin/users/:id', (req, res) => { // adminOnly middleware'i şimdilik devredışı
  const db = readDb();
  const userId = parseInt(req.params.id);
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== userId);
  if (db.users.length < initialLength) {
    writeDb(db);
    res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
  } else {
    res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  }
});

// REZERVASYON YÖNETİMİ
app.get('/api/admin/reservations', (req, res) => { // adminOnly middleware'i şimdilik devredışı
  const { reservations } = readDb();
  res.status(200).json(reservations);
});

app.delete('/api/admin/reservations/:id', (req, res) => { // adminOnly middleware'i şimdilik devredışı
  const db = readDb();
  const resId = parseInt(req.params.id);
  const initialLength = db.reservations.length;
  db.reservations = db.reservations.filter(r => r.id !== resId);
  if (db.reservations.length < initialLength) {
    writeDb(db);
    res.status(200).json({ message: 'Rezervasyon başarıyla silindi.' });
  } else {
    res.status(404).json({ message: 'Rezervasyon bulunamadı.' });
  }
});

// OFİS YÖNETİMİ
app.get('/api/offices', (req, res) => {
  const { offices } = readDb();
  res.status(200).json(offices);
});

app.post('/api/admin/offices', (req, res) => { // adminOnly middleware'i şimdilik devredışı
    const { name, location, capacity, amenities } = req.body;
    if (!name || !location || !capacity) {
        return res.status(400).json({ message: "İsim, konum ve kapasite zorunludur." });
    }
    const db = readDb();
    const newOffice = {
        id: db.offices.length > 0 ? Math.max(...db.offices.map(o => o.id)) + 1 : 1,
        name,
        location,
        capacity,
        amenities: amenities || []
    };
    db.offices.push(newOffice);
    writeDb(db);
    res.status(201).json(newOffice);
});

app.delete('/api/admin/offices/:id', (req, res) => { // adminOnly middleware'i şimdilik devredışı
    const db = readDb();
    const officeId = parseInt(req.params.id);
    const initialLength = db.offices.length;
    db.offices = db.offices.filter(o => o.id !== officeId);
    if (db.offices.length < initialLength) {
        writeDb(db);
        res.status(200).json({ message: "Ofis başarıyla silindi." });
    } else {
        res.status(404).json({ message: "Ofis bulunamadı." });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`);
});
