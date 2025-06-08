"use client";
import ThreadCard from "@/components/cards/ThreadCard";
import { Thread } from "@/types/threadType";

export default function ThreadsBlock({
  parent,
  child,
}: {
  parent: Thread;
  child: Thread;
}) {
  return (
    <section className="no-scrollbar relative mt-10 flex max-h-[80vh] flex-col gap-10 overflow-auto">
      <ThreadCard
        key={parent._id}
        data={parent}
        threadUrl={`http://localhost:3000/thread/${parent._id}`}
      />

      <div className="my-10">
        <div
          key={child._id}
          className="flex justify-around items-between gap-2"
        >
          <div className="flex">
            <div className="border-r-4 h-[100px] w-4"></div>
            <div className="border-b-4 h-[100px] w-4"></div>
          </div>
          <ThreadCard
            className="!w-[90%] border-l-4 border-blue-200 rounded-md p-3 mt-2"
            threadUrl={`http://localhost:3000/thread/${child._id}`}
            data={child}
          />
        </div>
      </div>
    </section>
  );
}
