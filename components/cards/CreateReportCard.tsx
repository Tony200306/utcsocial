import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Thread } from "@/types/threadType";
import { createReport } from "@/apis/report";
import { useMutation } from "react-query";
import { Textarea } from "../ui/textarea";
import { Reportt } from "@/types/reportType";
import { report } from "process";
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
              <DialogTitle>Report</DialogTitle>
              <DialogDescription>
                Thread of user {reportedData.postedBy.name}
              </DialogDescription>
            </DialogHeader>
            <CreateReportForm reportedData={reportedData} handleOpenCreateReportChange={handleOpenCreateReportChange}/>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export function CreateReportForm({ reportedData ,handleOpenCreateReportChange }: { reportedData: Thread ,handleOpenCreateReportChange: () => void}) {
  const [form, setForm] = React.useState<Reportt>({
    reportedBy: reportedData.postedBy._id,
    content: reportedData._id,
    contentType: "Thread",
    reason: "",
  });

  const { mutate } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      alert("Report created successfully!");
      handleOpenCreateReportChange();
    },
    onError: (error: any) => {
      alert(error?.message || "Failed to create report");
    },
  });

  const handleChange = (field: keyof Reportt, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <h2 className="text-lg font-semibold">Create a Report</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                className="h-[250px]"
                id="reason"
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="Why are you reporting this?"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" onClick={handleSubmit}>
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
