import { getRepliesByUser, getThreadsByUser } from "@/apis/threads";
import { useEffect } from "react";
import { useQuery } from "react-query";
import ThreadCard from "./ThreadCard";
import ThreadsBlock from "./ThreadsBlock";

interface ThreadsTabProps {
  type: "threads" | "replies";
  currentUserId: string;
  accountId: string;
  accountType: string;
  pageNumber: number;
  dataMap: { [key: string]: any[] };
  setDataMap: React.Dispatch<React.SetStateAction<{ [key: string]: any[] }>>
}

export default function ThreadsTab({
  type,
  accountId,
  pageNumber,
  dataMap,
  setDataMap
}: ThreadsTabProps) {
  const pageSize = 5;
  const { data: tabData, isLoading } = useQuery({
    queryKey: [type, accountId, pageNumber],
    queryFn: async () => {
      if (type === "threads")
        return getThreadsByUser({ id: accountId, pageNumber, pageSize });
      if (type === "replies")
        return getRepliesByUser({ id: accountId, pageNumber, pageSize });
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (tabData?.threads) {
      console.log("Fetched data for type:", type, dataMap);
      setDataMap((prev) => ({
        ...prev,
        [type]: [...prev[type], ...tabData.threads],
      }));
    }
  }, [tabData, type]);

  const data = dataMap[type];

  if (isLoading && data.length === 0) return <div>Loading...</div>;
  if (data.length === 0) return <p className="no-result">Không có dữ liệu</p>;

  return (
    <div>
      {type === "threads" &&
        data.map((item) => (
          <ThreadCard
            key={item._id}
            data={item}
            threadUrl={`/thread/${item._id}`}
            className="mt-2"
          />
        ))}
      {type === "replies" &&
        data.map((item) => (
          <ThreadsBlock
            key={item._id}
            parent={item}
            child={item.replyFromUser}
          />
        ))}
    </div>
  );
}
