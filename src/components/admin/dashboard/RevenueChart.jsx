import React from "react";
import { Card, Space, Button } from "antd";
import { FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export default function RevenueChart({ 
  revenueByTime, 
  timeFrame, 
  setTimeFrame, 
  formatCurrency 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="h-full"
        title={
          <Space size="middle">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <FaCalendarAlt className="text-xl" />
            </div>
            <span className="font-bold text-gray-800">
              Doanh thu theo thời gian
            </span>
          </Space>
        }
        extra={
          <Space className="bg-gray-100 p-1 rounded-lg">
            <Button
              type={timeFrame === "day" ? "primary" : "text"}
              size="small"
              onClick={() => setTimeFrame("day")}
              className={timeFrame !== "day" ? "text-gray-600" : ""}
            >
              Ngày
            </Button>
            <Button
              type={timeFrame === "month" ? "primary" : "text"}
              size="small"
              onClick={() => setTimeFrame("month")}
              className={timeFrame !== "month" ? "text-gray-600" : ""}
            >
              Tháng
            </Button>
            <Button
              type={timeFrame === "year" ? "primary" : "text"}
              size="small"
              onClick={() => setTimeFrame("year")}
              className={timeFrame !== "year" ? "text-gray-600" : ""}
            >
              Năm
            </Button>
          </Space>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueByTime}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#FF5252"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#FF5252"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}M`
                    : value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : value
                }
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                formatter={(value) => [
                  `${formatCurrency(value)}`,
                  "Doanh thu",
                ]}
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{
                  stroke: "#FF5252",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: 10 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Doanh thu"
                stroke="#FF5252"
                strokeWidth={3}
                activeDot={{
                  r: 8,
                  fill: "#FF5252",
                  stroke: "white",
                  strokeWidth: 2,
                }}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 