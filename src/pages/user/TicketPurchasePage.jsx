import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBranchesQuery } from '../../api/branchApi';
import { useGetCinemaByBranchIdQuery } from '../../api/cinemaApi';
import { useGetShowtimesByMovieIdQuery } from '../../api/showtimeApi';
import { useGetMoviesQuery } from '../../api/movieApi';
import { toast } from 'react-toastify';
import { formatImage } from '../../utils/formatImage';

// Icon imports
import { 
  FiMapPin, 
  FiClock, 
  FiFilm, 
  FiCalendar, 
  FiHome, 
  FiChevronRight, 
  FiCheck,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiX
} from 'react-icons/fi';

const TicketPurchasePage = () => {
  const navigate = useNavigate();
  
  // State for the selection process
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cinemaSearchTerm, setCinemaSearchTerm] = useState('');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [movieSearchTerm, setMovieSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const cinemaDropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Get branches data
  const { data: branchData, isLoading: isLoadingBranches } = useGetBranchesQuery();
  const branches = branchData?.branches || [];

  // Get cinemas data based on selected branch
  const { data: cinemaData, isLoading: isLoadingCinemas } = useGetCinemaByBranchIdQuery(selectedBranch, {
    skip: !selectedBranch
  });
  const cinemas = cinemaData?.cinemas || [];

  // Get movies data
  const { data: movieData, isLoading: isLoadingMovies } = useGetMoviesQuery();
  const movies = movieData?.movies || [];

  // Get showtimes data based on selected movie
  const { data: showtimeData, isLoading: isLoadingShowtimes } = useGetShowtimesByMovieIdQuery(selectedMovie, {
    skip: !selectedMovie
  });
  const showtimeDates = showtimeData?.data || [];

  // Format dates for better display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  };

  // Filter showtimes by cinema and date
  const filteredShowtimes = useMemo(() => {
    if (!selectedDate || !selectedCinema) return [];
    
    const dateGroup = showtimeDates.find(date => date.date === selectedDate);
    if (!dateGroup) return [];
    
    const cinemaGroup = dateGroup.cinemas.find(cinema => cinema.cinema_id.toString() === selectedCinema);
    return cinemaGroup ? cinemaGroup.showtimes : [];
  }, [showtimeDates, selectedDate, selectedCinema]);

  // Reset selections when changing a previous selection
  useEffect(() => {
    if (selectedBranch) {
      setSelectedCinema('');
      setSelectedMovie('');
      setSelectedDate('');
      setSelectedShowtime(null);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedCinema) {
      setSelectedMovie('');
      setSelectedDate('');
      setSelectedShowtime(null);
    }
  }, [selectedCinema]);

  useEffect(() => {
    if (selectedMovie) {
      setSelectedDate('');
      setSelectedShowtime(null);
      
      // Set the first date available when movie is selected
      if (showtimeDates.length > 0) {
        setSelectedDate(showtimeDates[0].date);
      }
    }
  }, [selectedMovie, showtimeDates]);

  // Function to proceed to booking when all selections are made
  const proceedToBooking = () => {
    if (selectedShowtime) {
      navigate(`/booking/${selectedShowtime.id}?room_id=${selectedShowtime.room_id}`);
    } else {
      toast.error('Vui lòng chọn xuất chiếu');
    }
  };

  // Get the selected movie details
  const selectedMovieDetails = useMemo(() => {
    if (!selectedMovie) return null;
    return movies.find(movie => movie.id.toString() === selectedMovie);
  }, [selectedMovie, movies]);

  // Function to handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter branches based on search term
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return branches;
    return branches.filter(branch => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      branch.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [branches, searchTerm]);

  // Get selected branch name
  const selectedBranchName = useMemo(() => {
    if (!selectedBranch) return '';
    const branch = branches.find(b => b.id.toString() === selectedBranch);
    return branch ? `${branch.name}, ${branch.city}` : '';
  }, [selectedBranch, branches]);

  // Function to handle outside click to close cinema dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (cinemaDropdownRef.current && !cinemaDropdownRef.current.contains(event.target)) {
        setIsCinemaDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter cinemas based on search term
  const filteredCinemas = useMemo(() => {
    if (!cinemaSearchTerm.trim()) return cinemas;
    return cinemas.filter(cinema => 
      cinema.name.toLowerCase().includes(cinemaSearchTerm.toLowerCase()) || 
      cinema.city.toLowerCase().includes(cinemaSearchTerm.toLowerCase()) ||
      cinema.district.toLowerCase().includes(cinemaSearchTerm.toLowerCase()) ||
      cinema.ward.toLowerCase().includes(cinemaSearchTerm.toLowerCase())
    );
  }, [cinemas, cinemaSearchTerm]);

  // Get selected cinema name
  const selectedCinemaName = useMemo(() => {
    if (!selectedCinema) return '';
    const cinema = cinemas.find(c => c.id.toString() === selectedCinema);
    return cinema ? cinema.name : '';
  }, [selectedCinema, cinemas]);

  // Get dates for the current week offset
  const displayedDates = useMemo(() => {
    if (!showtimeDates.length) return [];
    
    // Sort dates chronologically
    const sortedDates = [...showtimeDates].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Calculate start and end indices for current week
    const startIdx = currentWeekOffset * 7;
    const endIdx = startIdx + 7;
    
    return sortedDates.slice(startIdx, endIdx);
  }, [showtimeDates, currentWeekOffset]);

  // Check if there are more weeks available
  const hasNextWeek = useMemo(() => {
    const startIdx = (currentWeekOffset + 1) * 7;
    return startIdx < showtimeDates.length;
  }, [showtimeDates, currentWeekOffset]);

  // Function to handle outside click to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Don't close if clicking inside the modal
        if (!event.target.closest('.movie-modal-content')) {
          setShowMovieModal(false);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter movies based on search term
  const filteredMovies = useMemo(() => {
    if (!movieSearchTerm.trim()) return movies;
    return movies.filter(movie => 
      movie.name.toLowerCase().includes(movieSearchTerm.toLowerCase()) ||
      (movie.MovieGenres && movie.MovieGenres.some(mg => 
        mg.Genre?.name.toLowerCase().includes(movieSearchTerm.toLowerCase())
      ))
    );
  }, [movies, movieSearchTerm]);

  // Handle cinema selection
  const handleCinemaSelect = (cinemaId) => {
    setSelectedCinema(cinemaId);
    setShowMovieModal(true);
    setSelectedMovie('');
    setSelectedDate('');
    setSelectedShowtime(null);
  };

  // Get selected cinema details
  const selectedCinemaDetails = useMemo(() => {
    if (!selectedCinema) return null;
    return cinemas.find(cinema => cinema.id.toString() === selectedCinema);
  }, [selectedCinema, cinemas]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Đặt vé xem phim</h1>

        {/* Branch Selection Dropdown - At top of page */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center">
              <FiMapPin className="mr-2 text-orange-500" />
              Chọn chi nhánh
            </h2>
            {selectedBranch && (
              <button 
                onClick={() => setSelectedBranch('')}
                className="text-xs text-gray-500 hover:text-orange-500 flex items-center"
              >
                <FiX className="w-3 h-3 mr-1" />
                Đổi chi nhánh
              </button>
            )}
          </div>
          
          {isLoadingBranches ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Dropdown button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full p-3 border rounded-lg flex items-center justify-between transition-all ${
                  selectedBranch 
                    ? 'bg-orange-50 border-orange-500 text-gray-800' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedBranch 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <span className="ml-3 font-medium text-sm">
                    {selectedBranchName || 'Chọn chi nhánh để xem phim'}
                  </span>
                </div>
                <FiChevronDown className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                  {/* Search input */}
                  <div className="p-2 border-b sticky top-0 bg-white">
                    <div className="relative">
                      <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm chi nhánh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Branch options */}
                  {filteredBranches.length > 0 ? (
                    filteredBranches.map((branch) => (
                      <div
                        key={branch.id}
                        onClick={() => {
                          setSelectedBranch(branch.id.toString());
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`p-2 cursor-pointer hover:bg-orange-50 transition-colors ${
                          selectedBranch === branch.id.toString() ? 'bg-orange-100' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            selectedBranch === branch.id.toString() 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {selectedBranch === branch.id.toString() ? (
                              <FiCheck className="w-3 h-3" />
                            ) : (
                              <FiMapPin className="w-3 h-3" />
                            )}
                          </div>
                          <div className="ml-2">
                            <h3 className="font-medium text-sm text-gray-800">{branch.name}</h3>
                            <p className="text-xs text-gray-600">{branch.city}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Không tìm thấy chi nhánh phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Intro Steps - Show only when no branch is selected */}
        {!selectedBranch && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <div className="inline-block p-3 bg-orange-100 rounded-full mb-2">
                  <FiFilm className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Chào mừng bạn đến với B Cinema</h2>
                <p className="text-gray-600">Hãy thực hiện các bước dưới đây để đặt vé xem phim bạn yêu thích</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Chọn chi nhánh</h3>
                  <p className="text-sm text-gray-600">Chọn chi nhánh rạp chiếu phim gần bạn nhất</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Chọn phim và suất chiếu</h3>
                  <p className="text-sm text-gray-600">Chọn phim bạn muốn xem và thời gian phù hợp</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Chọn ghế và thanh toán</h3>
                  <p className="text-sm text-gray-600">Chọn ghế ngồi và hoàn tất quá trình thanh toán</p>
                </div>
              </div>
              
              <div className="bg-orange-100 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="text-orange-500 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Lưu ý khi đặt vé</h4>
                    <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                      <li>Bạn nên đến rạp trước giờ chiếu ít nhất 15-30 phút</li>
                      <li>Vé đã mua không thể đổi hoặc hoàn lại</li>
                      <li>Giữ vé cẩn thận và không chia sẻ mã QR vé với người khác</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cinema and Movie Selection - Show only when branch is selected */}
        {selectedBranch && (
          <>
            {/* Cinema List Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-300">
              <h2 className="text-base font-semibold mb-3 flex items-center">
                <FiHome className="mr-2 text-orange-500" />
                Danh sách rạp chiếu
              </h2>
              
              {isLoadingCinemas ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : cinemas.length > 0 ? (
                <div>
                  {/* Search cinema input */}
                  <div className="mb-3">
                    <div className="relative">
                      <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm rạp chiếu..."
                        value={cinemaSearchTerm}
                        onChange={(e) => setCinemaSearchTerm(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Cinema list - displayed as a grid/list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                    {filteredCinemas.length > 0 ? (
                      filteredCinemas.map((cinema) => (
                        <div
                          key={cinema.id}
                          onClick={() => handleCinemaSelect(cinema.id.toString())}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedCinema === cinema.id.toString()
                              ? 'bg-orange-50 border-orange-500 shadow-sm'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                              selectedCinema === cinema.id.toString() 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {selectedCinema === cinema.id.toString() ? (
                                <FiCheck className="w-3 h-3" />
                              ) : (
                                <FiHome className="w-3 h-3" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm text-gray-800">{cinema.name}</h3>
                              <p className="text-xs text-gray-600 mt-0.5 leading-tight">
                                {cinema.street}, {cinema.ward}, {cinema.district}, {cinema.city}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-500 border border-gray-200 rounded-lg">
                        Không tìm thấy rạp chiếu phù hợp
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 p-3 rounded-lg text-center text-sm">
                  <p className="text-gray-600">Không có rạp chiếu nào cho chi nhánh này</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Movie Popup Modal */}
        {showMovieModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div 
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden movie-modal-content"
            >
              {/* Modal Header */}
              <div className="p-4 border-b flex justify-between items-center bg-orange-50">
                <div className="flex items-center">
                  <FiFilm className="text-orange-500 mr-2" />
                  <h2 className="font-semibold">
                    {selectedCinemaDetails ? `Chọn phim tại ${selectedCinemaDetails.name}` : 'Chọn phim'}
                  </h2>
                </div>
                <button 
                  onClick={() => setShowMovieModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-4">
                {/* Search movies */}
                <div className="mb-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm phim..."
                      value={movieSearchTerm}
                      onChange={(e) => setMovieSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Movies Grid */}
                <div className="overflow-y-auto max-h-[60vh]">
                  {isLoadingMovies ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                      {filteredMovies.map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => {
                            setSelectedMovie(movie.id.toString());
                            setShowMovieModal(false);
                          }}
                          className={`cursor-pointer h-full transition-all duration-300 transform hover:-translate-y-1 ${
                            selectedMovie === movie.id.toString() ? 'ring-2 ring-orange-500 scale-[1.02]' : ''
                          }`}
                        >
                          <div className="relative h-full bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative">
                              {/* Gradient overlay for better text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                              
                              <img
                                src={formatImage(movie.poster)}
                                alt={movie.name}
                                className="aspect-[3/4] w-full object-cover"
                                loading="lazy"
                              />
                              
                              {/* Rating badge */}
                              <div className="absolute top-1 right-1 z-20">
                                <div className="bg-yellow-400 text-xs font-bold text-gray-900 px-1.5 py-0.5 rounded text-[10px]">
                                  {movie.age_rating === 0 ? "P" : `C${movie.age_rating}`}
                                </div>
                              </div>
                              
                              {/* Genre badges */}
                              {movie.MovieGenres && movie.MovieGenres.length > 0 && (
                                <div className="absolute top-1 left-1 z-20 flex flex-wrap gap-1 max-w-[90%]">
                                  {movie.MovieGenres.map((genreRelation, index) => (
                                    <div 
                                      key={index}
                                      className="bg-orange-500 text-[10px] font-medium text-white px-1.5 py-0.5 rounded truncate max-w-full"
                                    >
                                      {genreRelation.Genre?.name || "Phim"}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 z-20 p-2 text-white">
                              <h3 className="text-xs font-bold leading-tight line-clamp-2">{movie.name}</h3>
                              
                              <div className="flex items-center mt-1 space-x-1">
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">{movie.year}</span>
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">{movie.duration} phút</span>
                              </div>
                              
                              {/* Action button */}
                              <div className="flex justify-end items-center mt-1">
                                <button 
                                  className="text-[10px] bg-orange-500/80 hover:bg-orange-600 px-2 py-0.5 rounded-full"
                                >
                                  <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                    <span>Chọn</span>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {filteredMovies.length === 0 && !isLoadingMovies && (
                    <div className="text-center py-8 text-gray-500">
                      Không tìm thấy phim phù hợp
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Showtime Selection Section - Show only when movie is selected */}
        {selectedMovie && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 transition-all duration-300">
            <h2 className="text-base font-semibold mb-3 flex items-center">
              <FiClock className="mr-2 text-orange-500" />
              Chọn suất chiếu
            </h2>
            
            {isLoadingShowtimes ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                {selectedMovieDetails && (
                  <div className="flex mb-3 p-3 bg-orange-50 rounded-lg">
                    <img
                      src={formatImage(selectedMovieDetails.poster)}
                      alt={selectedMovieDetails.name}
                      className="w-12 h-18 object-cover rounded-md"
                    />
                    <div className="ml-3">
                      <h3 className="font-bold text-sm">{selectedMovieDetails.name}</h3>
                      <p className="text-gray-600 text-xs">
                        <span className="bg-yellow-500 text-gray-900 text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">
                          {selectedMovieDetails.age_rating === 0 ? "P" : `C${selectedMovieDetails.age_rating}`}
                        </span>
                        <span>{selectedMovieDetails.duration} phút</span>
                      </p>
                    </div>
                  </div>
                )}

                {showtimeDates.length > 0 ? (
                  <>
                    {/* Date selection with week navigation */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-gray-700 font-medium text-sm flex items-center">
                          <FiCalendar className="mr-2 text-orange-500 w-3 h-3" />
                          Chọn ngày xem phim
                        </label>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setCurrentWeekOffset(prev => Math.max(0, prev - 1))}
                            disabled={currentWeekOffset === 0}
                            className={`p-1 rounded-full ${
                              currentWeekOffset === 0 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-orange-500 hover:bg-orange-100'
                            }`}
                            aria-label="Tuần trước"
                          >
                            <FiChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                            disabled={!hasNextWeek}
                            className={`p-1 rounded-full ${
                              !hasNextWeek 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-orange-500 hover:bg-orange-100'
                            }`}
                            aria-label="Tuần sau"
                          >
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex overflow-x-auto hide-scrollbar py-1">
                        <div className="flex space-x-2">
                          {displayedDates.map((dateGroup) => (
                            <button
                              key={dateGroup.date}
                              onClick={() => setSelectedDate(dateGroup.date)}
                              className={`p-2 rounded-lg transition-all text-xs flex-shrink-0 min-w-[4rem] ${
                                selectedDate === dateGroup.date
                                  ? 'bg-orange-500 text-white shadow-sm'
                                  : 'bg-gray-100 hover:bg-orange-100'
                              }`}
                            >
                              <div className="font-medium">{dateGroup.day}</div>
                              <div className="text-xs">{dateGroup.date}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Showtime selection */}
                    {selectedDate && (
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium text-sm">Chọn giờ chiếu</label>
                        
                        {filteredShowtimes.length > 0 ? (
                          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                            {filteredShowtimes.map((showtime) => (
                              <button
                                key={showtime.id}
                                onClick={() => setSelectedShowtime(showtime)}
                                className={`p-1.5 rounded-lg border text-center transition-all text-xs ${
                                  selectedShowtime && selectedShowtime.id === showtime.id
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                    : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                                }`}
                              >
                                <div className="font-medium">{showtime.time}</div>
                                <div className="text-[10px]">{showtime.room_name}</div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-sm text-gray-500">
                            Không có suất chiếu nào cho rạp và ngày đã chọn
                          </div>
                        )}

                        {/* Book button - shown when showtime is selected */}
                        {selectedShowtime && (
                          <div className="mt-4 text-center">
                            <button
                              onClick={proceedToBooking}
                              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                            >
                              Tiếp tục đặt vé
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Không có lịch chiếu nào cho phim này
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPurchasePage;

<style jsx>{`
  .hide-scrollbar {
    scrollbar-width: none;  /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`}</style> 