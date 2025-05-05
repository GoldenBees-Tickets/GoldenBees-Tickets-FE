import { useGetOrdersQuery, useGetOrdersByBranchQuery } from "@/api/orderApi";
import { useGetBranchesQuery } from "@/api/branchApi";
import { useGetAllMoviesByAdminQuery, useGetMoviesByBranchQuery } from "@/api/movieApi";
import { useGetAllGenresForDashboardQuery } from "@/api/genreApi";
import { useGetAllCinemaNotPaginationQuery, useGetCinemasForDashboardByBranchQuery } from "@/api/cinemaApi";
import { useMemo } from "react";
import { filterMoviesByStatus } from "@/utils/movieFilters";

// Hàm kiểm tra role
export const useDashboardData = (userRole, userId) => {
  const isAdmin = userRole === "admin";
  const isBranchAdmin = userRole === "branch_admin";

  // Orders
  const { 
    data: adminOrdersData, 
    isLoading: adminOrdersLoading 
  } = useGetOrdersQuery(undefined, { skip: !isAdmin });

  const { 
    data: branchOrdersData, 
    isLoading: branchOrdersLoading 
  } = useGetOrdersByBranchQuery(userId, { skip: !isBranchAdmin });

  // Branches
  const { 
    data: allBranchesData, 
    isLoading: allBranchesLoading 
  } = useGetBranchesQuery(undefined, { skip: !isAdmin });
  
  const { 
    data: adminBranchData, 
    isLoading: adminBranchLoading 
  } = useGetBranchesQuery(undefined, { skip: !isBranchAdmin });

  // Movies
  const { 
    data: allMoviesData, 
    isLoading: allMoviesLoading 
  } = useGetAllMoviesByAdminQuery(undefined, { skip: !isAdmin });

  const { 
    data: branchMoviesData, 
    isLoading: branchMoviesLoading 
  } = useGetMoviesByBranchQuery(userId, { skip: !isBranchAdmin });

  // Genres (chung cho cả admin và branch_admin)
  const { 
    data: genresData, 
    isLoading: genresLoading 
  } = useGetAllGenresForDashboardQuery();

  // Cinemas
  const { 
    data: allCinemasData, 
    isLoading: allCinemasLoading 
  } = useGetAllCinemaNotPaginationQuery(undefined, { skip: !isAdmin });

  const { 
    data: branchCinemasData, 
    isLoading: branchCinemasLoading 
  } = useGetCinemasForDashboardByBranchQuery(userId, { skip: !isBranchAdmin });
  
  // Tổng hợp dữ liệu
  const orders = isAdmin ? adminOrdersData : branchOrdersData;
  const branches = isAdmin ? allBranchesData : adminBranchData;
  const movies = isAdmin ? allMoviesData : branchMoviesData;
  const cinemas = isAdmin ? allCinemasData : branchCinemasData;

  // Trạng thái loading
  const isOrdersLoading = isAdmin ? adminOrdersLoading : branchOrdersLoading;
  const isBranchesLoading = isAdmin ? allBranchesLoading : adminBranchLoading;
  const isMoviesLoading = isAdmin ? allMoviesLoading : branchMoviesLoading;
  const isCinemasLoading = isAdmin ? allCinemasLoading : branchCinemasLoading;

  const isLoading = isOrdersLoading || isBranchesLoading || isMoviesLoading || genresLoading || isCinemasLoading;

  return {
    orders,
    branches,
    movies,
    genres: genresData,
    cinemas,
    isLoading
  };
};

// Xử lý dữ liệu thống kê từ dữ liệu truy vấn
export const useStatistics = (orders, movies, branches, cinemas) => {
  // Định dạng tiền Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Thống kê cơ bản
  const stats = useMemo(() => {
    return {
      totalOrders: orders?.data?.length || 0,
      totalRevenue: orders?.data?.reduce(
        (sum, order) => sum + parseInt(order.total || 0), 0
      ) || 0,
      totalMovies: movies?.data?.length || 0,
      totalBranches: branches?.branches?.length || 0,
      totalCinemas: cinemas?.data?.length || 0,
      paidOrders: orders?.data?.filter(
        (order) => order.status === "paid"
      ).length || 0,
    };
  }, [orders, movies, branches, cinemas]);

  // Thống kê phim theo trạng thái
  const movieStats = useMemo(() => {
    if (!movies?.data) return { comingSoon: 0, nowShowing: 0, ended: 0 };
    // Process movies - chuyển từ useMemo lồng nhau thành tính toán trực tiếp
    const ListMovie = movies?.data || [];
    const { nowShowingMovies, comingSoonMovies } = filterMoviesByStatus(ListMovie);
        
    // Lọc thêm phim đang chiếu, loại bỏ phim có end_date đã qua
    const currentDate = new Date();
    const filteredNowShowingMovies = nowShowingMovies.filter(movie => {
      if (!movie.end_date) return true; // Giữ lại nếu không có end_date
      const endDate = new Date(movie.end_date);
      return endDate >= currentDate; // Chỉ giữ những phim có end_date >= ngày hiện tại
    });
        
    const stats = {
      comingSoon: comingSoonMovies.length,
      nowShowing: filteredNowShowingMovies.length,
      ended: 0,
    };

    // Tính số phim đã kết thúc chiếu (phim có end_date đã qua)
    if (movies.data) {
      stats.ended = movies.data.filter(movie => {
        if (!movie.end_date) return false;
        const endDate = new Date(movie.end_date);
        const currentDate = new Date();
        return endDate < currentDate;
      }).length;
    }

    return stats;
  }, [movies]);

  return {
    stats,
    movieStats,
    formatCurrency
  };
};

