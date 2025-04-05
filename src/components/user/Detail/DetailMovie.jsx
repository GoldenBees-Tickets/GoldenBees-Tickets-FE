import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetMovieByIdQuery } from "../../../api/movieApi";
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function MovieDetail() {
  const { id } = useParams();
  const { data: movie, error, isLoading } = useGetMovieByIdQuery(id);
  const ListMovie = movie?.movie;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading movie details.</div>;

  if (!ListMovie) return <div>Movie not found</div>;

  const trailerId = ListMovie?.trailer ? ListMovie.trailer.split('/').pop() : null;

  const genres = ListMovie?.MovieGenres?.map(genreRelation => genreRelation.Genre?.name).join(", ") || "No genres available";

  const directorName = ListMovie?.Director?.name || "Unknown Director";

  const actors = ListMovie?.MovieActors?.map(actorRelation => actorRelation.Actor?.name).join(", ") || "No actors available";

  const producers = ListMovie?.MovieProducers?.map(producerRelation => producerRelation.Producer?.name).join(", ") || "No producers available";

  return (
    <div className="max-w-7xl mx-auto relative">

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Movie Image */}
        <div className="lg:w-1/3">
          <div className="sticky top-20">
            <div className="relative group overflow-hidden rounded-xl">
              <img
                src={`${API_BASE_URL}/${ListMovie?.poster}`}
                alt={ListMovie?.name}
                className="w-full h-auto object-cover rounded-xl shadow-lg transform transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white flex items-center px-5 py-2.5 rounded-full shadow-lg transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
                Xem Trailer
              </button>
              
              <div className="absolute top-3 right-3 bg-yellow-500 text-gray-900 text-xs font-bold px-2.5 py-1 rounded">
                {ListMovie?.age_rating === 0 ? "P" : `C${ListMovie?.age_rating}`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {ListMovie?.MovieGenres?.map(mg => (
                <span key={mg.Genre?.id} className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {mg.Genre?.name}
                </span>
              ))}
            </div>

            <div className="space-y-3 text-gray-700">
              <div className="flex">
                <span className="w-32 text-gray-500">Đạo diễn:</span>
                <Link to={`/director/${ListMovie?.Director?.id}`} className="text-orange-600 hover:text-orange-700 hover:underline">
                  {directorName}
                </Link>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500">Diễn viên:</span>
                <div className="flex flex-wrap">
                  {ListMovie?.MovieActors?.map((actorRelation, index) => (
                    <Link 
                      key={actorRelation.Actor?.id} 
                      to={`/actor/${actorRelation.Actor?.id}`} 
                      className="text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      {actorRelation.Actor?.name}
                      {index < ListMovie.MovieActors.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500">Nhà sản xuất:</span>
                <div className="flex flex-wrap">
                  {ListMovie?.MovieProducers?.map((producerRelation, index) => (
                    <Link 
                      key={producerRelation.Producer?.id} 
                      to={`/producer/${producerRelation.Producer?.id}`} 
                      className="text-orange-600 hover:text-orange-700 hover:underline"
                    >
                      {producerRelation.Producer?.name}
                      {index < ListMovie.MovieProducers.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500">Thời lượng:</span>
                <span>{ListMovie?.duration} phút</span>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500">Độ tuổi:</span>
                <span className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-yellow-500 text-xs font-bold text-black mr-2">
                    {ListMovie?.age_rating === 0 ? "P" : `C${ListMovie?.age_rating}`}
                  </span>
                  {ListMovie?.age_rating === 0 ? "Phim dành cho mọi lứa tuổi" : `Cấm khán giả dưới ${ListMovie?.age_rating} tuổi`}
                </span>
              </div>
              
              <div className="flex">
                <span className="w-32 text-gray-500">Năm sản xuất:</span>
                <span>{ListMovie?.year}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Mô Tả Phim
            </h2>
            <p className="text-gray-600 leading-relaxed">{ListMovie?.description}</p>
          </div>
        </div>
      </div>

      {isModalOpen && trailerId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[9999] backdrop-blur-sm">
          <div className="relative bg-white p-1 rounded-xl w-full lg:w-2/3 overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full z-10"
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
    </div>
  );
}
