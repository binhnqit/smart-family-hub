import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { supabase } from '../../services/supabaseClient';
import { processFamilyCommand } from '../../services/aiService';

export default function ChoresScreen() {
  const [chores, setChores] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchChores = async () => {
    try {
      const { data, error } = await supabase
        .from('family_chores')
        .select('*')
        .order('id', { ascending: false });
        
      if (!error && data) {
        setChores(data);
      }
    } catch (err) {
      console.log('Lỗi tải dữ liệu việc nhà:', err);
    }
  };

  useEffect(() => {
    fetchChores();

    // Đồng bộ Realtime từ Supabase để khi AI thêm việc là mobile tự cập nhật
    const subscription = supabase
      .channel('realtime-family-chores')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'family_chores' },
        () => {
          fetchChores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleToggleComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('family_chores')
      .update({ is_completed: !currentStatus })
      .eq('id', id);
      
    if (!error) fetchChores();
  };

  const handleAiSubmit = async () => {
    if (!inputText.trim() || loading) return;
    
    setLoading(true);
    try {
      const res = await processFamilyCommand(inputText);
      if (res && res.success) {
        setInputText('');
        fetchChores();
        showNotification('✨ Thành công', 'Đã phân phối công việc nhà!');
      } else {
        showNotification('⚠️ Thất bại', 'Lỗi phân tích lệnh AI. Hãy kiểm tra lại API Key.');
      }
    } catch (err) {
      console.log(err);
      showNotification('⚠️ Lỗi', 'Không thể kết nối đến dịch vụ trí tuệ nhân tạo.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* KHU VỰC NHẬP LỆNH AI CỤC BỘ */}
      <View style={styles.glassHeader}>
        <View style={styles.aiTitleRow}>
          <Text style={styles.sparkleIcon}>✨</Text>
          <Text style={styles.aiHeaderTitle}>Hệ thống giao việc tự động</Text>
        </View>
        
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Ví dụ: 'Giao Con quét nhà lau nhà thưởng 20 điểm'..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            disabled={loading}
            multiline={false}
          />
          <TouchableOpacity 
            style={styles.sendBtn} 
            onPress={handleAiSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendBtnText}>Giao Việc</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentBody}>
        <Text style={styles.sectionTitle}>✅ Danh sách công việc trong nhà</Text>

        {chores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧼</Text>
            <Text style={styles.emptyText}>Nhà cửa sạch bong! Chưa có việc cần làm.</Text>
            <Text style={styles.emptySubText}>
              Gõ câu lệnh giao việc ở trên để phân phối công việc cho các thành viên nhé.
            </Text>
          </View>
        ) : (
          <View style={styles.verticalList}>
            {chores.map((chore) => (
              <View 
                key={chore.id} 
                style={[
                  styles.choreCard, 
                  { 
                    backgroundColor: chore.is_completed ? '#FAFAFA' : '#FFFFFF',
                    opacity: chore.is_completed ? 0.65 : 1
                  }
                ]}
              >
                <View style={styles.leftSection}>
                  <TouchableOpacity 
                    style={styles.checkboxWrapper}
                    onPress={() => handleToggleComplete(chore.id, chore.is_completed)}
                  >
                    <View style={[
                      styles.customCheckbox,
                      chore.is_completed && styles.customCheckboxChecked
                    ]}>
                      {chore.is_completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.textBlock}>
                    <Text style={[
                      styles.choreTitle,
                      {
                        textDecorationLine: chore.is_completed ? 'line-through' : 'none',
                        color: chore.is_completed ? '#9CA3AF' : '#1F2937'
                      }
                    ]}>
                      {chore.title}
                    </Text>
                    <Text style={styles.assigneeBadge}>👤 {chore.assignee || 'Chưa phân công'}</Text>
                  </View>
                </View>
                
                <View style={styles.rightSection}>
                  <View style={[
                    styles.coinBadge, 
                    { 
                      backgroundColor: chore.is_completed ? '#E5E7EB' : '#FEF3C7'
                    }
                  ]}>
                    <Text style={[
                      styles.coinBadgeText,
                      { color: chore.is_completed ? '#6B7280' : '#D97706' }
                    ]}>
                      🪙 +{chore.points || 0} Điểm
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100
  },
  glassHeader: { 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 24,
    ...Platform.select({
      web: { boxShadow: '0px 8px 32px rgba(31, 38, 135, 0.04)' },
      default: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8 }
    })
  },
  aiTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 14 
  },
  sparkleIcon: { 
    fontSize: 16,
    marginRight: 6
  },
  aiHeaderTitle: { 
    fontWeight: '700', 
    fontSize: 13, 
    color: '#10B981', 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  searchBar: { 
    flexDirection: 'row', 
    gap: 10 
  },
  input: { 
    flex: 1, 
    borderWidth: 1,
    borderColor: '#E5E7EB', 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14, 
    fontSize: 14, 
    color: '#1F2937'
  },
  sendBtn: { 
    backgroundColor: '#10B981', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16, 
    borderRadius: 14,
    height: 48
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  contentBody: {
    flex: 1
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#111827', 
    marginBottom: 16, 
    letterSpacing: -0.3 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 48, 
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#
