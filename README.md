
# GesundPrime - Ofis Rezervasyon Sistemi

GesundPrime, kullanıcıların farklı lokasyonlardaki ofislerden kolayca rezervasyon yapmasını sağlayan modern ve kullanıcı dostu bir mobil uygulamadır.

## 🚀 Temel Özellikler

*   **Kullanıcı Yönetimi:** Güvenli giriş, profil yönetimi ve parola sıfırlama.
*   **Ofis Listeleme:** Lokasyona göre ofisleri görüntüleme ve arama.
*   **Takvim Entegrasyonu:** Ofislerin uygunluk durumunu takvim üzerinde görselleştirme.
*   **Rezervasyon Sistemi:** Kolayca rezervasyon yapma, görüntüleme ve iptal etme.
*   **Admin Paneli:** Yöneticiler için kullanıcı, rezervasyon ve ofis yönetimi.

## ✨ Kapsamlı Refactoring ve İyileştirmeler

Bu proje, kod kalitesini, sürdürülebilirliği ve performansı artırmak amacıyla kapsamlı bir refactoring sürecinden geçmiştir. Yapılan ana iyileştirmeler şunlardır:

1.  **Merkezi Konfigürasyon:**
    *   Tüm API endpoint'leri `src/config/api.js` altında merkezileştirildi. Bu sayede, sunucu adresindeki değişiklikler tek bir yerden yönetilebilir hale geldi.

2.  **Kod Tekrarının Önlenmesi (DRY Prensibi):**
    *   `formatDate` gibi sık kullanılan yardımcı fonksiyonlar, `src/utils/helpers.js` dosyasına taşınarak kod tekrarı önlendi.

3.  **Global Stil Yönetimi:**
    *   `globalStyles.js` dosyası zenginleştirilerek renk paleti, tipografi, buton ve kart stilleri gibi temel tasarım elementleri standartlaştırıldı.
    *   Tüm ekranlardaki *inline* stiller temizlenerek yerlerine global stiller kullanıldı.
    *   Gereksiz stil dosyaları (`adminStyles.js`, `calendarStyles.js` vb.) projeden kaldırıldı.

4.  **Yeniden Kullanılabilir Bileşenler:**
    *   Admin paneli ekranları için standart bir `Card` bileşeni (`src/components/Card.js`) oluşturuldu.
    *   `AdminUsersScreen` ve `AdminReservationsScreen` ekranları, bu yeni `Card` bileşenini kullanacak şekilde yeniden yapılandırıldı.

5.  **"Ölü Kod" Temizliği:**
    *   Proje genelinde yapılan analizler sonucunda `AdminUserScreen.js`, `RegisterScreen.js` ve `BottomNavigation.js` gibi kullanılmayan, atıl dosyalar projeden tamamen temizlendi.

## 🛠️ Kullanılan Teknolojiler

*   **React Native:** Cross-platform mobil uygulama geliştirme.
*   **Expo:** Geliştirme sürecini basitleştiren araç ve servisler.
*   **Express.js & JSON-Server:** Arka uç işlemleri ve veritabanı simülasyonu için.

## 🏁 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

**1. Depoyu Klonlayın:**
```bash
git clone <depo_url>
cd GesundPrime
```

**2. Bağımlılıkları Yükleyin:**
*   Ana proje ve sunucu için gerekli tüm paketleri yükleyin.
```bash
npm install
cd server && npm install && cd ..
```

**3. Sunucuyu Başlatın:**
*   Proje verilerinin ve API'lerin çalışması için arka uç sunucusunu başlatın.
```bash
npm run server
```

**4. Mobil Uygulamayı Başlatın:**
*   Yeni bir terminal sekmesinde Expo geliştirme sunucusunu başlatın.
```bash
npm start
```
*   Açılan QR kodu Expo Go uygulamasıyla (Android) veya Kamera uygulamasıyla (iOS) tarayarak uygulamayı cihazınızda açabilirsiniz.

---

Bu README, projenin mevcut durumunu ve yapılan çalışmaları net bir şekilde özetlemektedir.
