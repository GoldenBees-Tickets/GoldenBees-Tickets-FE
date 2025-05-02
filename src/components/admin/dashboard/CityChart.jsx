import React from "react";
import { Card, Space } from "antd";
import { MdLocalMovies } from "react-icons/md";
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

export default function CityChart({ cinemaByCity }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card
        className="h-full"
        title={
          <Space size="middle">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <MdLocalMovies className="text-xl" />
            </div>
            <span className="font-bold text-gray-800">
              Rạp chiếu theo thành phố
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
              data={cinemaByCity}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#e0e0e0" }}
                tickLine={{ stroke: "#e0e0e0" }}
              />
              <Tooltip
                formatter={(value) => [`${value} rạp`, "Số lượng"]}
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ fill: "rgba(130, 202, 157, 0.1)" }}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: 10 }}
              />
              <Bar
                dataKey="value"
                name="Số lượng rạp"
                fill="#9C27B0"
                radius={[0, 6, 6, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 