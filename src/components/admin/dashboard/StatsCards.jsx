import React from "react";
import { Row, Col, Card, Space, Statistic, Badge, Progress, Tag } from "antd";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaTicketAlt,
  FaFilm,
  FaPercentage,
} from "react-icons/fa";
import { MdLocalMovies } from "react-icons/md";

export default function StatsCards({
  totalRevenue,
  totalOrders,
  totalMovies,
  totalCinemas,
  totalBranches,
  paidOrders,
  movieStats,
  formatCurrency,
}) {
  return (
    <Row gutter={[16, 16]} className="mb-8">
      {/* Tổng doanh thu */}
      <Col xs={24} sm={12} lg={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="h-full overflow-hidden"
            styles={{ body: { padding: "20px", position: "relative" } }}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-bl-full -z-10"></div>
            <Space direction="vertical" className="w-full">
              <Space align="center" className="w-full justify-between">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Tổng doanh thu
                </span>
                <div className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md">
                  <FaChartLine className="text-white text-xl" />
                </div>
              </Space>
              <Statistic
                value={totalRevenue}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{
                  fontWeight: "bold",
                  fontSize: "1.75rem",
                  color: "#10b981",
                }}
              />
              <div className="flex items-center text-green-600 font-medium">
                <Badge status="success" />
                <span className="mr-1">8.2%</span>
                <FaPercentage className="text-xs" />
                <span className="ml-1 text-sm">so với tháng trước</span>
              </div>
              <Progress
                percent={82}
                size="small"
                strokeColor={{
                  from: "#10b981",
                  to: "#059669",
                }}
                showInfo={false}
                className="mt-2"
              />
            </Space>
          </Card>
        </motion.div>
      </Col>

      {/* Tổng đơn hàng */}
      <Col xs={24} sm={12} lg={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            className="h-full overflow-hidden"
            styles={{ body: { padding: "20px", position: "relative" } }}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-bl-full -z-10"></div>
            <Space direction="vertical" className="w-full">
              <Space align="center" className="w-full justify-between">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Tổng đơn hàng
                </span>
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md">
                  <FaTicketAlt className="text-white text-xl" />
                </div>
              </Space>
              <Statistic
                value={totalOrders}
                valueStyle={{
                  fontWeight: "bold",
                  fontSize: "1.75rem",
                  color: "#3b82f6",
                }}
              />
              <div className="flex items-center text-blue-600 font-medium">
                <Badge status="processing" />
                <span className="mr-1">
                  {Math.round((paidOrders / (totalOrders || 1)) * 100)}%
                </span>
                <FaPercentage className="text-xs" />
                <span className="ml-1 text-sm">đã thanh toán</span>
              </div>
              <Progress
                percent={Math.round((paidOrders / (totalOrders || 1)) * 100)}
                size="small"
                strokeColor={{
                  from: "#3b82f6",
                  to: "#4f46e5",
                }}
                showInfo={false}
                className="mt-2"
              />
            </Space>
          </Card>
        </motion.div>
      </Col>

      {/* Phim */}
      <Col xs={24} sm={12} lg={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card
            className="h-full overflow-hidden"
            styles={{ body: { padding: "20px", position: "relative" } }}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-bl-full -z-10"></div>
            <Space direction="vertical" className="w-full">
              <Space align="center" className="w-full justify-between">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Phim
                </span>
                <div className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-md">
                  <FaFilm className="text-white text-xl" />
                </div>
              </Space>
              <Statistic
                value={totalMovies}
                valueStyle={{
                  fontWeight: "bold",
                  fontSize: "1.75rem",
                  color: "#f59e0b",
                }}
              />
              <div className="flex gap-2 mt-1">
                <Tag
                  color="success"
                  className="rounded-full px-3 whitespace-nowrap"
                >
                  {movieStats.nowShowing} đang chiếu
                </Tag>
                <Tag
                  color="warning"
                  className="rounded-full px-3 whitespace-nowrap"
                >
                  {movieStats.comingSoon} sắp chiếu
                </Tag>
              </div>
              <Progress
                percent={(movieStats.nowShowing / (totalMovies || 1)) * 100}
                size="small"
                strokeColor={{
                  from: "#f59e0b",
                  to: "#d97706",
                }}
                showInfo={false}
                className="mt-2"
              />
            </Space>
          </Card>
        </motion.div>
      </Col>

      {/* Rạp chiếu */}
      <Col xs={24} sm={12} lg={6}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card
            className="h-full overflow-hidden"
            styles={{ body: { padding: "20px", position: "relative" } }}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-bl-full -z-10"></div>
            <Space direction="vertical" className="w-full">
              <Space align="center" className="w-full justify-between">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                  Rạp chiếu
                </span>
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-md">
                  <MdLocalMovies className="text-white text-xl" />
                </div>
              </Space>
              <Statistic
                value={totalCinemas}
                valueStyle={{
                  fontWeight: "bold",
                  fontSize: "1.75rem",
                  color: "#8b5cf6",
                }}
              />
              <Tag color="purple" className="rounded-full px-3">
                {totalBranches} chi nhánh
              </Tag>
              <Progress
                percent={(totalCinemas / 20) * 100} // Giả định mục tiêu là 20 rạp
                size="small"
                strokeColor={{
                  from: "#8b5cf6",
                  to: "#7c3aed",
                }}
                showInfo={false}
                className="mt-2"
              />
            </Space>
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
} 