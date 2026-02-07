
// Tarihleri formatlamak için yardımcı fonksiyon
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Başka yardımcı fonksiyonlar buraya eklenebilir...
