
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, StyleSheet } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import Header from '../../components/Header';
import API_URL from '../../config/api';

const AdminOfficesScreen = ({ onNavigate }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOffice, setNewOffice] = useState({ name: '', location: '', capacity: '' });

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/offices`);
      if (!response.ok) throw new Error('Ofisler alınamadı.');
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error('Ofisleri getirme hatası:', error);
      Alert.alert('Hata', 'Ofisleri alırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handleAddOffice = async () => {
    if (!newOffice.name || !newOffice.location || !newOffice.capacity) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin/offices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newOffice, capacity: parseInt(newOffice.capacity) || 0 }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ofis eklenemedi.');
      }
      Alert.alert('Başarılı', 'Ofis başarıyla eklendi.');
      setShowAddForm(false);
      setNewOffice({ name: '', location: '', capacity: '' });
      fetchOffices();
    } catch (error) {
      console.error('Ofis ekleme hatası:', error);
      Alert.alert('Hata', error.message);
    }
  };

  const handleDeleteOffice = (officeId) => {
    Alert.alert('Ofisi Sil', 'Bu ofisi kalıcı olarak silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/api/admin/offices/${officeId}`, { method: 'DELETE' });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Ofis silinemedi.');
            }
            Alert.alert('Başarılı', 'Ofis başarıyla silindi.');
            fetchOffices();
          } catch (error) {
            console.error('Ofis silme hatası:', error);
            Alert.alert('Hata', error.message);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Header title="Ofis Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={globalStyles.text.subtitle}>Toplam {offices.length} Ofis</Text>
          <TouchableOpacity style={[globalStyles.button.primary, styles.headerButton]} onPress={() => setShowAddForm(!showAddForm)}>
            <Text style={globalStyles.text.button}>{showAddForm ? 'Kapat' : '+ Ekle'}</Text>
          </TouchableOpacity>
        </View>

        {showAddForm && (
          <View style={styles.addForm}>
            <TextInput style={globalStyles.input} placeholder="Ofis Adı (örn: Oda 101)" value={newOffice.name} onChangeText={(text) => setNewOffice({ ...newOffice, name: text })} />
            <TextInput style={globalStyles.input} placeholder="Konum (örn: A Blok, 1. Kat)" value={newOffice.location} onChangeText={(text) => setNewOffice({ ...newOffice, location: text })} />
            <TextInput style={globalStyles.input} placeholder="Kapasite (kişi sayısı)" value={newOffice.capacity} onChangeText={(text) => setNewOffice({ ...newOffice, capacity: text })} keyboardType="numeric" />
            <TouchableOpacity style={[globalStyles.button.primary, {backgroundColor: globalStyles.colors.success}]} onPress={handleAddOffice}>
              <Text style={globalStyles.text.button}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={globalStyles.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {offices.map((office) => (
              <View key={office.id} style={[globalStyles.card, styles.card]}>
                <View style={styles.cardInfo}>
                  <Text style={globalStyles.text.subtitle}>{office.name}</Text>
                  <Text style={globalStyles.text.body}>{office.location}</Text>
                  <Text style={globalStyles.text.caption}>Kapasite: {office.capacity} kişi</Text>
                </View>
                <TouchableOpacity style={[globalStyles.button.danger, styles.deleteButton]} onPress={() => handleDeleteOffice(office.id)}>
                  <Text style={[globalStyles.text.button, styles.deleteButtonText]}>Sil</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: globalStyles.colors.gray[200],
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addForm: { 
    padding: 16, 
    backgroundColor: globalStyles.colors.gray[100],
    margin: 16, 
    borderRadius: 8,
    gap: 12, // Inputs between space
  },
  listContainer: {
    padding: 16,
  },
  card: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 0, // globalStyles.card has margin, reset for list
    marginTop: 12, // list container has padding, so use margin for items
  },
  cardInfo: { flex: 1 },
  deleteButton: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
  },
  deleteButtonText: {
    fontSize: 14,
  },
});

export default AdminOfficesScreen;
