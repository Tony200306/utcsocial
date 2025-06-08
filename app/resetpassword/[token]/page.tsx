"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { logout, resetPassword } from "@/apis/user";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { mutate: mutateResetPassword } = useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      toast("Mật khẩu đã được cập nhật", {
        description: "Bạn có thể đăng nhập lại bằng mật khẩu mới.",
      });
      setSuccess(true);
      await logout();
      router.push("/sign-in"); // Chuyển hướng sau khi thành công
    },
    onError: (error: any) => {
      toast.error("Lỗi cập nhật mật khẩu", {
        description: error.message || "Vui lòng thử lại.",
      });
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token không hợp lệ");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    mutateResetPassword({ token, password });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow rounded bg-white">
      <h1 className="text-2xl font-semibold mb-4">Đặt lại mật khẩu</h1>
      {success ? (
        <p className="text-green-600">Thành công! Bạn có thể đăng nhập lại.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <label className="block mb-2">Mật khẩu mới:</label>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block mb-2">Xác nhận mật khẩu:</label>
          <input
            type="password"
            className="w-full border p-2 mb-4 rounded"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button className="w-full border border-solid bg-black text-white text-lg py-2 rounded">
            Cập nhật mật khẩu
          </button>
        </form>
      )}
      <Toaster />
    </div>
  );
}
