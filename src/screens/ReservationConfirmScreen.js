import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../services/supabase';
import { reservationStyles } from '../styles/reservationStyles';
import { useAuth } from '../context/AuthContext';

const ReservationConfirmScreen = ({ onNavigate, params }) => {
  const { user } = useAuth();
  const office = params?.office;
  const location = params?.location;
  const startDate = params?.startDate;
  const endDate = params?.endDate;
  const startTime = params?.startTime;
  const endTime = params?.endTime;
  const dateRange = params?.dateRange;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!office || !startDate || !endDate || !startTime || !endTime) {
      Alert.alert('Hata', 'Eksik bilgi!');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı!');
      return;
    }

    setLoading(true);
    try {
      // Tüm tarihler için rezervasyon oluştur
      const reservations = dateRange.map(dateStr => {
        const [day, monthName, year] = dateStr.split(' ');
        const monthIndex = getMonthIndex(monthName);
        const reservationDate = new Date(year, monthIndex, parseInt(day));

        return {
          user_id: user.id,
          office_id: office.id,
          reservation_date: reservationDate.toISOString().split('T')[0],
          start_time: startTime,
          end_time: endTime,
          status: 'pending',
          notes: `${office.name} - ${location.name}`
        };
      });

      // Tüm rezervasyonları veritabanına kaydet
      const { data, error } = await supabase
        .from('gp_reservations')
        .insert(reservations)
        .select();

      if (error) {
        console.error('Rezervasyon hatası:', error);
        Alert.alert('Hata', 'Rezervasyon oluşturulamadı: ' + error.message);
        return;
      }

      // Başarılı - rezervasyonlarım ekranına yönlendir
      onNavigate('my-reservations', { 
        refresh: true 
      });

    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      Alert.alert('Hata', 'Bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMonthIndex = (monthName) => {
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return months.indexOf(monthName);
  };

  return (
    <View style={reservationStyles.reservationConfirm.container}>
      {/* Header */}
      <View style={reservationStyles.reservationConfirm.header}>
        <TouchableOpacity 
          style={reservationStyles.reservationConfirm.backButton} 
          onPress={() => onNavigate('office-calendar', { office, location })}
          disabled={loading}
        >
          <Text style={reservationStyles.reservationConfirm.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={reservationStyles.reservationConfirm.title}>Rezervasyon Onayı</Text>
      </View>

      <ScrollView style={reservationStyles.reservationConfirm.content}>
        {/* Konum */}
        <View style={reservationStyles.reservationConfirm.section}>
          <Text style={reservationStyles.reservationConfirm.sectionTitle}>KONUM</Text>
          <View style={reservationStyles.reservationConfirm.infoCard}>
            <Text style={reservationStyles.reservationConfirm.locationName}>{location?.name}</Text>
            <Text style={reservationStyles.reservationConfirm.locationAddress}>
              {location?.address || 'Kaiser-Wilhelm-Ring 50, 50672 Köln'}
            </Text>
          </View>
        </View>

        {/* Ofis */}
        <View style={reservationStyles.reservationConfirm.section}>
          <Text style={reservationStyles.reservationConfirm.sectionTitle}>OFİS</Text>
          <View style={reservationStyles.reservationConfirm.infoCard}>
            <Text style={reservationStyles.reservationConfirm.officeName}>{office?.name}</Text>
            <Text style={reservationStyles.reservationConfirm.officeDescription}>
              {office?.description || 'Tek kişilik, modern tasarımlı, tam donanımlı muayene odası.'}
            </Text>
          </View>
        </View>

        {/* Tarih Aralığı */}
        <View style={reservationStyles.reservationConfirm.section}>
          <Text style={reservationStyles.reservationConfirm.sectionTitle}>TARİH ARALIĞI</Text>
          <View style={reservationStyles.reservationConfirm.infoCard}>
            <Text style={reservationStyles.reservationConfirm.dateRange}>
              {startDate} - {endDate}
            </Text>
            <Text style={reservationStyles.reservationConfirm.daysCount}>
              Toplam {dateRange?.length || 0} gün
            </Text>
            {dateRange && (
              <View style={reservationStyles.reservationConfirm.dateList}>
                {dateRange.map((date, index) => (
                  <Text key={index} style={reservationStyles.reservationConfirm.dateItem}>
                    • {date}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Saat Aralığı */}
        <View style={reservationStyles.reservationConfirm.section}>
          <Text style={reservationStyles.reservationConfirm.sectionTitle}>SAAT ARALIĞI</Text>
          <View style={reservationStyles.reservationConfirm.infoCard}>
            <Text style={reservationStyles.reservationConfirm.timeSlot}>
              {startTime} - {endTime}
            </Text>
            <Text style={reservationStyles.reservationConfirm.hoursCount}>
              Günlük {parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} saat
            </Text>
            <Text style={reservationStyles.reservationConfirm.totalHours}>
              Toplam: {dateRange?.length * (parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0]))} saat
            </Text>
          </View>
        </View>

        {/* Bilgilendirme */}
        <View style={reservationStyles.reservationConfirm.noticeCard}>
          <Text style={reservationStyles.reservationConfirm.noticeTitle}>
            ⓘ Rezervasyon Onay Süreci
          </Text>
          <Text style={reservationStyles.reservationConfirm.noticeText}>
            Rezervasyon talebiniz admin onayına gönderilecektir. 
            Onaylandıktan sonra rezervasyonunuz aktif olacaktır.
          </Text>
        </View>

        {/* Onay Butonu */}
        <TouchableOpacity 
          style={[
            reservationStyles.reservationConfirm.confirmButton,
            loading && reservationStyles.reservationConfirm.confirmButtonDisabled
          ]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={reservationStyles.reservationConfirm.confirmButtonText}>
            {loading ? 'İşleniyor...' : 'Onayla ve Rezervasyon Talebi Gönder'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ReservationConfirmScreen;