// Xử lý dữ liệu biểu đồ doanh thu
export const useRevenueChart = (orders, timeFrame) => {
  return useMemo(() => {
    if (!orders?.data) return [];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Tạo đối tượng để lưu trữ doanh thu theo thời gian
    let revenueByTimeObj = {};

    if (timeFrame === "day") {
      // Lấy dữ liệu 7 ngày gần nhất
      const lastDays = 7;
      for (let i = 0; i < lastDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        revenueByTimeObj[dayStr] = 0;
      }

      // Tính doanh thu cho mỗi ngày
      orders.data.forEach((order) => {
        const orderDate = new Date(order.order_date);
        // Chỉ tính các đơn hàng trong 7 ngày gần nhất
        const diffTime = Math.abs(currentDate - orderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < lastDays) {
          const dayStr = orderDate.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          });
          revenueByTimeObj[dayStr] =
            (revenueByTimeObj[dayStr] || 0) + parseInt(order.total || 0);
        }
      });
    } else if (timeFrame === "month") {
      // Lấy dữ liệu 6 tháng gần nhất
      const lastMonths = 6;
      for (let i = 0; i < lastMonths; i++) {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthStr = month.toLocaleDateString("vi-VN", {
          month: "short",
          year: "numeric",
        });
        revenueByTimeObj[monthStr] = 0;
      }

      // Tính doanh thu cho mỗi tháng
      orders.data.forEach((order) => {
        const orderDate = new Date(order.order_date);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();

        // Chỉ tính các đơn hàng trong 6 tháng gần nhất
        if (orderYear === currentYear) {
          const monthDiff = currentMonth - orderMonth;
          if (monthDiff >= 0 && monthDiff < 6) {
            const monthStr = orderDate.toLocaleDateString("vi-VN", {
              month: "short",
              year: "numeric",
            });
            revenueByTimeObj[monthStr] =
              (revenueByTimeObj[monthStr] || 0) + parseInt(order.total || 0);
          }
        } else if (orderYear === currentYear - 1 && currentMonth < 5) {
          // Xử lý trường hợp sang năm mới (tháng 12 năm trước...)
          const monthsFromEnd = 11 - orderMonth;
          if (monthsFromEnd + currentMonth < 6) {
            const monthStr = orderDate.toLocaleDateString("vi-VN", {
              month: "short",
              year: "numeric",
            });
            revenueByTimeObj[monthStr] =
              (revenueByTimeObj[monthStr] || 0) + parseInt(order.total || 0);
          }
        }
      });
    } else if (timeFrame === "year") {
      // Lấy dữ liệu 5 năm gần nhất
      const lastYears = 5;
      for (let i = 0; i < lastYears; i++) {
        const year = currentYear - i;
        revenueByTimeObj[year.toString()] = 0;
      }

      // Tính doanh thu cho mỗi năm
      orders.data.forEach((order) => {
        const orderDate = new Date(order.order_date);
        const orderYear = orderDate.getFullYear();

        // Chỉ tính các đơn hàng trong 5 năm gần nhất
        if (orderYear <= currentYear && orderYear >= currentYear - 4) {
          revenueByTimeObj[orderYear.toString()] =
            (revenueByTimeObj[orderYear.toString()] || 0) +
            parseInt(order.total || 0);
        }
      });
    }

    // Chuyển đổi object thành mảng để sử dụng với biểu đồ
    return Object.entries(revenueByTimeObj)
      .map(([time, revenue]) => ({ time, revenue }))
      .reverse(); // Đảo ngược để hiển thị theo thứ tự thời gian tăng dần
  }, [orders, timeFrame]);
};

