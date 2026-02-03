import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabase';
import { globalStyles } from '../styles/globalStyles';
import { calendarStyles } from '../styles/calendarStyles';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const OfficeCalendarScreen = ({ onNavigate, params, currentScreen }) => {
  const office = params?.office;
  const location = params?.location;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('18:00');
  const [loading, setLoading] = useState(false);

  // useMemo ile sabit değerleri cache'le
  const timeOptions = useMemo(() => [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ], []);

  const months = useMemo(() => [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ], []);

  // useCallback'leri düzgün tanımla
  const formatDate = useCallback((date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }, [months]); // months dependency eklendi

  const handleDateSelect = useCallback((date) => {
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (!endDate) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  }, [startDate, endDate]);

  const getDateRange = useCallback(() => {
    if (!startDate || !endDate) return [];
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }, [startDate, endDate]);

  const checkBusySlots = useCallback(async () => {
    if (!office || !startDate || !endDate) return;

    setLoading(true);
    try {
      const startOfRange = new Date(startDate);
      startOfRange.setHours(0, 0, 0, 0);
      
      const endOfRange = new Date(endDate);
      endOfRange.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('gp_reservations')
        .select('reservation_date, start_time, end_time')
        .eq('office_id', office.id)
        .neq('status', 'cancelled')
        .gte('reservation_date', startOfRange.toISOString().split('T')[0])
        .lte('reservation_date', endOfRange.toISOString().split('T')[0]);

      if (error) {
        console.error('Rezervasyon kontrol hatası:', error);
        return;
      }

      if (data && data.length > 0) {
        Alert.alert('Uyarı', 'Seçtiğiniz tarih aralığında müsait olmayan günler var.');
      }
    } catch (error) {
      console.error('Slot kontrol hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, office]);

  useEffect(() => {
    if (startDate && endDate && office) {
      checkBusySlots();
    }
  }, [startDate, endDate, office, checkBusySlots]);

  const handleReservation = useCallback(() => {
    if (!startDate || !endDate) {
      Alert.alert('Uyarı', 'Lütfen tarih aralığı seçin.');
      return;
    }

    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    if (endHour <= startHour) {
      Alert.alert('Uyarı', 'Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    const dateRange = getDateRange();

    onNavigate('reservation-confirm', { 
      office, 
      location, 
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startTime,
      endTime,
      time: `${startTime} - ${endTime}`,
      dateRange: dateRange.map(date => formatDate(date))
    });
  }, [startDate, endDate, startTime, endTime, office, location, getDateRange, formatDate, onNavigate]);

  const renderCalendarDays = useCallback(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.calendarDay} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = i === currentDay;
      const isStartDate = startDate && date.toDateString() === startDate.toDateString();
      const isEndDate = endDate && date.toDateString() === endDate.toDateString();
      const isInRange = startDate && endDate && date >= startDate && date <= endDate;
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      
      days.push(
        <TouchableOpacity 
          key={i} 
          style={[
            calendarStyles.calendarDay,
            isToday && calendarStyles.calendarDayToday,
            isStartDate && calendarStyles.calendarDayStart,
            isEndDate && calendarStyles.calendarDayEnd,
            isInRange && calendarStyles.calendarDayInRange,
            isPast && calendarStyles.calendarDayPast
          ]}
          onPress={() => !isPast && handleDateSelect(date)}
          disabled={isPast}
        >
          <Text style={[
            calendarStyles.calendarDayText,
            isToday && calendarStyles.calendarDayTextToday,
            (isStartDate || isEndDate) && calendarStyles.calendarDayTextSelected,
            isInRange && calendarStyles.calendarDayTextInRange,
            isPast && calendarStyles.calendarDayTextPast
          ]}>
            {i}
          </Text>
          {isToday && <View style={calendarStyles.todayDot} />}
        </TouchableOpacity>
      );
    }
    return days;
  }, [startDate, endDate, handleDateSelect]);

  const getCurrentMonth = useCallback(() => {
    const today = new Date();
    return `${months[today.getMonth()]} ${today.getFullYear()}`;
  }, [months]); // months dependency eklendi

  const dateRange = getDateRange();

  return (
    <View style={globalStyles.container}>
      <Header 
        title={office?.name || "Takvim"} 
        onBack={() => onNavigate('office-list', { location })}
        showBack={true}
      />

      <ScrollView style={globalStyles.content}>
        <View style={calendarStyles.officeInfo}>
          <Text style={calendarStyles.officeTitle}>{office?.name}</Text>
          <Text style={calendarStyles.officeDescription}>
            {office?.description || 'Tek kişilik, modern tasarımlı, tam donanımlı muayene odası.'}
          </Text>
          <Text style={calendarStyles.officeLocation}>📍 {location?.name}</Text>
        </View>

        <View style={calendarStyles.section}>
          <Text style={calendarStyles.sectionTitle}>{getCurrentMonth()}</Text>
          
          <View style={calendarStyles.selectedDates}>
            <Text style={calendarStyles.selectedDateText}>
              Başlangıç: {startDate ? formatDate(startDate) : 'Seçilmedi'}
            </Text>
            <Text style={calendarStyles.selectedDateText}>
              Bitiş: {endDate ? formatDate(endDate) : 'Seçilmedi'}
            </Text>
          </View>
          
          <View style={calendarStyles.calendar}>
            <View style={calendarStyles.weekDays}>
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                <Text key={day} style={calendarStyles.weekDay}>{day}</Text>
              ))}
            </View>
            <View style={calendarStyles.calendarGrid}>
              {renderCalendarDays()}
            </View>
          </View>
          
          {dateRange.length > 0 && (
            <View style={calendarStyles.dateRangeInfo}>
              <Text style={calendarStyles.dateRangeText}>
                Seçilen {dateRange.length} gün: {formatDate(startDate)} - {formatDate(endDate)}
              </Text>
            </View>
          )}
        </View>

        {dateRange.length > 0 && (
          <View style={calendarStyles.section}>
            <Text style={calendarStyles.sectionTitle}>Saat Aralığı Seçin</Text>
            
            {/* YAN YANA SAAT SEÇİMİ */}
            <View style={calendarStyles.timeSelectionRow}>
              <View style={calendarStyles.timePickerColumn}>
                <Text style={calendarStyles.timePickerLabel}>Başlangıç Saati</Text>
                <View style={calendarStyles.pickerWrapper}>
                  <Picker
                    selectedValue={startTime}
                    onValueChange={setStartTime}
                    style={calendarStyles.picker}
                    dropdownIconColor="#666"
                  >
                    {timeOptions.map((time) => (
                      <Picker.Item 
                        key={time} 
                        label={time} 
                        value={time} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={calendarStyles.timePickerColumn}>
                <Text style={calendarStyles.timePickerLabel}>Bitiş Saati</Text>
                <View style={calendarStyles.pickerWrapper}>
                  <Picker
                    selectedValue={endTime}
                    onValueChange={setEndTime}
                    style={calendarStyles.picker}
                    dropdownIconColor="#666"
                  >
                    {timeOptions.map((time) => {
                      const startHour = parseInt(startTime.split(':')[0]);
                      const endHour = parseInt(time.split(':')[0]);
                      const isValid = endHour > startHour;
                      
                      return (
                        <Picker.Item 
                          key={time} 
                          label={time} 
                          value={time} 
                          color={isValid ? "#333" : "#999"}
                          enabled={isValid}
                        />
                      );
                    })}
                  </Picker>
                </View> 
              </View>
            </View>

            <View style={calendarStyles.selectedRange}>
              <Text style={calendarStyles.selectedRangeText}>
                Seçilen: {startTime} - {endTime}
              </Text>
              <Text style={calendarStyles.selectedRangeSubtext}>
                Toplam: {dateRange.length} gün × {parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} saat
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[
            globalStyles.button.primary,
            (!startDate || !endDate || loading) && globalStyles.button.disabled
          ]} 
          onPress={handleReservation}
          disabled={!startDate || !endDate || loading}
        >
          <Text style={globalStyles.text.button}>
            {loading ? 'Kontrol Ediliyor...' : 'Devam Et'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} currentScreen={currentScreen} />
    </View>
  );
};

export default OfficeCalendarScreen;
