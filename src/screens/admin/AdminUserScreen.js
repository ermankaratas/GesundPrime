import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { supabase } from '../../services/supabase';
import { globalStyles } from '../../styles/globalStyles';
import { adminStyles } from '../../styles/adminStyles';
import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNavigation';

const AdminUsersScreen = ({ onNavigate, currentScreen }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'doctor',
    phone: ''
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('gp_users')
        .select('*')
        .order('name');

      if (!error && data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Hata', 'Lütfen isim ve email alanlarını doldurun.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gp_users')
        .insert([
          {
            ...newUser,
            password: 'temp123', // Default şifre
            is_active: true
          }
        ])
        .select();

      if (!error) {
        Alert.alert('Başarılı', 'Kullanıcı başarıyla eklendi.');
        setShowAddForm(false);
        setNewUser({ name: '', email: '', role: 'doctor', phone: '' });
        fetchUsers();
      } else {
        Alert.alert('Hata', 'Kullanıcı eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Add user error:', error);
      Alert.alert('Hata', 'Kullanıcı eklenirken bir hata oluştu.');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('gp_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (!error) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Yönetici';
      case 'doctor': return 'Doktor';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'doctor': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Header title="Kullanıcı Yönetimi" onBack={() => onNavigate('admin')} showBack={true} />
        <View style={adminStyles.users.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={adminStyles.users.loadingText}>Kullanıcılar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Header 
        title="Kullanıcı Yönetimi" 
        onBack={() => onNavigate('admin')}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        {/* Arama ve Ekle Butonu */}
        <View style={adminStyles.users.headerActions}>
          <TextInput
            style={adminStyles.users.searchInput}
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <TouchableOpacity 
            style={adminStyles.users.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Text style={adminStyles.users.addButtonText}>+ Kullanıcı Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Yeni Kullanıcı Formu */}
        {showAddForm && (
          <View style={adminStyles.users.addForm}>
            <Text style={adminStyles.users.formTitle}>Yeni Kullanıcı Ekle</Text>
            
            <TextInput
              style={adminStyles.users.input}
              placeholder="İsim Soyisim"
              value={newUser.name}
              onChangeText={(text) => setNewUser({...newUser, name: text})}
            />
            
            <TextInput
              style={adminStyles.users.input}
              placeholder="E-posta"
              value={newUser.email}
              onChangeText={(text) => setNewUser({...newUser, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={adminStyles.users.input}
              placeholder="Telefon"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({...newUser, phone: text})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={adminStyles.users.input}
              placeholder="Uzmanlık (Doktorlar için)"
              value={newUser.specialty}
              onChangeText={(text) => setNewUser({...newUser, specialty: text})}
            />
            
            <View style={adminStyles.users.roleSelector}>
              <Text style={adminStyles.users.roleLabel}>Rol:</Text>
              {['doctor', 'assistant', 'admin'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    adminStyles.users.roleButton,
                    newUser.role === role && adminStyles.users.roleButtonActive
                  ]}
                  onPress={() => setNewUser({...newUser, role})}
                >
                  <Text style={[
                    adminStyles.users.roleButtonText,
                    newUser.role === role && adminStyles.users.roleButtonTextActive
                  ]}>
                    {getRoleText(role)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={adminStyles.users.formActions}>
              <TouchableOpacity 
                style={adminStyles.users.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={adminStyles.users.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={adminStyles.users.saveButton}
                onPress={handleAddUser}
              >
                <Text style={adminStyles.users.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Kullanıcı Listesi */}
        <View style={adminStyles.users.statsBar}>
          <Text style={adminStyles.users.totalUsers}>Toplam: {filteredUsers.length} kullanıcı</Text>
        </View>

        {filteredUsers.length === 0 ? (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery ? 'Aranan kriterlere uygun kullanıcı bulunamadı.' : 'Kullanıcı bulunmuyor.'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={adminStyles.users.userCard}>
              <View style={adminStyles.users.userHeader}>
                <View style={adminStyles.users.userInfo}>
                  <Text style={adminStyles.users.userName}>{user.name}</Text>
                  <Text style={adminStyles.users.userEmail}>{user.email}</Text>
                  {user.specialty && (
                    <Text style={adminStyles.users.userSpecialty}>{user.specialty}</Text>
                  )}
                  {user.phone && (
                    <Text style={adminStyles.users.userPhone}>📞 {user.phone}</Text>
                  )}
                </View>
                
                <View style={adminStyles.users.userActions}>
                  <View style={[adminStyles.users.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={adminStyles.users.roleBadgeText}>{getRoleText(user.role)}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      adminStyles.users.statusButton,
                      user.is_active ? adminStyles.users.activeButton : adminStyles.users.inactiveButton
                    ]}
                    onPress={() => handleToggleActive(user.id, user.is_active)}
                  >
                    <Text style={adminStyles.users.statusButtonText}>
                      {user.is_active ? 'Aktif' : 'Pasif'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={adminStyles.users.userMeta}>
                <Text style={adminStyles.users.metaText}>
                  Son giriş: {user.last_login ? new Date(user.last_login).toLocaleDateString('tr-TR') : 'Hiç giriş yapmamış'}
                </Text>
                <Text style={adminStyles.users.metaText}>
                  Kayıt tarihi: {new Date(user.created_at).toLocaleDateString('tr-TR')}
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

export default AdminUsersScreen;
