import { useEffect } from "react";
import DetailMovie from "../../components/user/Detail/DetailMovie";
import FilterMovie from "../../components/user/Detail/FilterMovie";

export default function Detail() {
  useEffect(() => {
    // Scroll to top when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full gap-4">
        <div className="flex-1 p-4">
          <DetailMovie />
          <FilterMovie />
        </div>
        <div className="w-full md:w-[35%] p-4">
          {/* <DetailListMovie /> */}
        </div>
      </div>
    </>
  );
}
