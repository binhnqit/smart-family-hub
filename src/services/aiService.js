import { GoogleGenAI } from '@google/genai';
import { supabase } from '../api/supabaseClient'; // Đảm bảo bạn đã có file kết nối supabaseClient trước đó

const aiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const ai = new GoogleGenAI({ apiKey: aiKey });

export const processFamilyCommand = async (inputText) => {
  try {
    const systemInstruction = `
      Bạn là Trợ lý AI tối cao của Gia đình Thông Minh (Smart Family Hub). 
      Nhiệm vụ của bạn là phân tích câu nói tự nhiên của thành viên trong nhà và phân loại thành 2 nhóm:
      
      1. Nếu là sự kiện/lịch trình (Ví dụ: đi khám bệnh, họp phụ huynh, hẹn hò...): 
         Trả về JSON có cấu trúc: {"type": "calendar", "title": "...", "event_date": "YYYY-MM-DD", "event_time": "HH:MM:SS", "assignee": "Bố"/"Mẹ"/"Con"}
      
      2. Nếu là việc nhà cần làm (Ví dụ: rửa bát, quét nhà, mua sữa...):
         Trả về JSON có cấu trúc: {"type": "chore", "title": "...", "points": 10, "assignee": "Bố"/"Mẹ"/"Con"}
      
      Quy tắc phân tích tên (assignee): Dựa vào từ ngữ như "Mẹ dặn...", "Bố sẽ...", "Con đi..." để gán đúng người. Nếu không nói ai, mặc định là "Cả nhà".
      CHỈ TRẢ VỀ ĐÚNG ĐOẠN JSON, KHÔNG GIẢI THÍCH, KHÔNG THÊM CHỮ.
    `;

    // Gọi Gemini 2.5 Flash để xử lý ngôn ngữ tự nhiên cực nhanh
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: inputText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text);

    // Tiến hành tự động nạp dữ liệu vào Supabase sau khi AI phân tích xong
    if (result.type === 'calendar') {
      await supabase.from('family_calendar').insert([{
        title: result.title,
        event_date: result.event_date,
        event_time: result.event_time,
        assignee: result.assignee
      }]);
    } else if (result.type === 'chore') {
      await supabase.from('family_chores').insert([{
        title: result.title,
        points: result.points,
        assignee: result.assignee,
        is_completed: false
      }]);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("AI Service Error:", error);
    return { success: false, error: error.message };
  }
};
