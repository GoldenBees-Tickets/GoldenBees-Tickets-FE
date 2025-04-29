import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function TicketSalesDashboard() {
  // Dữ liệu cho biểu đồ cột (Doanh thu bán vé)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Sales (in thousands)',
        data: [30, 45, 55, 60, 70, 80, 95, 100, 110, 120],
        backgroundColor: '#007bff', // Màu xanh cho cột biểu đồ
        borderColor: '#0056b3', // Màu sắc viền
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn (Thể loại phim được quan tâm)
  const movieGenreData = {
    labels: ['Hành động', 'Gia đình', 'Tình cảm - Lãng mạn', 'Lịch sử', 'Nhạc kịch'],
    datasets: [
      {
        label: 'Tỷ lệ quan tâm',
        data: [35, 15, 22, 13, 25],
        backgroundColor: ['#FF5252', '#9C27B0', '#2196F3', '#4CAF50', '#FFCA28'],
        borderColor: ['#D32F2F', '#7B1FA2', '#1976D2', '#388E3C', '#FFB300'],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ tròn (Thể loại phim được đặt nhiều nhất)
  const topBookedGenres = {
    labels: ['Hành động', 'Kinh dị', 'Hoạt hình', 'Viễn tưởng', 'Hài kịch'],
    datasets: [
      {
        label: 'Số lượng đặt vé',
        data: [40, 25, 15, 10, 10],
        backgroundColor: ['#FF5252', '#9C27B0', '#2196F3', '#4CAF50', '#FFCA28'],
        borderColor: ['#D32F2F', '#7B1FA2', '#1976D2', '#388E3C', '#FFB300'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-8 mt-5 ml-5 mr-5 space-y-10 bg-white shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {/* Biểu đồ cột - Doanh thu bán vé */}
        <div className="rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Ticket Sales Analysis</h3>
          <Bar 
            data={barData} 
            options={{ 
              responsive: true, 
              animation: {
                duration: 1500, // Thời gian chuyển động
                easing: 'easeOutBounce', // Loại hiệu ứng
              },
            }} 
          />
        </div>
        
        {/* Biểu đồ tròn - Thể loại phim được quan tâm nhiều nhất */}
        <div className="rounded-lg p-4 mx-auto">
          <h3 className="text-lg font-semibold mb-4">Thể loại phim được quan tâm nhiều nhất</h3>
          <Doughnut 
            data={movieGenreData} 
            options={{ 
              responsive: true, 
              animation: {
                animateRotate: true, // Chuyển động quay tròn
                duration: 2000, // Thời gian quay
                easing: 'easeInOutQuart', // Loại hiệu ứng quay
              },
            }} 
          />
        </div>
      </div>

      {/* Biểu đồ tròn - Thể loại phim được đặt nhiều nhất */}
      <div className="mt-10">
        <div className="rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Thể loại phim được đặt nhiều nhất</h3>
          <Doughnut 
            data={topBookedGenres} 
            options={{ 
              responsive: true, 
              animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeInOutQuart',
              },
            }} 
          />
        </div>
      </div>
    </div>
  );
}
