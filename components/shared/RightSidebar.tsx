"use client";
import useTriggerStore from "@/store/useTriggerStore";
import { useState , useContext } from "react";
import { User } from "@/types/userType";
import { useQuery ,useMutation} from "react-query";
import { usersIamFollowing ,top10FollowersUser, updateUserOnboarded } from "@/apis/user";
import Image from "next/image";
import { queryClient } from "@/lib/provider/reactQuery";
import UserCard from "../cards/UserCard";
import { followOrUnfollowThread } from "@/apis/user";
import { FollowContext } from "@/Context/Context"; 
export default function   RightSidebar() {
  const { LeftSidebarOpened } = useTriggerStore();
  const [topUsersST,settopUsersST ] = useState<User[]>([]);
  const [userIamfollowST, setuserIamfollowST] = useState<User[]>([]);

  const { data : topUsers } = useQuery("top10Users",top10FollowersUser, {
    onSuccess: (data) => {
      settopUsersST(data);
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });


  const { data : userIamfollow } = useQuery("userIamFollowing", usersIamFollowing, {
    onSuccess: (data) => {
      setuserIamfollowST(data);
    },
    onError: (error) => {
      console.error("Error fetching users:", error);
    },
  });



  
  return (
    <>
      {LeftSidebarOpened && (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-light-6 dark:border-l-dark-4 dark:bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden">
         

          <div className="flex flex-1 flex-col justify-start">
            <h3 className="text-heading4-medium dark:text-light-1">
              Người dùng nổi bật
              <ul className="list-none p-0 m-0 w-[350px] flex flex-col gap-5">

{topUsersST?.length === 0 ? (
  <td colSpan={6} className="text-center py-4">Danh sách rỗng</td>

) : (

  topUsersST?.map((user) => (
    <UserCard
    
    key={user._id}
    id={user._id}
    name={user.name}
    username={user.username}
    imgUrl={user.profilePic}
    personType="User"
  />

))
)}
</ul>
    

          
<hr style={{ margin: '40px 0' }} /> {/* Khoảng cách trên và dưới đường kẻ */}

            <ul className="list-none p-0 m-0 w-[350px] flex flex-col gap-5">

{userIamfollowST?.length === 0 ? (
  <td colSpan={6} className="text-center py-4">Danh sách rỗng</td>

) : (

  userIamfollowST?.map((user) => (
    <UserCard
    isfollowed = {true}
    key={user._id}
    id={user._id}
    name={user.name}
    username={user.username}
    imgUrl={user.profilePic}
    personType="User"
  />

))
)}
</ul>

        
            </h3>
            <div className="mt-7 flex w-[350px] flex-col gap-10">
              <p className="!text-base-regular dark:text-light-3">
                No users yet
              </p>
           
            </div>
          </div>
        </section>
      )}
    </>
  );
}
