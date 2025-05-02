import React from "react";
import { Card, Space } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

export default function BranchRevenueChart({ branchRevenueData, formatCurrency }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card
        className="h-full"
        title={
          <Space size="middle">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <span className="font-bold text-gray-800">
              Doanh thu theo chi nhánh
            </span>
          </Space>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={branchRevenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
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
                cursor={{ fill: "rgba(22, 119, 255, 0.1)" }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: 10 }}
              />
              <Bar
                dataKey="revenue"
                name="Doanh thu"
                fill="#2196F3"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 