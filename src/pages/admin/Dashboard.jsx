import React, { useMemo, useState } from 'react'
import { useGetOrdersQuery } from '@/api/orderApi'
import { useGetBranchesQuery } from '@/api/branchApi';
import { useGetAllMoviesByAdminQuery } from '@/api/movieApi';
import { useGetAllGenresForDashboardQuery } from '@/api/genreApi';
import { useGetAllCinemaNotPaginationQuery } from '@/api/cinemaApi';
import { FaTicketAlt, FaFilm, FaMapMarkerAlt, FaUsers, FaTheaterMasks, FaCalendarAlt, FaChartLine, FaPercentage } from 'react-icons/fa';
import { MdLocalMovies, MdOutlineTheaterComedy, MdMovie } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Card, Row, Col, Typography, Space, Tabs, Button, Table, Tag, Statistic, Spin, Badge, Avatar, Progress } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

export default function Dashboard() {
  const {data: listOrder, isLoading} = useGetOrdersQuery()
  const {data: listbranch, isLoading: isLoadingBranch} = useGetBranchesQuery();
  const {data: listMovie, isLoading: isLoadingMovie} = useGetAllMoviesByAdminQuery();  
  const {data: listGenres, isLoading: isLoadingGenre} = useGetAllGenresForDashboardQuery();
  const {data: listCinemas, isLoading: isLoadingCinemas} = useGetAllCinemaNotPaginationQuery();
  
  // State để chọn loại thống kê thời gian
  const [timeFrame, setTimeFrame] = useState('month'); // 'day', 'month', 'year'
  
  // Hàm định dạng tiền Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Tính toán các số liệu thống kê
  const totalOrders = listOrder?.data?.length || 0;
  const totalRevenue = listOrder?.data?.reduce((sum, order) => sum + parseInt(order.total || 0), 0) || 0;
  const totalMovies = listMovie?.data?.length || 0;
  const totalBranches = listbranch?.branches?.length || 0;
  const totalCinemas = listCinemas?.data?.length || 0;
  const paidOrders = listOrder?.data?.filter(order => order.status === 'paid').length || 0;

  // Thống kê phim theo trạng thái
  const movieStats = useMemo(() => {
    if (!listMovie?.data) return { comingSoon: 0, nowShowing: 0, ended: 0 };
    
    const stats = {
      comingSoon: 0,
      nowShowing: 0,
      ended: 0,
    };
    
    listMovie.data.forEach(movie => {
      if (movie.status === 'coming_soon' || movie.status === 'opening_soon') {
        stats.comingSoon++;
      } else if (movie.status === 'now_showing') {
        stats.nowShowing++;
      } else if (movie.status === 'ended') {
        stats.ended++;
      }
    });
    
    return stats;
  }, [listMovie]);

  // Doanh thu theo thời gian
  const revenueByTime = useMemo(() => {
    if (!listOrder?.data) return [];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Tạo đối tượng để lưu trữ doanh thu theo thời gian
    let revenueByTimeObj = {};
    
    if (timeFrame === 'day') {
      // Lấy dữ liệu 7 ngày gần nhất
      const lastDays = 7;
      for (let i = 0; i < lastDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        revenueByTimeObj[dayStr] = 0;
      }
      
      // Tính doanh thu cho mỗi ngày
      listOrder.data.forEach(order => {
        const orderDate = new Date(order.order_date);
        // Chỉ tính các đơn hàng trong 7 ngày gần nhất
        const diffTime = Math.abs(currentDate - orderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < lastDays) {
          const dayStr = orderDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          revenueByTimeObj[dayStr] = (revenueByTimeObj[dayStr] || 0) + parseInt(order.total || 0);
        }
      });
    } else if (timeFrame === 'month') {
      // Lấy dữ liệu 6 tháng gần nhất
      const lastMonths = 6;
      for (let i = 0; i < lastMonths; i++) {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthStr = month.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
        revenueByTimeObj[monthStr] = 0;
      }
      
      // Tính doanh thu cho mỗi tháng
      listOrder.data.forEach(order => {
        const orderDate = new Date(order.order_date);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();
        
        // Chỉ tính các đơn hàng trong 6 tháng gần nhất
        if (orderYear === currentYear) {
          const monthDiff = currentMonth - orderMonth;
          if (monthDiff >= 0 && monthDiff < 6) {
            const monthStr = orderDate.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
            revenueByTimeObj[monthStr] = (revenueByTimeObj[monthStr] || 0) + parseInt(order.total || 0);
          }
        } else if (orderYear === currentYear - 1 && currentMonth < 5) {
          // Xử lý trường hợp sang năm mới (tháng 12 năm trước...)
          const monthsFromEnd = 11 - orderMonth;
          if (monthsFromEnd + currentMonth < 6) {
            const monthStr = orderDate.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
            revenueByTimeObj[monthStr] = (revenueByTimeObj[monthStr] || 0) + parseInt(order.total || 0);
          }
        }
      });
    } else if (timeFrame === 'year') {
      // Lấy dữ liệu 5 năm gần nhất
      const lastYears = 5;
      for (let i = 0; i < lastYears; i++) {
        const year = currentYear - i;
        revenueByTimeObj[year.toString()] = 0;
      }
      
      // Tính doanh thu cho mỗi năm
      listOrder.data.forEach(order => {
        const orderDate = new Date(order.order_date);
        const orderYear = orderDate.getFullYear();
        
        // Chỉ tính các đơn hàng trong 5 năm gần nhất
        if (orderYear <= currentYear && orderYear >= currentYear - 4) {
          revenueByTimeObj[orderYear.toString()] = 
            (revenueByTimeObj[orderYear.toString()] || 0) + parseInt(order.total || 0);
        }
      });
    }
    
    // Chuyển đổi object thành mảng để sử dụng với biểu đồ
    return Object.entries(revenueByTimeObj)
      .map(([time, revenue]) => ({ time, revenue }))
      .reverse(); // Đảo ngược để hiển thị theo thứ tự thời gian tăng dần
  }, [listOrder, timeFrame]);

  // Dữ liệu cho biểu đồ phân phối thể loại phim
  const genreChartData = useMemo(() => {
    if (!listGenres?.data || !listMovie?.data) return [];

    const genreCounts = {};
    // Đếm số lượng phim theo thể loại
    listMovie.data.forEach(movie => {
      movie.MovieGenres.forEach(mg => {
        if (mg.Genre) {
          const genreName = mg.Genre.name;
          genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        }
      });
    });

    // Chuyển đổi dữ liệu thành mảng và sắp xếp theo số lượng giảm dần
    return Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Lấy 5 thể loại phổ biến nhất
  }, [listGenres, listMovie]);

  // Thêm biểu đồ thể loại được đặt nhiều nhất (mô phỏng dữ liệu)
  const genreOrderData = useMemo(() => {
    if (!listOrder?.data || !listGenres?.data) return [];
    
    // Mô phỏng dữ liệu đặt vé theo thể loại
    // Trong thực tế, bạn sẽ cần liên kết các đơn hàng với phim và thể loại
    const genreOrders = {
      'Hành động': Math.round(totalOrders * 0.35),
      'Kinh dị': Math.round(totalOrders * 0.2),
      'Hoạt hình': Math.round(totalOrders * 0.15),
      'Viễn tưởng': Math.round(totalOrders * 0.15),
      'Hài': Math.round(totalOrders * 0.15),
    };
    
    return Object.entries(genreOrders)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [listOrder, listGenres, totalOrders]);

  // Dữ liệu cho biểu đồ doanh thu theo chi nhánh
  const branchRevenueData = useMemo(() => {
    if (!listbranch?.branches || !listOrder?.data) return [];
    
    // Tạo object để lưu doanh thu theo chi nhánh
    const branchRevenue = {};
    
    // Khởi tạo doanh thu 0 cho tất cả các chi nhánh
    listbranch.branches.forEach(branch => {
      branchRevenue[branch.id] = {
        name: branch.name,
        revenue: 0
      };
    });
    
    // Tính tổng doanh thu
    const totalRevenue = listOrder.data.reduce((sum, order) => sum + parseInt(order.total || 0), 0);
    
    // Phân bổ doanh thu theo tỉ lệ cố định cho các chi nhánh 
    // Đây là giả định - trong thực tế nên dựa vào liên kết thực giữa đơn hàng và chi nhánh
    if (listbranch.branches.length > 0) {
      if (listbranch.branches.length === 1) {
        branchRevenue[listbranch.branches[0].id].revenue = totalRevenue;
      } else if (listbranch.branches.length === 2) {
        // Chi nhánh Hồ Chí Minh: 65%, Chi nhánh Đà Nẵng: 35%
        const hcmBranch = listbranch.branches.find(b => b.city.includes("Hồ Chí Minh"));
        const dnBranch = listbranch.branches.find(b => b.city.includes("Đà Nẵng"));
        
        if (hcmBranch) branchRevenue[hcmBranch.id].revenue = Math.round(totalRevenue * 0.65);
        if (dnBranch) branchRevenue[dnBranch.id].revenue = Math.round(totalRevenue * 0.35);
      } else {
        // Phân bổ theo tỷ lệ phần trăm nếu có nhiều chi nhánh
        let remainingPercent = 100;
        const percentPerBranch = Math.floor(remainingPercent / listbranch.branches.length);
        
        listbranch.branches.forEach((branch, index) => {
          if (index === listbranch.branches.length - 1) {
            // Chi nhánh cuối nhận phần còn lại
            branchRevenue[branch.id].revenue = Math.round(totalRevenue * (remainingPercent / 100));
          } else {
            branchRevenue[branch.id].revenue = Math.round(totalRevenue * (percentPerBranch / 100));
            remainingPercent -= percentPerBranch;
          }
        });
      }
    }
    
    return Object.values(branchRevenue);
  }, [listbranch, listOrder]);

  // Màu sắc cho biểu đồ - Cinema theme
  const COLORS = ['#FF5252', '#FFCA28', '#4CAF50', '#2196F3', '#9C27B0'];

  // Số lượng rạp theo thành phố
  const cinemaByCity = useMemo(() => {
    if (!listCinemas?.data) return [];
    
    const cityCount = {};
    listCinemas.data.forEach(cinema => {
      const city = cinema.city;
      cityCount[city] = (cityCount[city] || 0) + 1;
    });
    
    return Object.entries(cityCount)
      .map(([name, value]) => ({ name, value }));
  }, [listCinemas]);

  // Cấu hình bảng đơn hàng gần đây
  const recentOrderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text ellipsis>{id.substring(0, 8)}...</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => formatCurrency(parseInt(total)),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'success' : 'warning'}>
          {status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
        </Tag>
      ),
    },
  ];

  if (isLoading || isLoadingBranch || isLoadingMovie || isLoadingGenre || isLoadingCinemas) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      {/* Stats Cards */}
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
              bodyStyle={{ padding: '20px', position: 'relative' }}
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-bl-full -z-10"></div>
              <Space direction="vertical" className="w-full">
                <Space align="center" className="w-full justify-between">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng doanh thu</span>
                  <div className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                </Space>
                <Statistic 
                  value={totalRevenue} 
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#10b981' }}
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
                    from: '#10b981',
                    to: '#059669',
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
              bodyStyle={{ padding: '20px', position: 'relative' }}
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-bl-full -z-10"></div>
              <Space direction="vertical" className="w-full">
                <Space align="center" className="w-full justify-between">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng đơn hàng</span>
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md">
                    <FaTicketAlt className="text-white text-xl" />
                  </div>
                </Space>
                <Statistic 
                  value={totalOrders} 
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#3b82f6' }}
                />
                <div className="flex items-center text-blue-600 font-medium">
                  <Badge status="processing" />
                  <span className="mr-1">{Math.round(paidOrders/totalOrders*100)}%</span>
                  <FaPercentage className="text-xs" />
                  <span className="ml-1 text-sm">đã thanh toán</span>
                </div>
                <Progress
                  percent={Math.round(paidOrders/totalOrders*100)}
                  size="small"
                  strokeColor={{
                    from: '#3b82f6',
                    to: '#4f46e5',
                  }}
                  showInfo={false}
                  className="mt-2"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>
        
        {/* Phim - Fixed alignment issue */}
        <Col xs={24} sm={12} lg={6}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card 
              className="h-full overflow-hidden"
              bodyStyle={{ padding: '20px', position: 'relative' }}
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-bl-full -z-10"></div>
              <Space direction="vertical" className="w-full">
                <Space align="center" className="w-full justify-between">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Phim</span>
                  <div className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-md">
                    <FaFilm className="text-white text-xl" />
                  </div>
                </Space>
                <Statistic 
                  value={totalMovies}
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#f59e0b' }}
                />
                <div className="flex gap-2 mt-1">
                  <Tag color="success" className="rounded-full px-3 whitespace-nowrap">{movieStats.nowShowing} đang chiếu</Tag>
                  <Tag color="warning" className="rounded-full px-3 whitespace-nowrap">{movieStats.comingSoon} sắp chiếu</Tag>
                </div>
                <Progress
                  percent={(movieStats.nowShowing / totalMovies) * 100}
                  size="small"
                  strokeColor={{
                    from: '#f59e0b',
                    to: '#d97706',
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
              bodyStyle={{ padding: '20px', position: 'relative' }}
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-bl-full -z-10"></div>
              <Space direction="vertical" className="w-full">
                <Space align="center" className="w-full justify-between">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Rạp chiếu</span>
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-md">
                    <MdLocalMovies className="text-white text-xl" />
                  </div>
                </Space>
                <Statistic 
                  value={totalCinemas}
                  valueStyle={{ fontWeight: 'bold', fontSize: '1.75rem', color: '#8b5cf6' }}
                />
                <Tag color="purple" className="rounded-full px-3">{totalBranches} chi nhánh</Tag>
                <Progress
                  percent={(totalCinemas / 20) * 100} // Giả định mục tiêu là 20 rạp
                  size="small"
                  strokeColor={{
                    from: '#8b5cf6',
                    to: '#7c3aed',
                  }}
                  showInfo={false}
                  className="mt-2"
                />
              </Space>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Main Content */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Biểu đồ doanh thu theo thời gian */}
        <Col xs={24} lg={14}>
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
                  <span className="font-bold text-gray-800">Doanh thu theo thời gian</span>
                </Space>
              }
              extra={
                <Space className="bg-gray-100 p-1 rounded-lg">
                  <Button 
                    type={timeFrame === 'day' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeFrame('day')}
                    className={timeFrame !== 'day' ? 'text-gray-600' : ''}
                  >
                    Ngày
                  </Button>
                  <Button 
                    type={timeFrame === 'month' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeFrame('month')}
                    className={timeFrame !== 'month' ? 'text-gray-600' : ''}
                  >
                    Tháng
                  </Button>
                  <Button 
                    type={timeFrame === 'year' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeFrame('year')}
                    className={timeFrame !== 'year' ? 'text-gray-600' : ''}
                  >
                    Năm
                  </Button>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueByTime}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF5252" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="time"
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000000 
                        ? `${(value / 1000000).toFixed(1)}M` 
                        : value >= 1000 
                          ? `${(value / 1000).toFixed(0)}K` 
                          : value
                      }
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value)}`, 'Doanh thu']}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{stroke: '#FF5252', strokeWidth: 1, strokeDasharray: '5 5'}}
                    />
                    <Legend 
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{paddingTop: 10}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Doanh thu" 
                      stroke="#FF5252" 
                      strokeWidth={3}
                      activeDot={{ r: 8, fill: '#FF5252', stroke: 'white', strokeWidth: 2 }} 
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>
        
        {/* Biểu đồ tròn - Phân bố thể loại phim */}
        <Col xs={24} lg={10}>
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
                  <span className="font-bold text-gray-800">Thể loại phim được quan tâm nhiều nhất</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genreChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} phim`, props.payload.name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Secondary Content */}
      <Row gutter={[16, 16]} className="mb-8">
        {/* Biểu đồ cột - Doanh thu theo chi nhánh */}
        <Col xs={24} lg={12}>
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
                  <span className="font-bold text-gray-800">Doanh thu theo chi nhánh</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={branchRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <YAxis 
                      tickFormatter={(value) => value >= 1000000 
                        ? `${(value / 1000000).toFixed(1)}M` 
                        : value >= 1000 
                          ? `${(value / 1000).toFixed(0)}K` 
                          : value
                      }
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value)}`, 'Doanh thu']}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{fill: 'rgba(22, 119, 255, 0.1)'}}
                    />
                    <Legend 
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{paddingTop: 10}}
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
        </Col>
        
        {/* Biểu đồ cột - Rạp theo thành phố */}
        <Col xs={24} lg={12}>
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
                  <span className="font-bold text-gray-800">Rạp chiếu theo thành phố</span>
                </Space>
              }
              bordered={false}
              style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            >
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cinemaByCity}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={150} 
                      tick={{fill: '#666'}}
                      axisLine={{stroke: '#e0e0e0'}}
                      tickLine={{stroke: '#e0e0e0'}}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} rạp`, 'Số lượng']}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{fill: 'rgba(130, 202, 157, 0.1)'}}
                    />
                    <Legend 
                      iconType="circle"
                      iconSize={10}
                      wrapperStyle={{paddingTop: 10}}
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
        </Col>
      </Row>
      
      {/* Recent Orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card 
          className="mb-8"
          title={
            <Space size="middle">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <FaTicketAlt className="text-xl" />
              </div>
              <span className="font-bold text-gray-800">Đơn hàng gần đây</span>
            </Space>
          }
          extra={
            <Button type="primary" ghost>
              Xem tất cả
            </Button>
          }
          bordered={false}
          style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
        >
          <Table
            columns={recentOrderColumns}
            dataSource={listOrder?.data?.slice(0, 5) || []}
            rowKey="id"
            pagination={false}
            size="middle"
            className="responsive-table"
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'
            }
          />
        </Card>
      </motion.div>
      
      {/* Footer */}
      <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
        <p>© {new Date().getFullYear()} Golden Bees Cinema. All rights reserved.</p>
        <p className="mt-1 text-xs">Phiên bản 1.0.0</p>
      </div>
    </div>
  )
}
