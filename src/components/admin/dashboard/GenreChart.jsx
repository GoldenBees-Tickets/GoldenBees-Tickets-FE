import React from "react";
import { Card, Space } from "antd";
import { MdOutlineTheaterComedy } from "react-icons/md";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Màu sắc cho biểu đồ
const COLORS = ["#FF5252", "#FFCA28", "#4CAF50", "#2196F3", "#9C27B0"];

export default function GenreChart({ genreChartData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card
        className="h-full"
        title={
          <Space size="middle">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <MdOutlineTheaterComedy className="text-xl" />
            </div>
            <span className="font-bold text-gray-800">
              Thể loại phim được quan tâm nhiều nhất
            </span>
          </Space>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} phim`,
                  props.payload.name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 