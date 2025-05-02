import { useGetOrdersQuery, useGetOrdersByBranchQuery } from "@/api/orderApi";
import { useGetBranchesQuery, useGetBranchesByAdminQuery } from "@/api/branchApi";
import { useGetAllMoviesByAdminQuery, useGetMoviesByBranchQuery } from "@/api/movieApi";
import { useGetAllGenresForDashboardQuery } from "@/api/genreApi";
import { useGetAllCinemaNotPaginationQuery, useGetCinemasByBranchQuery } from "@/api/cinemaApi";
import { useMemo } from "react";

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
  } = useGetBranchesByAdminQuery(userId, { skip: !isBranchAdmin });

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
  } = useGetCinemasByBranchQuery(userId, { skip: !isBranchAdmin });

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

    const stats = {
      comingSoon: 0,
      nowShowing: 0,
      ended: 0,
    };

    movies.data.forEach((movie) => {
      if (movie.status === "coming_soon" || movie.status === "opening_soon") {
        stats.comingSoon++;
      } else if (movie.status === "now_showing") {
        stats.nowShowing++;
      } else if (movie.status === "ended") {
        stats.ended++;
      }
    });

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

    // Tổng doanh thu
    const totalRevenue = orders.data.reduce(
      (sum, order) => sum + parseInt(order.total || 0),
      0
    );

    // Phân bổ doanh thu theo tỉ lệ cố định cho các chi nhánh
    // Đây là giả định - trong thực tế nên dựa vào liên kết thực giữa đơn hàng và chi nhánh
    if (branches.branches.length > 0) {
      if (branches.branches.length === 1) {
        branchRevenue[branches.branches[0].id].revenue = totalRevenue;
      } else if (branches.branches.length === 2) {
        // Chi nhánh Hồ Chí Minh: 65%, Chi nhánh Đà Nẵng: 35%
        const hcmBranch = branches.branches.find((b) =>
          b.city.includes("Hồ Chí Minh")
        );
        const dnBranch = branches.branches.find((b) =>
          b.city.includes("Đà Nẵng")
        );

        if (hcmBranch)
          branchRevenue[hcmBranch.id].revenue = Math.round(totalRevenue * 0.65);
        if (dnBranch)
          branchRevenue[dnBranch.id].revenue = Math.round(totalRevenue * 0.35);
      } else {
        // Phân bổ theo tỷ lệ phần trăm nếu có nhiều chi nhánh
        let remainingPercent = 100;
        const percentPerBranch = Math.floor(
          remainingPercent / branches.branches.length
        );

        branches.branches.forEach((branch, index) => {
          if (index === branches.branches.length - 1) {
            // Chi nhánh cuối nhận phần còn lại
            branchRevenue[branch.id].revenue = Math.round(
              totalRevenue * (remainingPercent / 100)
            );
          } else {
            branchRevenue[branch.id].revenue = Math.round(
              totalRevenue * (percentPerBranch / 100)
            );
            remainingPercent -= percentPerBranch;
          }
        });
      }
    }

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