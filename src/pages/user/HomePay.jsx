import { useGetCombosQuery } from '../../api/comboApi'
import FoodMovies from '../../components/User/PayTickets/FoodMovies'
import PayMovies from '../../components/User/PayTickets/PayMovies'

export default function HomePay() {
  const { data: List, isLoading, isError } = useGetCombosQuery()

  // Check if data is available
  const Combo = List?.data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while fetching data.</div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 sm:space-x-4 mt-10 max-w-screen-xl mx-auto px-4">
        <div className="w-full sm:w-[60%]">
          {/* Pass Combo as props to FoodMovies */}
          <FoodMovies Combo={Combo} />
        </div>
        <div className="w-full sm:w-[40%]">
          <PayMovies />
        </div>
      </div>
    </>
  );
}
