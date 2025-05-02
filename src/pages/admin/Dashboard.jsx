import React, { useState } from "react";
import { Row, Col, Spin, Typography } from "antd";
import { motion } from "framer-motion";

// Import các component con
import StatsCards from "@/components/admin/dashboard/StatsCards";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import GenreChart from "@/components/admin/dashboard/GenreChart";
import BranchRevenueChart from "@/components/admin/dashboard/BranchRevenueChart";
import CityChart from "@/components/admin/dashboard/CityChart";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";

// Import các custom hook
import {
  useDashboardData,
  useStatistics,
  useRevenueChart,
  useGenreChart,
  useBranchRevenueChart,
  useCityChart,
} from "@/components/admin/dashboard/apiHooks";

export default function Dashboard() {
  // State để chọn loại thống kê thời gian
  const [timeFrame, setTimeFrame] = useState("month"); // 'day', 'month', 'year'
  
  // Lấy thông tin user từ Redux store
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userRole = user?.role || "";
  const userId = user?.id || "";

  // Lấy dữ liệu dựa trên quyền hạn
  const { orders, branches, movies, genres, cinemas, isLoading } = useDashboardData(userRole, userId);

  // Xử lý các thống kê
  const { stats, movieStats, formatCurrency } = useStatistics(orders, movies, branches, cinemas);
  const revenueByTime = useRevenueChart(orders, timeFrame);
  const genreChartData = useGenreChart(movies, genres);
  const branchRevenueData = useBranchRevenueChart(branches, orders);
  const cinemaByCity = useCityChart(cinemas);

  if (isLoading) {
    return <Spin fullscreen tip="Đang tải dữ liệu..." />;
  }

  return (
    <div className="p-6 bg-gray-50">
      {/* Stats Cards */}
      <StatsCards
        totalRevenue={stats.totalRevenue}
        totalOrders={stats.totalOrders}
        totalMovies={stats.totalMovies}
        totalCinemas={stats.totalCinemas}
        totalBranches={stats.totalBranches}
        paidOrders={stats.paidOrders}
        movieStats={movieStats}
        formatCurrency={formatCurrency}
      />

      {/* Main Content */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Biểu đồ doanh thu theo thời gian */}
        <Col xs={24} lg={14}>
          <RevenueChart
            revenueByTime={revenueByTime}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
            formatCurrency={formatCurrency}
          />
        </Col>

        {/* Biểu đồ tròn - Phân bố thể loại phim */}
        <Col xs={24} lg={10}>
          <GenreChart genreChartData={genreChartData} />
        </Col>
      </Row>

      {/* Secondary Content */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Biểu đồ cột - Doanh thu theo chi nhánh */}
        <Col xs={24} lg={12}>
          <BranchRevenueChart
            branchRevenueData={branchRevenueData}
            formatCurrency={formatCurrency}
          />
        </Col>

        {/* Biểu đồ cột - Rạp theo thành phố */}
        <Col xs={24} lg={12}>
          <CityChart cinemaByCity={cinemaByCity} />
        </Col>
      </Row>

      {/* Recent Orders */}
      <RecentOrders
        recentOrders={orders?.data?.slice(0, 5) || []}
        formatCurrency={formatCurrency}
      />

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
        <p>
          © {new Date().getFullYear()} Golden Bees Cinema. All rights reserved.
        </p>
        <p className="mt-1 text-xs">Phiên bản 1.0.0</p>
      </div>
    </div>
  );
} 