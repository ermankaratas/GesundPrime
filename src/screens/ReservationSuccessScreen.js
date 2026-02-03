import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { reservationStyles } from '../styles/reservationStyles';

const ReservationSuccessScreen = ({ onNavigate, params }) => {
  const office = params?.office;
  const date = params?.date;
  const time = params?.time;

  return (
    <View style={reservationStyles.reservationSuccess.container}>
      <View style={reservationStyles.reservationSuccess.content}>
        {/* Başarılı İkon */}
        <View style={reservationStyles.reservationSuccess.successIcon}>
          <Text style={reservationStyles.reservationSuccess.checkmark}>✓</Text>
        </View>

        {/* Başlık */}
        <Text style={reservationStyles.reservationSuccess.title}>Rezervasyonunuz Onaylandı!</Text>
        <Text style={reservationStyles.reservationSuccess.subtitle}>
          Rezervasyon detaylarınız e-posta adresinize gönderildi.
        </Text>

        {/* Rezervasyon Detayları */}
        <View style={reservationStyles.reservationSuccess.detailsCard}>
          <View style={reservationStyles.reservationSuccess.detailRow}>
            <Text style={reservationStyles.reservationSuccess.detailDate}>{date}</Text>
            <Text style={reservationStyles.reservationSuccess.detailTime}>{time}</Text>
          </View>
          <View style={reservationStyles.reservationSuccess.divider} />
          <Text style={reservationStyles.reservationSuccess.doctorName}>Dr. Ayşe Yılmaz</Text>
          <Text style={reservationStyles.reservationSuccess.specialty}>Dermatoloji</Text>
        </View>

        {/* Butonlar */}
        <TouchableOpacity 
          style={reservationStyles.reservationSuccess.primaryButton}
          onPress={() => onNavigate('my-reservations')}
        >
          <Text style={reservationStyles.reservationSuccess.primaryButtonText}>Rezervasyonlarımı Görüntüle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={reservationStyles.reservationSuccess.secondaryButton}
          onPress={() => onNavigate('home')}
        >
          <Text style={reservationStyles.reservationSuccess.secondaryButtonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReservationSuccessScreen;
