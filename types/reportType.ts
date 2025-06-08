export interface Report {
  _id: string;  // ID của báo cáo
  reportedBy: string;  // ID của người báo cáo (referring to User)
  content: string;  // ID của nội dung bị báo cáo (có thể là ID của Comment hoặc User)
  contentType: "Thread" | "User";  // Kiểu nội dung được báo cáo (Comment hoặc User)
  reason: string;  // Lý do báo cáo
  status: "pending" | "reviewed" | "resolved";  // Trạng thái của báo cáo
  createdAt: string;  // Thời gian tạo báo cáo
}
