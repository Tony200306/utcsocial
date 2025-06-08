"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getReportById ,updateReportStatus } from "@/apis/admin";
import { getUserById } from "@/apis/user"; // API để lấy chi tiết báo cáo

 // API để lấy chi tiết báo cáo
import { Report } from "@/types/reportType";
import { useMutation, useQuery } from "react-query";
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconCursorOff } from "@tabler/icons-react";

export default function ReportDetailsPage({ params }: Readonly<{params:  string }>) {
  const reportId = params.reportId; // Lấy reportId từ URL
  const [report ,setReport] = useState({});
  const [selectedActions, setSelectedActions] = useState<string[]>([]); 
  const [allActions, setAllActions] = useState<string[]>([]); 
  const [lognote, setLognote] = useState("");


  const queryGetReport = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById({ id: reportId }),
    onError: (error) => {
      console.error("Error fetching  data:", error);
    },
    enabled: !!reportId,
    onSuccess: (data) => {
      setReport(data);
      if (data.contentType ==="User"){
        setAllActions(["Suspend User"]);
      }
      else if (data.contentType ==="Thread"){
        setAllActions(["Suspend User" , "Hide Thread"]);
      }
    },
  });


  const { mutate: sendResolve } = useMutation({
    mutationFn: updateReportStatus ,
    onSuccess: (data: { message: string }) => {
      queryGetReport.refetch();
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });

  const { data: postedByUser, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", report?.content?.postedBy], // Sử dụng ID người dùng từ report.content.postedBy
    queryFn: () => getUserById({id:report?.content?.postedBy}),
    enabled: !!report?.content?.postedBy, // Gọi API người dùng khi có thông tin postedBy
  });
  


  const statusArray = ["pending", "reviewed", "resolved"];
  var nextStatusReport ;
  var indexOfStatusReport = 0; 

  for (let i = 0; i < statusArray.length; i++) {
      if (statusArray[i] === report?.status) {
      indexOfStatusReport = i ; 
      }
  }
  report?.status !== "resolved"? nextStatusReport = statusArray[indexOfStatusReport + 1].toUpperCase():nextStatusReport = "Resolved";
  const handleStatus = (newStatus: string) => {
    const currentStatus = report?.status;
  
    const data = currentStatus === "reviewed" ? {
      currentTargetType :  report.contentType,
      currentTargetTypeId : report.content._id ,
      lognote: lognote,  // Lưu giá trị ghi chú từ textarea
      selectedAction: selectedActions,  // Lưu hành động từ select
    } : {};  // Nếu không phải "reviewed", gửi đối tượng trống
  
    // Gọi sendResolve chỉ một lần, với data (nếu có)
    sendResolve({ currentStatus, newStatus, reportId, data });
  };
  
  const addNewDropdown = () => {
    if (selectedActions.length < 2 ) {
    setSelectedActions([...selectedActions, "none"]); 
    } // Add new dropdown with default value 'none'
  };

  const handleSelectAction = (index: number, value: string) => {
    const updatedActions = [...selectedActions];
    const updatedAllActions = [...allActions];

    updatedActions[index] = value;  
    updatedAllActions[index] = value; 
    setSelectedActions(updatedActions);
    setAllActions(updatedAllActions)
  };

  const handleLognote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLognote(e.target.value);
  };

  const getButtonClass = (status:string) => {
    switch (status) {
      case "pending".toUpperCase():
        return "bg-gray-400 text-black";
      case "reviewed".toUpperCase():
        return "bg-yellow-300 text-black";
      case "resolved".toUpperCase():
        return "bg-green-300 text-black";
      default:
        return "hidden";
    }
  };
  
  if (!report) return <p>Loading report details...</p>;
  return (
    <div className="flex" style={{ justifyContent: "center"  }}>
       
    <section className="p-10">
      
 {report.status!=="pending" && report.status!=="resolved" &&(
    <button onClick={() => handleStatus("setDraft")} style={{height:"50px" }}  className="mr-5 px-4 rounded bg-gray-600 text-white hover:text-black  hover:bg-yellow-600">
                SET TO DRAFT
      </button>
 )}
    <button onClick={() => handleStatus("upDate" )} style={{height:"50px"  }} className={`px-4 py-2 rounded mr-2 hover:bg-black hover:text-white ${getButtonClass(
        nextStatusReport
      )}`}>
                  {nextStatusReport}
      </button>
     
      
      <h1 className="mb-4 text-xl font-bold">Report Details</h1>
      {/* Report general information */}
      <div className="mb-6">
        <p><strong>Report ID:</strong> {report?._id}</p>
        <p><strong>Reported By:</strong> {report.reportedBy?.username}</p>
        <p><strong>Reason:</strong> {report.reason}</p>
        <p><strong>Status:</strong> {report.status}</p>
        <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
      
      </div>
      

      {/* Content information */}
      <div className="border-t mt-4 pt-4">
        <h2 className="text-lg font-semibold">Content Details</h2>


        <div  className="flex p-10">
        {report.contentType === "Thread" && report.content && (
          <div className="mt-4">
            <p><strong>Thread ID:</strong> {report.content._id}</p>
            
            {/* Displaying user information for the post */}
            {postedByUser ? (
              <div>
                <p><strong>Posted By:</strong> {postedByUser.username}</p>
                <img src={postedByUser.profilePic} alt="User Avatar" className="w-12 h-12 rounded-full" />
              </div>
            ) : (
              <p>Loading user info...</p>
            )}
            
            <p><strong>Content:</strong> {report.content.text}</p>
            
            {/* Displaying images if available */}
            {report.content.imgs && report.content.imgs.length > 0 && (
              <div className="mt-2">
                <strong>Images:</strong>
                <div className="flex space-x-2 mt-2">
                  {report.content.imgs.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Image ${index}`} className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}

            {/* Displaying likes if available */}
            {report.content.likes && report.content.likes.length > 0 && (
              <div className="mt-2">
                <strong>Likes:</strong> {report.content.likes.length}
              </div>
            )}
          </div>
        )}

{report.contentType === "User"  && (
          <div className="mt-4">
            <p><strong>User ID:</strong> {report.content._id}</p>
            <p><strong>Username:</strong> {report.content.username}</p>
            <p><strong>Email:</strong> {report.content.email}</p>
            {/* Hiển thị thêm thông tin người dùng nếu có */}
          </div>
        )}


{report.status === "reviewed"  &&allActions.map((action, index) => (
          <Select 
            key={index}
            value={action}
            onValueChange={(value) => handleSelectAction(index, value)}
            className=" ml-20 mt-4"
          >
            <SelectTrigger style={{width:"160px",margin:"0 10px"}}>     
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem   value="none">...</SelectItem>
              <SelectItem value="suspendAccount">Suspend Account</SelectItem>
              {report.contentType === "Thread" && <SelectItem value="hideThread">Hide Thread</SelectItem>}
            </SelectContent>
          </Select>
        ))}
        </div>
      </div>
      <h1 ><strong>Log note :</strong></h1>

      
      {report.status !=="pending" && 
        (
      <textarea
        id="description"
        className="w-full h-40 p-4  border  border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Log note here"
        value={ report.status !=="resolved" ? lognote : report.adminNote} 
        onChange={handleLognote}
        style={report.status =="resolved" ? {cursor:"not-allowed"} : {display:"block"}}
        readOnly ={report.status === "resolved"}
      ></textarea>)
      }
    </section>
    
    <ul className="flex" style={{ justifyContent: "center"  }}>
          <li><button className={` cursor-not-allowed button-disabled px-4 py-2   ${
            report.status === "pending" ? "bg-gray-500 text-white" : "bg-gray-400"
          }`} >Pending</button></li>
          <li><button className={`cursor-not-allowed button-disabled px-4 py-2  ${
            report.status === "reviewed" ? "bg-yellow-500 text-green" : "bg-gray-400"
          }`}>Reviewed</button></li>
          <li><button className={` cursor-not-allowed button-disabled px-4 py-2   ${
            report.status === "resolved" ? "bg-green-500 text-white" : "bg-gray-400"
          }`}>Resolved</button></li> 
        </ul>
    </div>
  );
}
