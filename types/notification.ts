export type Notification = {
    _id: string; // ID của thông báo
    user: {
      _id: string; // ID người dùng
      name: string; // Tên người dùng
      profilePic: string; // Ảnh đại diện
    };
    type: "like" | "comment" | "follow" | "mention" | "repost"; // Loại thông báo
    content?: {
      // Tài liệu tham chiếu (Post, Thread, hoặc mô hình khác tùy theo type)
      _id: string;
      [key: string]: any; // Tùy thuộc vào dữ liệu tham chiếu cụ thể
    };
    thread?: {
      // Thông tin rút gọn về thread
      _id: Object;
      postedBy: string; // Tên người đăng
      text: string; // Nội dung đăng
    };
    target?: {
      _id: string; // ID người dùng
      name: string; // Tên người dùng
      profilePic: string; // Ảnh đại diện
    }; //
    createdAt: string; // Thời điểm tạo thông báo
    isRead: boolean; // Trạng thái đã đọc
  };
  