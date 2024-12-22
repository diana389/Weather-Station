import React from "react";

interface AlertErrorProps {
  title: string;
  message: string;
}

const AlertError = ({ title, message }: AlertErrorProps) => {
  return (
      <div className="flex w-full rounded-[10px] border-l-6 border-red-light bg-red-light-5 px-7 py-8 dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
        <div className="mr-5 mt-[5px] flex h-8 w-full max-w-8 items-center justify-center rounded-md bg-red-light">
          <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#FF0000" />
            <text
                x="12"
                y="17"
                fontSize="12"
                textAnchor="middle"
                fill="white"
                fontWeight="bold"
            >
              !
            </text>
          </svg>
        </div>
        <div className="w-full">
          <h5 className="mb-4 font-bold leading-[22px] text-[#BC1C21]">
            {title}
          </h5>
          <ul>
            <li className="text-[#CD5D5D]">{message}</li>
          </ul>
        </div>
      </div>
  );
};

export default AlertError;
