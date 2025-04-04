import FilterHomeFilter from "../../components/User/FilterHome/FilterHomeFilter";
import FilterHomeItem from "../../components/User/FilterHome/FilterHomeItem";
import FilterHomeRaiting from "../../components/User/FilterHome/FilterHomeRaiting";
import FormAddTicket from "../../components/User/FilterHome/FormAddTicket";

export default function FilterHome() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 sm:space-x-4 mt-10 max-w-screen-xl mx-auto px-4">
        {/* Phần bên trái chiếm 65% */}
        <div className="w-full sm:w-[65%] space-y-6">
          <FilterHomeFilter />
          <FilterHomeItem />
          <FilterHomeItem />
          <FilterHomeItem />
        </div>

        {/* Phần bên phải chiếm 35% */}
        <div className="w-full sm:w-[35%] space-y-6">
          <FormAddTicket />
          <h1 className="text-xl font-bold mb-4">Phim Đang Chiếu</h1>
          <FilterHomeRaiting />
          <FilterHomeRaiting />
          <FilterHomeRaiting />
        </div>
      </div>
    </>
  );
}
