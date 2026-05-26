import { GoogleGenAI } from '@google/genai';

// 1. Khởi tạo chìa khóa cấu hình AI
// Khóa API_KEY này bạn sẽ lấy ở bước sau để bảo mật hệ thống
const GEMINI_API_KEY = 'AIzaSyCZNk9Te6e4hF651ZIm-bo4y6UuG760Zc8';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// 2. Định nghĩa System Instruction (Lệnh tối cao ép AI phải nghe theo)
const SYSTEM_INSTRUCTION = `
Bạn là bộ não trí tuệ nhân tạo lõi của ứng dụng "Smart Family Hub". 
Nhiệm vụ của bạn là phân tích các yêu cầu từ thành viên gia đình (văn bản hoặc hình ảnh) để trích xuất ra lịch trình hoặc việc nhà.

BẮT BUỘC phải trả về dữ liệu dưới dạng cấu trúc JSON nguyên bản, không nằm trong khối mã (không có \`\`\`json).
Cấu trúc JSON bắt buộc phải tuân theo định dạng sau:
{
  "intent": "create_event" hoặc "create_chore",
  "data": [
    {
      "title": "Tên sự kiện hoặc tên việc nhà",
      "start_time": "Định dạng ISO String nếu là lịch trình, hoặc null nếu là việc nhà",
      "end_time": "Định dạng ISO String nếu là lịch trình, hoặc null nếu là việc nhà",
      "assigned_to": "Tên thành viên hoặc 'all'",
      "points": "Số điểm thưởng từ 10 đến 50 dựa trên độ khó nếu là việc nhà, hoặc null nếu là lịch trình"
    }
  ]
}
`;

/**
 * Hàm xử lý văn bản hoặc giọng nói đã được dịch thành văn bản
 * @param {string} userPrompt - Câu lệnh của người dùng (Ví dụ: "Tuần sau cả nhà đi du lịch, lên lịch giúp tôi")
 */
export const processTextIntent = async (userPrompt) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Ép phản hồi đầu ra luôn luôn là cấu trúc JSON sạch
        responseMimeType: 'application/json'
      }
    });

    // Chuyển chuỗi chữ JSON từ AI thành đối tượng JavaScript để App đọc được
    return JSON.parse(response.text);
  } catch (error) {
    console.error('❌ Lỗi xử lý bộ não AI Gemini (Text):', error.message);
    return { intent: 'unknown', data: [] };
  }
};
