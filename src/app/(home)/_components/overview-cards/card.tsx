import type { JSX, SVGProps } from "react";

type PropsType = {
  label: string;
  data: {
    value: number | string;
    growthRate: number;
    active?: number | string; 
    inactive?: number | string; 
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export function OverviewCard({ label, data, Icon }: PropsType) {
  const isDecreasing = data?.growthRate < 0;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <Icon />
      <div className="mt-6 flex flex-col gap-2">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data?.value}
          </dt>
          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>

        <div className="flex items-center justify-between gap-2">

        {/* Conditionally render Active and Inactive counts if present */}
        {data?.active !== undefined && (
          <p className="text-sm font-medium text-green-600">
            Active: {data?.active}
          </p>
        )}
        {data.inactive !== undefined && (
          <p className="text-sm font-medium text-red-600">
            Inactive: {data?.inactive}
          </p>
        )}
        </div>
      </div>
    </div>
  );
}
