import { createClient } from '@supabase/supabase-js';

// 1. Cấu hình địa chỉ và chìa khóa bảo mật của dự án Supabase của bạn
// Lưu ý: Sau này các chuỗi 'YOUR_SUPABASE_URL' sẽ được thay thế bằng thông tin thật trong cấu hình môi trường (.env) để bảo mật.
const supabaseUrl = 'https://tuynvlxinyekiicdidiz.supabase.co';
const supabaseAnonKey = 'sb_publishable_5tFRrWqnNk2eB1tt7KNVXw_jtWFmGy_';

// 2. Khởi tạo một thực thể kết nối (Client Instance)
// Thực thể này sẽ được gọi ở tất cả các module khác để đọc/ghi dữ liệu
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Hàm hỗ trợ kiểm tra kết nối thời gian thực (Realtime)
 * Giúp kiểm tra xem app trên điện thoại đã thông với cơ sở dữ liệu chưa.
 */
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('⚡ Kết nối Supabase thành công! Trạng thái sẵn sàng.');
    return true;
  } catch (err) {
    console.error('❌ Lỗi kết nối cấu hình cơ sở dữ liệu:', err.message);
    return false;
  }
};
