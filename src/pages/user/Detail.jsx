import { useEffect } from "react";
import DetailMovie from "../../components/user/Detail/DetailMovie";
import FilterMovie from "../../components/user/Detail/FilterMovie";

export default function Detail() {
  useEffect(() => {
    // Scroll to top when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DetailMovie />
        
        <div className="mt-8">
          <FilterMovie />
        </div>
      </div>
    </div>
  );
}
