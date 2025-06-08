"use client";

import {
  getTotalComments,
  getTotalNewThreads,
  getTotalNewUsers,
} from "@/apis/dashboard";
import { Button } from "@/components/custom/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useUserStore from "@/store/useUserStore";
import { format } from "date-fns";
import { Badge, CalendarIcon, MessageCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NewThreadsChart } from "./components/newThreadsChart";
import { UsersChart } from "./components/userChart";
import { Toaster } from "@/components/ui/sonner";
export default function Page() {
  const user = useUserStore((state) => state.user);
  const route = useRouter();
  useEffect(() => {
    if (user === null) return; // tránh redirect vội nếu đang loading
    if (!user) {
     toast("Thông báo hệ thống", {
          description: `Hãy đăng nhập`,
          action: {
            label: "Ẩn",
            onClick: () => console.log(""),
          },
        });
      route.push("/sign-in");
    } else if (user.role !== "super_admin") {
     toast("Thông báo hoạt động", {
          description: `Bạn không có quyền truy cập vào trang này`,
          action: {
            label: "Ẩn",
            onClick: () => console.log(""),
          },
        });
      route.push("/sign-in");
    }
  }, [user]);

  const currentDate = new Date();
  const [start, setStart] = useState<Date>(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [end, setEnd] = useState<Date>(currentDate);
  const [change, setChange] = useState<boolean>(false);
  const { data: dataTotalNewThreads } = useQuery({
    queryKey: ["get-total-new-threads", change],
    queryFn: () => {
      if (start === undefined || end === undefined) {
        Toast({
          title: "Không được để trống ngày bắt đầu và ngày kết thúc",
        });
      } else {
        return getTotalNewThreads({
          startDate: formatDateToYYYYMMDD(start),
          endDate: formatDateToYYYYMMDD(end),
        });
      }
    },
  });
  const { data: dataTotalComments } = useQuery({
    queryKey: ["get-total-comments", change],
    queryFn: () => {
      if (start === undefined || end === undefined) {
        Toast({
          title: "Không được để trống ngày bắt đầu và ngày kết thúc",
        });
      } else {
        return getTotalComments({
          startDate: formatDateToYYYYMMDD(start),
          endDate: formatDateToYYYYMMDD(end),
        });
      }
    },
  });
  const { data: dataTotalNewUsers } = useQuery({
    queryKey: ["get-total-new-users", change],
    queryFn: () => {
      if (start === undefined || end === undefined) {
        Toast({
          title: "Không được để trống ngày bắt đầu và ngày kết thúc",
        });
      } else {
        return getTotalNewUsers({
          startDate: formatDateToYYYYMMDD(start),
          endDate: formatDateToYYYYMMDD(end),
        });
      }
    },
  });
  const formatDateToYYYYMMDD = (date: Date) => {
    if (!(date instanceof Date)) {
      throw new Error("Invalid date object");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex-col px-10 pb-3 md:flex md:pb-10">
      <div className="flex-1 space-y-4">
        <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
          <div className="flex">
            <h2 className="mr-5 text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
          </div>
          <div className="flex-col items-center space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
            <Button className="w-full md:w-auto">Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Card lớn chứa DatePicker */}
              <Card className="col-span-2 p-5 md:col-span-4 lg:col-span-4">
                {/* Header với DatePicker */}
                <div className="mb-4 flex w-full items-center justify-start space-x-4">
                  <span className="w-1/2 sm:w-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !start && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {start ? (
                            format(start, "PPP")
                          ) : (
                            <span>Start Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={start}
                          onSelect={(e) => setStart(e!)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </span>
                  <span className="ml-4 sm:w-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !end && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {end ? format(end, "PPP") : <span>End Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={end}
                          onSelect={(e) => setEnd(e!)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </span>
                  <Button onClick={() => setChange(!change)} className="">
                    Show
                  </Button>
                </div>

                {/* Nội dung các Card nhỏ */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Total Threads */}
                  <Card className="flex flex-col items-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Threads
                      </CardTitle>
                      <Badge className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dataTotalNewThreads?.totalThreads}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Comments */}
                  <Card className="flex flex-col items-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Comments
                      </CardTitle>
                      <MessageCircle className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dataTotalComments?.totalComments}
                      </div>
                    </CardContent>
                  </Card>

                  {/* New Users */}
                  <Card className="flex flex-col items-center">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        New Users
                      </CardTitle>
                      <Users className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dataTotalNewUsers?.totalnewusers}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Card>

              {/* Active Users Card nằm ngang với các Card nhỏ */}
              <div className="col-span-2 md:col-span-4 lg:col-span-4">
                {/* Biểu đồ */}
                <div className="mt-6 grid size-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-2">
                  <div className="size-full">
                    <UsersChart />
                  </div>
                  {/* <div className="size-full">
                    <PieThreadsChart />
                  </div> */}
                  <div className="size-full">
                    <NewThreadsChart />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Toaster/>
      </div>
    </div>
  );
}
