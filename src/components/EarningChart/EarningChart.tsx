import React, { useRef, useEffect, useState } from "react";
import type { ChartData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function EarningChart({
  title,
  labels,
  xLabelNames,
  dataYs,
  lineColors,
}: {
  title: string;
  labels: string[];
  xLabelNames: string[];
  dataYs: number[][];
  lineColors: string[];
}) {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    const data = {
      labels,
      datasets: xLabelNames.map((xLabelName, idx) => {
        return {
          label: xLabelName,
          data: dataYs[idx],
        };
      }),
    };

    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const chartData = {
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        borderColor: lineColors,
      })),
    };

    setChartData(chartData);
  }, []);

  return (
    <Chart
      ref={chartRef}
      type="line"
      data={chartData}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: true,
            position: "right",
          },
        },
      }}
    />
  );
}
export default EarningChart;
