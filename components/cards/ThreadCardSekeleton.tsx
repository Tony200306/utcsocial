import React from "react";

export default function ThreadCardSekeleton() {
  return (
    <article
      className={`flex w-full flex-col rounded-xl 
      bg-light-1 p-7 shadow-lg brightness-105 dark:bg-dark-2
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <div className="skeleton relative size-11 rounded-full"></div>
            <div className="relative mt-2 w-0.5 grow rounded-full bg-slate-300 dark:bg-neutral-800" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex justify-between">
              <div className="flex w-fit items-center">
                <div className="skeleton h-6 w-36 rounded"></div>
                <span className="skeleton ml-3 h-4 w-16 rounded"></span>
              </div>
              <div className="skeleton size-8 rounded-full"></div>
            </div>
            <div className="skeleton mt-2 h-4 w-full pb-3"></div>
            <div className="skeleton mt-2 h-4 w-3/4 pb-3"></div>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <div className="skeleton h-8 w-16 rounded-full"></div>
                <div className="skeleton h-8 w-16 rounded-full"></div>
                <div className="skeleton h-8 w-16 rounded-full"></div>
                <div className="skeleton size-8 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
