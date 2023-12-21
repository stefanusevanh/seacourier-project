import React from "react";

const StatCard = ({
  title,
  value,
  desc,
}: {
  title: string;
  value: string | JSX.Element;
  desc?: string;
}) => {
  return (
    <div className="stats shadow w-full h-full relative z-0">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value text-3xl">{value}</div>
        {desc && <div className="stat-desc">{desc}</div>}
      </div>
    </div>
  );
};

export default StatCard;
