import React, { useState, useMemo } from "react";
import { Card, Space, Button, Tabs } from "antd";
import { FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Màu sắc cho biểu đồ
const COLORS = ["#FF5252", "#4CAF50", "#2196F3", "#FFCA28", "#9C27B0"];

export default function BranchPerformanceChart({ 
  branchData, 
  cinemas, 
  orders, 
  timeFrame, 
  formatCurrency 
}) {
  const [activeTab, setActiveTab] = useState("revenue");

  // Dữ liệu cho biểu đồ doanh thu theo ngày trong tuần
  const weekdayData = useMemo(() => {
    if (!orders?.data) return [];

    const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const revenueByDay = Array(7).fill(0);
    const countByDay = Array(7).fill(0);

    orders.data.forEach(order => {
      if (order.status === "paid") {
        const orderDate = new Date(order.order_date);
        const dayIndex = orderDate.getDay(); // 0-6
        revenueByDay[dayIndex] += parseInt(order.total || 0);
        countByDay[dayIndex]++;
      }
    });

    return days.map((day, index) => ({
      name: day,
      revenue: revenueByDay[index],
      count: countByDay[index],
      average: countByDay[index] ? Math.round(revenueByDay[index] / countByDay[index]) : 0
    }));
  }, [orders]);  
  
  // Dữ liệu cho biểu đồ hiệu suất phòng chiếu
  const roomPerformanceData = useMemo(() => {
    if (!cinemas?.data || !orders?.data) return [];

    // Giả định: mỗi order có thông tin phòng chiếu
    const roomData = {};
    
    // Phân tích performance cho từng phòng
    orders.data.forEach(order => {
      // Giả định có showtimeInfo chứa thông tin phòng
      if (order.Showtime && order.Showtime.Room) {
        const roomId = order.Showtime.Room.id;
        const roomName = order.Showtime.Room.name;
        
        if (!roomData[roomId]) {
          roomData[roomId] = {
            name: roomName,
            revenue: 0,
            orderCount: 0,
            seatCount: 0,
          };
        }
        
        roomData[roomId].revenue += parseInt(order.total || 0);
        roomData[roomId].orderCount += 1;
        roomData[roomId].seatCount += (order.seats?.length || 0);
      }
    });

    return Object.values(roomData).sort((a, b) => b.revenue - a.revenue);
  }, [cinemas, orders]);


  // Render biểu đồ dựa trên tab hiện tại
  const renderChart = () => {
    switch(activeTab) {
      case "revenue":
        return (
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekdayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}M`
                    : value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : value
                  }
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tickFormatter={(value) => `${value} order`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "revenue") return [formatCurrency(value), "Doanh thu"];
                    if (name === "count") return [`${value} đơn`, "Số đơn hàng"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill="#2196F3" barSize={35} />
                <Bar yAxisId="right" dataKey="count" name="Số đơn hàng" fill="#FF5722" barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      
      case "rooms":
        // Tạo dữ liệu mới với 2 loại hiển thị riêng biệt (cho doanh thu và số đặt vé)
        const formattedRoomData = roomPerformanceData.map(room => ({
          ...room,
          // Thêm trường hiển thị mới để hiện thị trên hover
          displayRevenue: formatCurrency(room.revenue),
          displayCount: `${room.orderCount} vé`
        }));

        return (
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedRoomData}
                margin={{ top: 20, right: 60, left: 20, bottom: 5 }}
                layout="vertical"
                barSize={25}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                {/* Trục X chính hiển thị doanh thu */}
                <XAxis 
                  xAxisId="revenue"
                  type="number"
                  orientation="bottom"
                  tickFormatter={(value) => value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}M`
                    : value >= 1000
                    ? `${(value / 1000).toFixed(0)}K`
                    : value
                  }
                  label={{ value: 'Doanh thu (VNĐ)', position: 'insideBottom', offset: -5 }}
                />
                {/* Trục X thứ hai hiển thị số lượng đặt vé */}
                <XAxis 
                  xAxisId="count"
                  type="number"
                  orientation="top"
                  tickFormatter={(value) => `${value}`}
                  tickLine={{ stroke: '#9C27B0' }}
                  axisLine={{ stroke: '#9C27B0' }}
                  stroke="#9C27B0"
                  label={{ value: 'Số lượng đặt vé', position: 'insideTop', offset: -5, fill: '#9C27B0' }}
                  domain={[0, 'dataMax + 5']}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  tickLine={false}
                  axisLine={true}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                  formatter={(value, name, props) => {
                    if (name === "revenue") {
                      return [props.payload.displayRevenue, "Doanh thu"];
                    }
                    if (name === "orderCount") {
                      return [props.payload.displayCount, "Số lượng đặt vé"];
                    }
                    return [value, name];
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: 5 }}
                />
                {/* Thanh hiển thị doanh thu */}
                <Bar 
                  xAxisId="revenue"
                  dataKey="revenue" 
                  name="Doanh thu" 
                  fill="#4CAF50" 
                  radius={[0, 4, 4, 0]}
                  background={{ fill: '#eee', radius: [0, 4, 4, 0] }}
                />
                {/* Thanh hiển thị số lượng đặt vé */}
                <Bar 
                  xAxisId="count"
                  dataKey="orderCount" 
                  name="Số lượng đặt vé" 
                  fill="#9C27B0" 
                  radius={[0, 4, 4, 0]}
                  minPointSize={5}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      default:
        return null;
    }
  };

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
              <FaChartLine className="text-xl" />
            </div>
            <span className="font-bold text-gray-800">
              Phân tích hiệu suất chi nhánh
            </span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type={activeTab === "revenue" ? "primary" : "default"}
              size="small"
              onClick={() => setActiveTab("revenue")}
            >
              Doanh thu
            </Button>
            <Button
              type={activeTab === "rooms" ? "primary" : "default"}
              size="small"
              onClick={() => setActiveTab("rooms")}
            >
              Phòng chiếu
            </Button>
          </Space>
        }
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {renderChart()}
      </Card>
    </motion.div>
  );
} 