import { useParams } from 'react-router-dom';
import { useGetProducersQuery } from '../../api/producerApi';
import DetailListMovie from '../../components/User/Detail/DetailListMovie';
import FilterMovie from '../../components/User/Detail/FilterMovie';
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function Producer() {
  const { id } = useParams(); // Get the producer ID from the URL
  const { data: list, error, isLoading } = useGetProducersQuery(); // Fetch producers list from the API

  // Find the producer based on the id from the URL
  const producer = list?.producers?.find((producer) => producer.id === parseInt(id, 10));

  // Handle loading, error, and no producer found states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading producer details.</div>;
  if (!producer) return <div>Producer not found.</div>;

  // Destructure producer data
  const { name, bio, profile_picture } = producer;

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Left Column (Producer Details) */}
      <div className="w-full md:w-[65%] p-4">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col md:flex-row">
            {/* Producer Profile Picture */}
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              <img
                src={`${API_BASE_URL}/${profile_picture}`} // Profile picture of the producer
                alt={name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Producer Details */}
            <div className="w-full md:w-2/3 p-4 md:pl-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{name}</h1>
              <div className="text-sm text-gray-700 mb-2">
                <strong>Tiểu sử:</strong>
                <p className="mt-2">{bio || "No bio available"}</p>
              </div>
            </div>
          </div>
        </div>
        <FilterMovie />
      </div>

      {/* Right Column (Related Movies) */}
      <div className="w-full md:w-[35%] p-4 mt-6 md:mt-0">
        <DetailListMovie />
      </div>
    </div>
  );
}
