"use client";

import { useState, useEffect } from "react";
import { getReportsBySearch } from "@/apis/admin"; // API của bạn để lấy báo cáo theo tìm kiếm
import { Report } from "@/types/reportType"; // Kiểu dữ liệu báo cáo
import Link from "next/link";

interface ReportTableProps {
  searchText: string;
}

function ReportTable({ searchText }: Readonly<ReportTableProps>) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getReportsBySearch({ page: 1, searchText });
        setReports(response.reports);
      } catch (err) {
        setError("Error fetching reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [searchText]); // Fetch lại khi searchText thay đổi
  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto mt-10">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Report ID</th>
            <th className="px-4 py-2">Reported By</th>
            <th className="px-4 py-2">Content</th>
            <th className="px-4 py-2">Content Type</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No reports found
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report._id} className="border-b">
                <td className="px-4 py-2">{report._id}</td>
                <td className="px-4 py-2">{report.reportedBy?.username}</td>
                <td className="px-4 py-2">
                  {report.contentType === "Thread"
                    ? report.content?.text
                    : report.content?.username}
                </td>
                <td className="px-4 py-2">{report.contentType}</td>
                <td className="px-4 py-2">{report.reason}</td>
                <td className="px-4 py-2">{report.status}</td>
                <td className="px-4 py-2">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Link className="border-b" href={`/admin/report/${report._id}`}>
                    <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded mr-2">
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
