"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import UploadTemplate from "../components/UploadTemplate";

export default function Template() {
  return (
    <ProtectedRoute>
      <AdminRoute>
        <UploadTemplate />
      </AdminRoute>
    </ProtectedRoute>
  );
}
