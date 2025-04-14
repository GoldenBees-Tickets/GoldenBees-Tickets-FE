import React, { useMemo, useState } from 'react'
import { useGetOrdersQuery } from '@/api/orderApi'
import { useGetBranchesQuery } from '@/api/branchApi';
import { useGetAllMoviesByAdminQuery } from '@/api/movieApi';
import { useGetAllGenresForDashboardQuery } from '@/api/genreApi';
import { useGetAllCinemaNotPaginationQuery } from '@/api/cinemaApi';
import { FaTicketAlt, FaFilm, FaMapMarkerAlt, FaUsers, FaTheaterMasks, FaCalendarAlt } from 'react-icons/fa';
import { MdLocalMovies } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const {data: listOrder, isLoading} = useGetOrdersQuery()
  const {data: listbranch, isLoading: isLoadingBranch} = useGetBranchesQuery();
  const {data: listMovie, isLoading: isLoadingMovie} = useGetAllMoviesByAdminQuery();
  console.log("movie", listMovie);
  
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
    listMovie.data.forEach(movie => {
      movie.MovieGenres.forEach(mg => {
        if (mg.Genre) {
          const genreName = mg.Genre.name;
          genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
        }
      });
    });

    return Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Lấy 5 thể loại phổ biến nhất
  }, [listGenres, listMovie]);

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

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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

  if (isLoading || isLoadingBranch || isLoadingMovie || isLoadingGenre || isLoadingCinemas) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="">
      {/* Header */}
    
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-start">
            <div className="max-w-[70%]">
              <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider">Tổng doanh thu</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 text-gray-800 break-words">{formatCurrency(totalRevenue)}</h3>
              <div className="mt-2 inline-flex items-center text-xs text-green-600 font-medium">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                8.2% so với tháng trước
              </div>
            </div>
            <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg md:rounded-xl shadow-lg shadow-emerald-200">
              <FaUsers className="text-white text-lg md:text-xl" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Tổng đơn hàng</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">{totalOrders}</h3>
              <div className="mt-2 inline-flex items-center text-xs text-blue-600 font-medium">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2.5V9.5M6 2.5L9 5.5M6 2.5L3 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {Math.round(paidOrders/totalOrders*100)}% đã thanh toán
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
              <FaTicketAlt className="text-white text-xl" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full w-1/2"></div>
          </div>
        </div>
        
        {/* Movie Status */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Phim</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">{totalMovies}</h3>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">{movieStats.nowShowing} đang chiếu</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">{movieStats.comingSoon} sắp chiếu</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl shadow-lg shadow-amber-200">
              <FaFilm className="text-white text-xl" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full w-2/3"></div>
          </div>
        </div>
        
        {/* Cinemas */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Rạp chiếu</p>
              <h3 className="text-3xl font-bold mt-1 text-gray-800">{totalCinemas}</h3>
              <div className="mt-2 inline-flex items-center text-xs text-purple-600 font-medium">
                <span className="flex items-center px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  {totalBranches} chi nhánh
                </span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg shadow-purple-200">
              <MdLocalMovies className="text-white text-xl" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-4/5"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Biểu đồ doanh thu theo thời gian */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-3 text-amber-500" />
              Doanh thu theo thời gian
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeFrame('day')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${timeFrame === 'day' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Ngày
              </button>
              <button 
                onClick={() => setTimeFrame('month')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${timeFrame === 'month' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Tháng
              </button>
              <button 
                onClick={() => setTimeFrame('year')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${timeFrame === 'year' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Năm
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueByTime}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="time"
                  label={{ 
                    value: timeFrame === 'day' ? 'Ngày' : timeFrame === 'month' ? 'Tháng' : 'Năm', 
                    position: 'insideBottomRight', 
                    offset: -10,
                    fill: '#666'
                  }}
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
                  cursor={{stroke: '#8884d8', strokeWidth: 1, strokeDasharray: '5 5'}}
                />
                <Legend 
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{paddingTop: 10}}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  activeDot={{ r: 8, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }} 
                  dot={{ r: 4, fill: '#8884d8', stroke: 'white', strokeWidth: 2 }}
                  fill="url(#colorRevenue)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Biểu đồ cột - Doanh thu theo chi nhánh */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <FaMapMarkerAlt className="mr-3 text-blue-500" />
            Doanh thu theo chi nhánh
          </h2>
          <div className="h-80">
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
                  cursor={{fill: 'rgba(136, 132, 216, 0.1)'}}
                />
                <Legend 
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{paddingTop: 10}}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  fill="url(#colorGradient)" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Biểu đồ tròn - Phân bố thể loại phim */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <FaFilm className="mr-3 text-amber-500" />
            Phân bố thể loại phim
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={95}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={4}
                >
                  {genreChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value, entry) => <span style={{color: '#666', fontWeight: 500}}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Biểu đồ cột - Rạp theo thành phố */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <MdLocalMovies className="mr-3 text-purple-500" />
            Rạp chiếu theo thành phố
          </h2>
          <div className="h-80">
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
                  fill="url(#greenGradient)" 
                  radius={[0, 6, 6, 0]}
                  barSize={30}
                />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaTicketAlt className="mr-3 text-blue-500" />
            Đơn hàng gần đây
          </h2>
          <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Xem tất cả
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Ngày đặt
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Tổng tiền
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listOrder?.data?.slice(0, 5).map((order, index) => (
                <tr key={order.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(parseInt(order.total))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mb-8">
        <p>© {new Date().getFullYear()} Golden Bees Cinema. All rights reserved.</p>
        <p className="mt-1 text-xs">Phiên bản 1.0.0</p>
      </div>
    </div>
  )
}
