import React, { useState, useEffect, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X, Send, CheckCircle2, MapPin, Calendar, Users, Building2, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

export const PopupInquiry = memo(({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
    guests: '',
    date: '',
    location: '',
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
               <LinearGradient
                  colors={['#0F172A', '#1E293B']}
                  style={styles.headerGradient}
               />
               <View style={styles.headerInfo}>
                  <View style={styles.iconBox}>
                     <Building2 size={20} color="white" />
                  </View>
                  <View>
                     <Text style={styles.headerTitle}>GET FREE <Text style={{ color: Colors.primary }}>QUOTES</Text> NOW</Text>
                     <View style={styles.headerSub}>
                        <CheckCircle2 size={10} color={Colors.primary} />
                        <Text style={styles.headerSubText}>DIRECT VENUE PRICES IN MINUTES</Text>
                     </View>
                  </View>
               </View>
               <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="white" />
               </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
               {isSubmitted ? (
                  <View style={styles.successContainer}>
                     <View style={styles.successCircle}>
                        <CheckCircle2 size={40} color="#10B981" />
                     </View>
                     <Text style={styles.successTitle}>PERFECT!</Text>
                     <Text style={styles.successSub}>Sit back and relax. Our venue hosts are calculating your best quotes right now.</Text>
                  </View>
               ) : (
                  <View style={styles.formPadding}>
                     <Text style={styles.formPitch}>
                        Tell us your event details and get the best direct pricing from top-rated venues near you.
                     </Text>

                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="Your Name" 
                          placeholderTextColor={Colors.slate[300]}
                          value={formData.name}
                          onChangeText={(t) => setFormData({...formData, name: t})}
                        />
                     </View>

                     <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.phoneInput}>
                           <Text style={styles.prefix}>+91</Text>
                           <TextInput 
                              style={styles.textInput} 
                              placeholder="10 Digit Number" 
                              placeholderTextColor={Colors.slate[300]}
                              keyboardType="phone-pad"
                              maxLength={10}
                           />
                        </View>
                     </View>

                     <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                           <Text style={styles.label}>Approx Guests</Text>
                           <TouchableOpacity style={styles.select}>
                              <Text style={styles.selectText}>Select Capacity</Text>
                              <ChevronDown size={14} color={Colors.slate[400]} />
                           </TouchableOpacity>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                           <Text style={styles.label}>Event Type</Text>
                           <TouchableOpacity style={styles.select}>
                              <Text style={styles.selectText}>Select Event</Text>
                              <ChevronDown size={14} color={Colors.slate[400]} />
                           </TouchableOpacity>
                        </View>
                     </View>

                     <View style={[styles.inputGroup]}>
                        <Text style={styles.label}>Proposed Event Date</Text>
                        <View style={styles.inputIcon}>
                           <TextInput 
                              style={styles.textInput} 
                              placeholder="YYYY-MM-DD" 
                              placeholderTextColor={Colors.slate[300]}
                           />
                           <Calendar size={18} color={Colors.slate[300]} />
                        </View>
                     </View>

                     <View style={[styles.inputGroup]}>
                        <Text style={styles.label}>Pincode / Location</Text>
                        <View style={styles.inputIcon}>
                           <TextInput 
                              style={styles.textInput} 
                              placeholder="Enter Pincode or City" 
                              placeholderTextColor={Colors.slate[300]}
                           />
                           <MapPin size={18} color={Colors.slate[300]} />
                        </View>
                     </View>

                     <TouchableOpacity style={styles.submitBtnWrapper} onPress={handleSubmit}>
                        <LinearGradient
                           colors={Colors.gradient}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 0 }}
                           style={styles.submitBtn}
                        >
                           <Text style={styles.submitBtnText}>GET QUOTES NOW</Text>
                           <Send size={18} color="white" />
                        </LinearGradient>
                     </TouchableOpacity>

                     <Text style={styles.guarantee}>
                        <Text style={{ color: '#10B981' }}>ZERO BROKERAGE</Text> • VERIFIED FIRST • BEST PRICE
                     </Text>
                  </View>
               )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
  },
  modalContainer: {
    width: '100%',
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    position: 'relative',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '5deg' }],
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  headerSub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  headerSubText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    maxHeight: 600,
  },
  formPadding: {
    padding: 25,
  },
  formPitch: {
    color: Colors.slate[400],
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 18,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary + '40',
    paddingLeft: 15,
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.slate[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    height: 55,
    backgroundColor: Colors.slate[50],
    borderWidth: 1,
    borderColor: Colors.slate[100],
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  phoneInput: {
    height: 55,
    backgroundColor: Colors.slate[50],
    borderWidth: 1,
    borderColor: Colors.slate[100],
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.slate[900],
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.slate[200],
    paddingRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  select: {
    height: 55,
    backgroundColor: Colors.slate[50],
    borderWidth: 1,
    borderColor: Colors.slate[100],
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  selectText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.slate[300],
  },
  inputIcon: {
    height: 55,
    backgroundColor: Colors.slate[50],
    borderWidth: 1,
    borderColor: Colors.slate[100],
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  submitBtnWrapper: {
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  submitBtn: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  guarantee: {
    marginTop: 20,
    fontSize: 9,
    fontWeight: '900',
    color: Colors.slate[400],
    textAlign: 'center',
    letterSpacing: 1,
  },
  successContainer: {
    padding: 60,
    alignItems: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.slate[900],
    marginBottom: 10,
  },
  successSub: {
    fontSize: 12,
    color: Colors.slate[500],
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  }
});
