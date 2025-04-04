import { useState, useEffect, useMemo } from "react";
import { FiUsers, FiFilm, FiDollarSign, FiTrendingUp, FiCalendar, FiMessageCircle } from "react-icons/fi";
import { BiSolidCoupon, BiMoviePlay } from "react-icons/bi";
import { MdEventSeat, MdFastfood, MdTheaters, MdOutlineLocalMovies } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { LineChart, Line } from 'recharts';
import PropTypes from 'prop-types';
import { useGetAllChatHistoriesQuery } from '@/api/chatHistoryApi';
import { Link } from 'react-router-dom';

// Dữ liệu mẫu
const revenueData = [
  { name: 'T1', doanhthu: 4000, veban: 2400 },
  { name: 'T2', doanhthu: 3000, veban: 1398 },
  { name: 'T3', doanhthu: 2000, veban: 9800 },
  { name: 'T4', doanhthu: 2780, veban: 3908 },
  { name: 'T5', doanhthu: 1890, veban: 4800 },
  { name: 'T6', doanhthu: 2390, veban: 3800 },
  { name: 'T7', doanhthu: 3490, veban: 4300 },
];

const genreData = [
  { name: 'Hành động', value: 35 },
  { name: 'Tình cảm', value: 25 },
  { name: 'Hài', value: 20 },
  { name: 'Kinh dị', value: 15 },
  { name: 'Khoa học', value: 5 },
];

