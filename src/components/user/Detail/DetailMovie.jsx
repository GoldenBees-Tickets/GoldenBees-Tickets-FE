import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useGetMovieByIdQuery } from "../../../api/movieApi";
import { formatImage } from "@/utils/formatImage";
export default function MovieDetail() {
  const { id } = useParams();
  const { data: movie, error, isLoading } = useGetMovieByIdQuery(id);
  const ListMovie = movie?.movie;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-orange-300 mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600 flex items-center justify-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Error loading movie details.
    </div>
  );

  if (!ListMovie) return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-600 flex items-center justify-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Movie not found
    </div>
  );

  const trailerId = ListMovie?.trailer ? ListMovie.trailer.split('/').pop() : null;

  const genres = ListMovie?.MovieGenres?.map(genreRelation => genreRelation.Genre?.name).join(", ") || "No genres available";

  const directorName = ListMovie?.Director?.name || "Unknown Director";

  const actors = ListMovie?.MovieActors?.map(actorRelation => actorRelation.Actor?.name).join(", ") || "No actors available";

  const producers = ListMovie?.MovieProducers?.map(producerRelation => producerRelation.Producer?.name).join(", ") || "No producers available";

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Movie Image */}
        <div className="lg:w-1/3">
          <div className="sticky top-20">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
              <img
                src={formatImage(ListMovie?.poster)}
                alt={ListMovie?.name}
                className="w-full h-auto object-cover rounded-2xl shadow-lg transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition duration-300"></div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 w-full flex justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white flex items-center px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-orange-300/30 hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                  Xem Trailer
                </button>
              </div>
              
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
                {ListMovie?.age_rating === 0 ? "P" : `C${ListMovie?.age_rating}`}
              </div>
              
              <h1 className="absolute top-4 left-4 text-2xl md:text-3xl font-bold text-white shadow-text">
                {ListMovie?.name}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 hidden lg:block">{ListMovie?.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {ListMovie?.MovieGenres?.map(mg => (
                  <span key={mg.Genre?.id} className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 font-medium border border-orange-200">
                    {mg.Genre?.name}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4 text-gray-700">
                  <div className="flex">
                    <span className="w-32 text-gray-500 font-medium">Đạo diễn:</span>
                    <Link to={`/director/${ListMovie?.Director?.id}`} className="text-orange-600 hover:text-orange-700 hover:underline font-medium transition">
                      {directorName}
                    </Link>
                  </div>
                  
                  <div className="flex">
                    <span className="w-32 text-gray-500 font-medium">Diễn viên:</span>
                    <div className="flex flex-wrap">
                      {ListMovie?.MovieActors?.map((actorRelation, index) => (
                        <Link 
                          key={actorRelation.Actor?.id} 
                          to={`/actor/${actorRelation.Actor?.id}`} 
                          className="text-orange-600 hover:text-orange-700 hover:underline transition"
                        >
                          {actorRelation.Actor?.name}
                          {index < ListMovie.MovieActors.length - 1 ? ", " : ""}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="flex">
                    <span className="w-32 text-gray-500 font-medium">Nhà sản xuất:</span>
                    <div className="flex flex-wrap">
                      {ListMovie?.MovieProducers?.map((producerRelation, index) => (
                        <Link 
                          key={producerRelation.Producer?.id} 
                          to={`/producer/${producerRelation.Producer?.id}`} 
                          className="text-orange-600 hover:text-orange-700 hover:underline transition"
                        >
                          {producerRelation.Producer?.name}
                          {index < ListMovie.MovieProducers.length - 1 ? ", " : ""}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <span className="w-32 text-gray-500 font-medium">Thời lượng:</span>
                    <span className="font-medium">{ListMovie?.duration} phút</span>
                  </div>
                  
                  <div className="flex">
                    <span className="w-32 text-gray-500 font-medium">Năm sản xuất:</span>
                    <span className="font-medium">{ListMovie?.year}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex items-center">
                <span className="w-32 text-gray-500 font-medium">Độ tuổi:</span>
                <span className="flex items-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-yellow-500 text-sm font-bold text-black mr-2 shadow">
                    {ListMovie?.age_rating === 0 ? "P" : `C${ListMovie?.age_rating}`}
                  </span>
                  <span className="text-gray-700">
                    {ListMovie?.age_rating === 0 ? "Phim dành cho mọi lứa tuổi" : `Cấm khán giả dưới ${ListMovie?.age_rating} tuổi`}
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Mô Tả Phim
              </h2>
              <p className="text-gray-700 leading-relaxed">{ListMovie?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && trailerId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[9999] backdrop-blur-md">
          <div className="relative bg-black p-1 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full z-10 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
              title="Trailer phim"
              className="rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .shadow-text {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
