import Slider from "../../components/User/Home/Slider";
import HomeItem from "../../components/User/Home/HomeItem";
import HomeBlog from "../../components/User/Home/HomeBlog";
import HomeSale from "../../components/User/Home/HomeSale";
import HomeBaner from "../../components/User/Home/HomeBaner";

export default function HomePage() {
  return (
    <>
      <Slider></Slider>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HomeItem></HomeItem>
      <HomeBlog></HomeBlog>
      <HomeSale></HomeSale>
      <HomeBaner></HomeBaner>
      </main>
    </>
  )
}
