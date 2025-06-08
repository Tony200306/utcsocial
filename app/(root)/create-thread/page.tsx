"use client";
import useUserStore from "@/store/useUserStore";
import CreateThreadForm  from "@/components/cards/CreateThreadCard";

  const  Page = () =>{
    const user = useUserStore((state) => state?.user);

    if (!user) return null;
    // fetch organization list created by user
    return (
      <>
        <h1 className='head-text'>Create Thread</h1>
        <CreateThreadForm isRely={false} parentId="" isDialog={false} />
      </>
    );
  }

  export default Page;