// Tự động tạo dữ liệu giả cho biểu đồ hình tròn phân loại khán giả
const audienceData = [
  { name: '18-24', value: 30 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 20 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Futuristic 3D Card Component with Light Theme
const Neo3DCard = ({ children, bgColor = "#ffffff", height = "auto", shadow = true }) => (
  <div
    className={`relative overflow-hidden rounded-2xl ${shadow ? 'shadow-md' : ''}`}
    style={{
      backgroundColor: bgColor,
      height
    }}
  >
    <div className="h-full">
      {children}
    </div>
  </div>
);

Neo3DCard.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  height: PropTypes.string,
  shadow: PropTypes.bool
};

// Stat Component for Light Theme
const StatBadge = ({ icon: Icon, title, value, trend, color }) => (
  <div className="relative overflow-hidden">
    <Neo3DCard bgColor="white">
      <div className="flex items-center p-4 gap-4">
        <div className={`p-3 rounded-full`} style={{ 
          background: `${color}15`,
        }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold" style={{ color }}>{value}</h3>
          <p className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs tháng trước
          </p>
        </div>
      </div>
    </Neo3DCard>
  </div>
);

StatBadge.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  trend: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export default function Dashboard() {
  const [selectedTime, setSelectedTime] = useState("week");
  const [chatStats, setChatStats] = useState({ total: 0, increase: 0 });
  
  const { data: chatHistoriesData } = useGetAllChatHistoriesQuery();

  // Xử lý dữ liệu chat khi có dữ liệu từ API
  useEffect(() => {
    if (chatHistoriesData?.data && Array.isArray(chatHistoriesData.data)) {
      const totalMessages = chatHistoriesData.data.length;
      setChatStats({
        total: totalMessages,
        increase: 10
      });
    }
  }, [chatHistoriesData]);

  // Memoize các gradient definitions để tránh re-render
  const pieGradients = useMemo(() => (
    COLORS.map((color, index) => (
      <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
      </linearGradient>
    ))
  ), []);

  const barGradients = useMemo(() => (
    audienceData.map((_, index) => (
      <linearGradient key={`barGrad-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7} />
        <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.5} />
      </linearGradient>
    ))
  ), []);

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800 p-6">
     
      
      {/* Filter/Time Selection Panel - Sticky below header */}
      <div className="sticky top-0 z-0 bg-white shadow-sm rounded-lg mb-8 p-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-3">
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-700 text-sm"
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="year">365 ngày qua</option>
            </select>
            <button
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 text-sm"
            >
              <FiCalendar className="inline-block mr-1" /> Chọn thời gian
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Side - Stats Column */}
        <div className="col-span-12 md:col-span-3 space-y-5">
          {/* Stats */}
          <StatBadge
            icon={FiDollarSign}
            title="DOANH THU"
            value="125.6M VNĐ"
            trend={12.5}
            color="#3b82f6"
          />
          <StatBadge
            icon={MdEventSeat}
            title="VÉ ĐÃ BÁN"
            value="1,234"
            trend={-2.4}
            color="#ec4899"
          />
          <StatBadge
            icon={FiUsers}
            title="KHÁCH HÀNG MỚI"
            value="854"
            trend={8.2}
            color="#10b981"
          />
          <StatBadge
            icon={BsChatDots}
            title="TƯ VẤN"
            value={chatStats.total.toString()}
            trend={chatStats.increase}
            color="#8b5cf6"
          />
          
          {/* Genre Pie Chart */}
          <Neo3DCard bgColor="white" height="280px">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-indigo-600 mb-3">PHÂN LOẠI THỂ LOẠI</h3>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {pieGradients}
                    </defs>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {genreData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#pieGradient${index})`} stroke={COLORS[index % COLORS.length]} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        color: '#1e40af',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e7ff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Neo3DCard>
        </div>
        
        {/* Main content - Featured Large Chart */}
        <div className="col-span-12 md:col-span-9 space-y-5">
          {/* Featured 3D Revenue Chart - LARGE */}
          <Neo3DCard bgColor="white" height="400px">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-700">DOANH THU TOÀN HỆ THỐNG</h3>
                <div className="flex space-x-2">
                  <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-700 text-xs">Doanh thu</span>
                  <span className="px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 text-xs">Vé bán ra</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="areaRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                      </linearGradient>
                      <linearGradient id="areaTickets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        color: '#1e3a8a',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #dbeafe'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="doanhthu" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#areaRevenue)" 
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="veban" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#areaTickets)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Neo3DCard>
          
          {/* Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Neo3DCard bgColor="white" height="250px">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-indigo-700">PHIM HOT NHẤT</h3>
                  <BiMoviePlay className="text-indigo-600" />
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Phim A", value: "458 vé", percent: 100 },
                    { name: "Phim B", value: "385 vé", percent: 84 },
                    { name: "Phim C", value: "256 vé", percent: 56 },
                    { name: "Phim D", value: "189 vé", percent: 41 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.name}</span>
                        <span className="text-indigo-700">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Neo3DCard>
            
            <Neo3DCard bgColor="white" height="250px">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-pink-700">COMBO BÁN CHẠY</h3>
                  <MdFastfood className="text-pink-600" />
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Combo 1 - Đôi", value: "125", percent: 100 },
                    { name: "Combo 2 - Gia đình", value: "98", percent: 78 },
                    { name: "Combo 3 - Đơn", value: "76", percent: 61 },
                    { name: "Combo 4 - Nhóm", value: "62", percent: 50 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.name}</span>
                        <span className="text-pink-700">{item.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-pink-500"
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Neo3DCard>
            
            <Neo3DCard bgColor="white" height="250px">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-blue-700">CHUYỂN ĐỔI KHÁCH</h3>
                  <FiUsers className="text-blue-600" />
                </div>
                
                <div className="flex items-center justify-center h-[160px]">
                  <div className="relative w-40 h-40">
                    {/* Static Ring for better performance */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset="87.92"
                        stroke="url(#gradientBlue)"
                        className="transform -rotate-90 origin-center"
                      />
                      <defs>
                        <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">65%</span>
                      <span className="text-xs text-blue-500 mt-1">Tỷ lệ chuyển đổi</span>
                    </div>
                  </div>
                </div>
              </div>
            </Neo3DCard>
          </div>
          
          {/* Audience Demographics Chart */}
          <Neo3DCard bgColor="white" height="300px">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-cyan-700 mb-3">PHÂN BỐ ĐỘ TUỔI KHÁN GIẢ</h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={audienceData} barCategoryGap="30%">
                    <defs>
                      {barGradients}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        color: '#0e7490',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0f2fe'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                    >
                      {audienceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Neo3DCard>
        </div>
      </div>
      
      {/* Footer with Action Button */}
      <div className="flex justify-end mt-6">
        <Link to="/admin/chat-history">
          <button className="flex items-center px-6 py-2.5 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition-all">
            <BsChatDots className="mr-2" />
            Xem lịch sử tư vấn chi tiết
            <span className="ml-2">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
