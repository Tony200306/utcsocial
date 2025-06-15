"use client";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import React from "react";

const ErrorPage = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/sign-in");
  };

  const typeError = !user
    ? "Bạn chưa đăng nhập"
    : "Bạn không có quyền thao tác trang này";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f9fa",
      }}
    >
      <h1 style={{ color: "#d32f2f", fontSize: "2rem", marginBottom: "1rem" }}>
        {typeError}
      </h1>
      {!user && (
        <div>
          {" "}
          <button
            onClick={handleGoToLogin}
            style={{
              margin: "10px 10px",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Đến trang đăng nhập
          </button>
        </div>
      )}{" "}
      <button
        onClick={() => router.push("/")}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Về trang chủ
      </button>
    </div>
  );
};
export default ErrorPage;
