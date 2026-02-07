
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/Header';
import Card from '../../components/Card'; // Card bileşenini import et
import API_URL from '../../config/api';

const AdminUsersScreen = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) throw new Error('Kullanıcılar alınamadı.');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Kullanıcıları getirme hatası:', error);
      Alert.alert('Hata', 'Kullanıcıları alırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      'Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/api/admin/users/${userId}`, { method: 'DELETE' });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Kullanıcı silinemedi.');
              }
              Alert.alert('Başarılı', 'Kullanıcı başarıyla silindi.');
              fetchUsers();
            } catch (error) {
              console.error('Kullanıcı silme hatası:', error);
              Alert.alert('Hata', error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header title="Kullanıcı Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={globalStyles.text.subtitle}>Toplam {users.length} Kullanıcı</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={globalStyles.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {users.map((user) => (
              <Card key={user.id} style={styles.card}> 
                <View style={styles.cardInfo}>
                  <Text style={globalStyles.text.subtitle}>{user.name}</Text>
                  <Text style={globalStyles.text.body}>{user.email}</Text>
                  <Text style={globalStyles.text.caption}>Rol: {user.isAdmin ? 'Admin' : 'Kullanıcı'}</Text>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button.danger, styles.deleteButton]} 
                    onPress={() => handleDeleteUser(user.id)}
                >
                  <Text style={[globalStyles.text.button, styles.deleteButtonText]}>Sil</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// StyleSheet'i global stilleri tamamlayacak ve özelleştirecek şekilde düzenleyelim
const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.gray[200],
  },
  listContainer: {
    padding: 16,
  },
  card: { // Card bileşeni için ek stiller
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,      // globalStyles.card'daki margin'i sıfırla
    marginTop: 12,        // Liste içinde kartlar arasına boşluk koy
  },
  cardInfo: {
    flex: 1, // Bilgi alanı mümkün olduğunca genişlesin
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 14,
  },
});

export default AdminUsersScreen;
