import * as React from "react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { createReport } from "@/apis/report";
import { Report } from "@/types/reportType";
import { Thread } from "@/types/threadType";
import { useMutation } from "react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
type CreateReportCardProps = {
  isOpen: boolean;
  reportedData: Thread;
  handleOpenCreateReportChange: () => void;
};
export function CreateReportCard({
  isOpen,
  reportedData,
  handleOpenCreateReportChange,
}: CreateReportCardProps) {
  return (
    <>
      {isOpen && (
        <Dialog open={true} onOpenChange={handleOpenCreateReportChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Báo cáo</DialogTitle>
              <DialogDescription>
                Bài đăng của người dùng {reportedData.postedBy.name}
              </DialogDescription>
            </DialogHeader>
            <CreateReportForm
              reportedData={reportedData}
              handleOpenCreateReportChange={handleOpenCreateReportChange}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export function CreateReportForm({
  reportedData,
  handleOpenCreateReportChange,
}: {
  reportedData: Thread;
  handleOpenCreateReportChange: () => void;
}) {
  const [form, setForm] = React.useState<Report>({
    reportedBy: reportedData.postedBy._id,
    content: reportedData._id,
    contentType: "Thread",
    reason: "",
  });

  const { mutate } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      toast("Báo cáo đã được tạo thành công!");
      handleOpenCreateReportChange();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể tạo báo cáo");
    },
  });

  const handleChange = (field: keyof Report, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason" className="text-sm font-medium">
            Lý do báo cáo
          </Label>
          <Textarea
            id="reason"
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Vui lòng mô tả lý do bạn báo cáo nội dung này..."
            className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500">
            Hãy giúp chúng tôi hiểu vấn đề với nội dung này
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenCreateReportChange}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="px-6 bg-red-600 hover:bg-red-700 text-white"
            disabled={!form?.reason?.trim()}
          >
            Gửi báo cáo
          </Button>
        </div>
      </form>
    </div>
  );
}
