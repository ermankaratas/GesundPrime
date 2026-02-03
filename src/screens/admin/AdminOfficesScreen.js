import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { supabase } from '../../services/supabase';
import { globalStyles } from '../../styles/globalStyles';
import { adminStyles } from '../../styles/adminStyles';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNavigation';

const AdminOfficesScreen = ({ onNavigate, currentScreen }) => {
  const [offices, setOffices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: '',
    location_id: '',
    capacity: 1,
    price_per_hour: 0,
    description: '',
    equipment: []
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    try {
      // Ofisleri getir
      const { data: officesData, error: officesError } = await supabase
        .from('gp_offices')
        .select(`
          *,
          gp_locations (name)
        `)
        .order('name');

      // Lokasyonları getir
      const { data: locationsData, error: locationsError } = await supabase
        .from('gp_locations')
        .select('*')
        .order('name');

      if (!officesError && !locationsError) {
        setOffices(officesData || []);
        setLocations(locationsData || []);
        if (locationsData && locationsData.length > 0) {
          setNewOffice(prev => ({...prev, location_id: locationsData[0].id}));
        }
      }
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddOffice = async () => {
    if (!newOffice.name || !newOffice.location_id) {
      Alert.alert('Hata', 'Lütfen ofis adı ve lokasyon seçin.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gp_offices')
        .insert([newOffice])
        .select();

      if (!error) {
        Alert.alert('Başarılı', 'Ofis başarıyla eklendi.');
        setShowAddForm(false);
        setNewOffice({
          name: '',
          location_id: locations[0]?.id || '',
          capacity: 1,
          price_per_hour: 0,
          description: '',
          equipment: []
        });
        fetchData();
      } else {
        Alert.alert('Hata', 'Ofis eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Add office error:', error);
      Alert.alert('Hata', 'Ofis eklenirken bir hata oluştu.');
    }
  };

  const handleToggleStatus = async (officeId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'reserviert' : 'available';
      const { error } = await supabase
        .from('gp_offices')
        .update({ status: newStatus })
        .eq('id', officeId);

      if (!error) {
        fetchData();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'occupied': return '#ef4444';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Müsait';
      case 'occupied': return 'Dolu';
      case 'maintenance': return 'Bakımda';
      default: return status;
    }
  };

  const filteredOffices = offices.filter(office =>
    office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    office.locations?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Ofis Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
        <View style={adminStyles.offices.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={adminStyles.offices.loadingText}>Ofisler yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Ofis Yönetimi" 
        onBack={() => onNavigate('admin')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Arama ve Ekle Butonu */}
        <View style={adminStyles.offices.headerActions}>
          <TextInput
            style={adminStyles.offices.searchInput}
            placeholder="Ofis veya lokasyon ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <TouchableOpacity 
            style={adminStyles.offices.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text style={adminStyles.offices.addButtonText}>+ Ofis Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Yeni Ofis Formu */}
        {showAddForm && (
          <View style={adminStyles.offices.addForm}>
            <Text style={adminStyles.offices.formTitle}>Yeni Ofis Ekle</Text>
            
            <TextInput
              style={adminStyles.offices.input}
              placeholder="Ofis Adı"
              value={newOffice.name}
              onChangeText={(text) => setNewOffice({...newOffice, name: text})}
            />
            
            <View style={adminStyles.offices.pickerContainer}>
              <Text style={adminStyles.offices.pickerLabel}>Lokasyon:</Text>
              <ScrollView horizontal style={adminStyles.offices.locationsScroll}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      adminStyles.offices.locationButton,
                      newOffice.location_id === location.id && adminStyles.offices.locationButtonActive
                    ]}
                    onPress={() => setNewOffice({...newOffice, location_id: location.id})}
                  >
                    <Text style={[
                      adminStyles.offices.locationButtonText,
                      newOffice.location_id === location.id && adminStyles.offices.locationButtonTextActive
                    ]}>
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={adminStyles.offices.rowInputs}>
              <View style={adminStyles.offices.halfInput}>
                <Text style={adminStyles.offices.inputLabel}>Kapasite</Text>
                <TextInput
                  style={adminStyles.offices.input}
                  placeholder="Kişi sayısı"
                  value={newOffice.capacity.toString()}
                  onChangeText={(text) => setNewOffice({...newOffice, capacity: parseInt(text) || 1})}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={adminStyles.offices.halfInput}>
                <Text style={adminStyles.offices.inputLabel}>Saatlik Ücret (€)</Text>
                <TextInput
                  style={adminStyles.offices.input}
                  placeholder="0.00"
                  value={newOffice.price_per_hour.toString()}
                  onChangeText={(text) => setNewOffice({...newOffice, price_per_hour: parseFloat(text) || 0})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TextInput
              style={[adminStyles.offices.input, adminStyles.offices.textArea]}
              placeholder="Ofis Açıklaması"
              value={newOffice.description}
              onChangeText={(text) => setNewOffice({...newOffice, description: text})}
              multiline
              numberOfLines={3}
            />

            <View style={adminStyles.offices.formActions}>
              <TouchableOpacity 
                style={adminStyles.offices.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={adminStyles.offices.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={adminStyles.offices.saveButton}
                onPress={handleAddOffice}
              >
                <Text style={adminStyles.offices.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Ofis İstatistikleri */}
        <View style={adminStyles.offices.statsGrid}>
          <View style={adminStyles.offices.statCard}>
            <Text style={adminStyles.offices.statNumber}>{filteredOffices.length}</Text>
            <Text style={adminStyles.offices.statLabel}>Toplam Ofis</Text>
          </View>
          <View style={adminStyles.offices.statCard}>
            <Text style={[adminStyles.offices.statNumber, { color: '#10b981' }]}>
              {filteredOffices.filter(o => o.status === 'available').length}
            </Text>
            <Text style={adminStyles.offices.statLabel}>Müsait</Text>
          </View>
          <View style={adminStyles.offices.statCard}>
            <Text style={[adminStyles.offices.statNumber, { color: '#ef4444' }]}>
              {filteredOffices.filter(o => o.status === 'occupied').length}
            </Text>
            <Text style={adminStyles.offices.statLabel}>Dolu</Text>
          </View>
          <View style={adminStyles.offices.statCard}>
            <Text style={[adminStyles.offices.statNumber, { color: '#f59e0b' }]}>
              {filteredOffices.filter(o => o.status === 'maintenance').length}
            </Text>
            <Text style={adminStyles.offices.statLabel}>Bakımda</Text>
          </View>
        </View>

        {/* Ofis Listesi */}
        {filteredOffices.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery ? 'Aranan kriterlere uygun ofis bulunamadı.' : 'Ofis bulunmuyor.'}
            </Text>
          </View>
        ) : (
          filteredOffices.map((office) => (
            <View key={office.id} style={adminStyles.offices.officeCard}>
              <View style={adminStyles.offices.officeHeader}>
                <View style={adminStyles.offices.officeInfo}>
                  <Text style={adminStyles.offices.officeName}>{office.name}</Text>
                  <Text style={adminStyles.offices.officeLocation}>📍 {office.locations?.name}</Text>
                  <Text style={adminStyles.offices.officeDetails}>
                    👥 {office.capacity} kişi • 💰 {office.price_per_hour} €/saat
                  </Text>
                  {office.description && (
                    <Text style={adminStyles.offices.officeDescription}>{office.description}</Text>
                  )}
                </View>
                
                <View style={adminStyles.offices.officeActions}>
                  <View style={[adminStyles.offices.statusBadge, { backgroundColor: getStatusColor(office.status) }]}>
                    <Text style={adminStyles.offices.statusText}>{getStatusText(office.status)}</Text>
                  </View>
                  
                  {office.status !== 'occupied' && (
                    <TouchableOpacity 
                      style={adminStyles.offices.statusButton}
                      onPress={() => handleToggleStatus(office.id, office.status)}
                    >
                      <Text style={adminStyles.offices.statusButtonText}>
                        {office.status === 'available' ? '🔧 Bakıma Al' : '✅ Kullanıma Aç'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={adminStyles.offices.officeMeta}>
                <Text style={adminStyles.offices.metaText}>
                  Son güncelleme: {new Date(office.updated_at || office.created_at).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default AdminOfficesScreen;