// Xử lý dữ liệu biểu đồ thể loại phim
export const useGenreChart = (movies, genres) => {
  return useMemo(() => {
    if (!genres?.data || !movies?.data) return [];

    const genreCounts = {};
    // Đếm số lượng phim theo thể loại
    movies.data.forEach((movie) => {
      movie.MovieGenres.forEach((mg) => {
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
  }, [genres, movies]);
};

// Hook phân tích hiệu suất chi nhánh cho admin chi nhánh
export const useBranchPerformance = (orders, cinemas, movies, timeFrame) => {
  return useMemo(() => {
    if (!orders?.data || !cinemas?.data) return null;

    // Dữ liệu phân tích theo thời gian
    const timeAnalysis = {
      totalRevenue: 0,
      avgTicketPrice: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      growthRate: 0,
      peakHours: [], // Giờ có doanh thu cao
    };

    // Dữ liệu phân tích theo phòng chiếu
    const roomAnalysis = {};
    
    // Dữ liệu phân tích theo phim 
    const movieAnalysis = {};

    // Dữ liệu phân tích theo khung giờ
    const hourlyData = Array(24).fill(0).map(() => ({ revenue: 0, count: 0 }));

    // Tính tổng doanh thu và số lượng đơn hàng
    orders.data.forEach(order => {
      if (order.status === "paid") {
        const orderTotal = parseInt(order.total || 0);
        const orderDate = new Date(order.order_date);
        const hour = orderDate.getHours();
        
        // Cập nhật thông tin tổng quan
        timeAnalysis.totalRevenue += orderTotal;
        timeAnalysis.totalOrders += 1;
        
        // Cập nhật thông tin theo giờ
        hourlyData[hour].revenue += orderTotal;
        hourlyData[hour].count += 1;
        
        // Cập nhật thông tin theo phòng chiếu
        if (order.showtime && order.showtime.room) {
          const roomId = order.showtime.room.id;
          const roomName = order.showtime.room.name;
          
          if (!roomAnalysis[roomId]) {
            roomAnalysis[roomId] = {
              id: roomId,
              name: roomName,
              revenue: 0,
              count: 0,
              seatOccupancy: 0,
              ticketCount: 0,
            };
          }
          
          roomAnalysis[roomId].revenue += orderTotal;
          roomAnalysis[roomId].count += 1;
          roomAnalysis[roomId].ticketCount += (order.seats?.length || 0);
        }
        
        // Cập nhật thông tin theo phim
        if (order.showtime && order.showtime.movie) {
          const movieId = order.showtime.movie.id;
          const movieName = order.showtime.movie.title;
          
          if (!movieAnalysis[movieId]) {
            movieAnalysis[movieId] = {
              id: movieId,
              name: movieName,
              revenue: 0,
              count: 0,
              ticketCount: 0,
            };
          }
          
          movieAnalysis[movieId].revenue += orderTotal;
          movieAnalysis[movieId].count += 1;
          movieAnalysis[movieId].ticketCount += (order.seats?.length || 0);
        }
      }
    });
    
    // Tìm giờ cao điểm (5 giờ có doanh thu cao nhất)
    timeAnalysis.peakHours = hourlyData
      .map((data, hour) => ({ hour, revenue: data.revenue, count: data.count }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(item => ({
        ...item,
        hourDisplay: `${String(item.hour).padStart(2, '0')}:00 - ${String(item.hour + 1).padStart(2, '0')}:00`
      }));
    
    // Tính giá vé trung bình và giá trị đơn hàng trung bình
    if (timeAnalysis.totalOrders > 0) {
      timeAnalysis.avgOrderValue = Math.round(timeAnalysis.totalRevenue / timeAnalysis.totalOrders);
      
      // Tổng số vé bán ra
      const totalTickets = Object.values(roomAnalysis).reduce((sum, room) => sum + room.ticketCount, 0);
      timeAnalysis.avgTicketPrice = totalTickets > 0 
        ? Math.round(timeAnalysis.totalRevenue / totalTickets)
        : 0;
    }
    
    // Chuyển đổi phân tích phòng chiếu và phim thành mảng để dễ sử dụng
    const roomAnalysisArray = Object.values(roomAnalysis)
      .sort((a, b) => b.revenue - a.revenue);
    
    const movieAnalysisArray = Object.values(movieAnalysis)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Lấy top 10 phim có doanh thu cao nhất
    
    return {
      timeAnalysis,
      roomAnalysisArray,
      movieAnalysisArray,
      hourlyData,
    };
  }, [orders, cinemas, movies, timeFrame]);
};

// Xử lý dữ liệu biểu đồ doanh thu theo chi nhánh
export const useBranchRevenueChart = (branches, orders) => {  
  return useMemo(() => {
    if (!branches?.branches || !orders?.data) return [];

    // Tạo object để lưu doanh thu theo chi nhánh
    const branchRevenue = {};

    // Khởi tạo doanh thu 0 cho tất cả các chi nhánh
    branches.branches.forEach((branch) => {
      branchRevenue[branch.id] = {
        name: branch.name,
        revenue: 0,
      };
    });

    // Tính toán doanh thu thực tế dựa trên branch_id của mỗi đơn hàng
    orders.data.forEach((order) => {
      if (order.status === "paid" && order.branch_id && branchRevenue[order.branch_id]) {
        // Cộng doanh thu từ đơn hàng vào chi nhánh tương ứng
        branchRevenue[order.branch_id].revenue += parseInt(order.total || 0);
      }
    });

    return Object.values(branchRevenue);
  }, [branches, orders]);
};

// Xử lý dữ liệu biểu đồ rạp theo thành phố
export const useCityChart = (cinemas) => {
  return useMemo(() => {
    if (!cinemas?.data) return [];

    const cityCount = {};
    cinemas.data.forEach((cinema) => {
      const city = cinema.city;
      cityCount[city] = (cityCount[city] || 0) + 1;
    });

    return Object.entries(cityCount).map(([name, value]) => ({ name, value }));
  }, [cinemas]);
}; 