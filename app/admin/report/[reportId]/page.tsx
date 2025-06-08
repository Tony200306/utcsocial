"use client";
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getReportById ,updateReportStatus } from "@/apis/admin";
import { getUserById } from "@/apis/user";
import { clear } from "console";

export  default function ReportDetailsPage({ params }: Readonly<{params:  string }>) {


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
    refetchOnWindowFocus: false,
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
        setLognote("");
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
    <Card  className="w-[350px] mb-10" style={{marginLeft: '350px',width: '800px'}}>
        {
        (<ul className="flex" style={{ justifyContent: "center"  }}>
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
        )
    }

{report.status!=="pending" && report.status!=="resolved" &&(
    <button onClick={() => handleStatus("setDraft")} style={{height:"50px" ,marginLeft:'70px',float:'left' }}  className="mr-5 px-4 rounded bg-gray-600 text-white hover:text-black  hover:bg-yellow-600">
                SET TO DRAFT
      </button>
 )}
    <button onClick={() => handleStatus("upDate" )} style={{height:"50px" ,marginRight:'70px' ,float:'right'  }} className={`px-4 py-2 rounded mr-2 hover:bg-black hover:text-white ${getButtonClass(
        nextStatusReport
      )}`}>
                  {nextStatusReport}
      </button>
      <CardHeader style={{clear:'both'}}>
        <CardTitle>Report Detail</CardTitle>
        <CardDescription>The more information of the report </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label  htmlFor="name">Report ID:</Label>
              <Input value={report?._id} disabled id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label  htmlFor="name">Reported By:</Label>
              <Input value={report.reportedBy?.username} disabled id="name" placeholder="Name of your project" />
            </div><div className="flex flex-col space-y-1.5">
              <Label  htmlFor="name">Reason:</Label>
              <Input value={report.reason} disabled id="name" placeholder="Name of your project" />
            </div><div className="flex flex-col space-y-1.5">
              <Label  htmlFor="name">Status:</Label>
              <Input value={report.status} disabled id="name" placeholder="Name of your project" />
            </div><div className="flex flex-col space-y-1.5">
              <Label  htmlFor="name">Created At:</Label>
              <Input value={new Date(report.createdAt).toLocaleDateString()} disabled id="name" placeholder="Name of your project" />
            </div>
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </form>
      </CardContent>


      <CardHeader>
        <CardTitle>Content Detail</CardTitle>
        <CardDescription>The more information of the report content </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            
            {report?.contentType === "Thread" ?(<div className="flex flex-col space-y-1.5"> 
                <Label  htmlFor="name">Thread ID:</Label>
              <Input value={report._id} disabled id="name" placeholder="Name of your project"/>
              <Label  htmlFor="name">Posted By:</Label>
              {postedByUser ? (<div className="flex">
              <Input  style={{ width: '400px' }}  value={postedByUser.username} disabled id="name" placeholder="Name of your project"/>
              <img src={postedByUser.profilePic} alt="User Avatar" className="ml-20 rounded-md m-30 w-40 h-40" />
              </div>): <></>}
              <Label  htmlFor="name">Content:</Label>
              <Input value={report.content.text} disabled id="name" placeholder="Name of your project"/>
              
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
              </div>):<></>}
            {report?.contentType === "User" ?(<div className="flex flex-col space-y-1.5"> 
                <Label  htmlFor="name">Report ID:</Label>
              <Input value={report.content._id} disabled id="name" placeholder="Name of your project"/>
              
              <Label  htmlFor="name">Username:</Label>
              <Input value={report.content.username} disabled id="name" placeholder="Name of your project"/>
              
              <Label  htmlFor="name">Email:</Label>
              <Input value={report.content.email} disabled id="name" placeholder="Name of your project"/>
              </div>):<></>}
            
        </div>  
              {report.status !=="pending" && 
        (
      <textarea
        id="description"
        className="mt-10 mb-10 w-full h-40 p-4  border  border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        placeholder="Log note here"
        value={ report.status !=="resolved" ? lognote : report.adminNote} 
        onChange={handleLognote}
        style={ report.status =="resolved" ? {cursor:"not-allowed"} : {display:"block"}}
        readOnly ={report.status === "resolved"}
        disabled={report.status === "resolved"}
      ></textarea>)
      }
              <Label  htmlFor="name" style={{marginTop:'20px', marginBottom:'20px'}}>Admin action :</Label>

{report.status === "reviewed"  &&allActions.map((action, index) => (
          <Select 
            key={index}
            value={action}
            onValueChange={(value) => handleSelectAction(index, value)}>
            <SelectTrigger style={{width:"160px",margin:"20px 10px"}}>     
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem   value="none">...</SelectItem>
              <SelectItem value="suspendAccount">Suspend Account</SelectItem>
              {report.contentType === "Thread" && <SelectItem value="hideThread">Hide Thread</SelectItem>}
            </SelectContent>
          </Select>
        ))}
        {report.status === "resolved"  && report.adminAction.map((action, index) => (
          <Select 
            key={index}
            value={action}
            onValueChange={(value) => handleSelectAction(index, value)}>
            <SelectTrigger disabled style={{width:"160px",margin:"20px 10px"}}>     
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem   value="none">...</SelectItem>
              <SelectItem value="suspendAccount">Suspend Account</SelectItem>
              {report.contentType === "Thread" && <SelectItem value="hideThread">Hide Thread</SelectItem>}
            </SelectContent>
          </Select>
        ))}
    </form>
        </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
    </Card>
  )
}
