export default function Team() {
    return(
        <div>
    <ul className="bg-white rounded-full py-2 px-4 -space-x-4 w-max flex items-center mx-auto font-[sans-serif] mt-4">
      <li className="bg-white text-purple-600 rounded-full z-40 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.3)] px-8 py-3 text-sm font-bold cursor-pointer">
        Trang Chủ
      </li>
      <li className="bg-purple-600 text-white rounded-r-full z-10 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.3)] px-8 py-3 text-sm font-bold cursor-pointer">
        Về Chúng Tôi
      </li>
    </ul>
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 max-w-3xl mx-auto font-sans">
      <blockquote className="text-xl font-bold text-gray-800 mb-12 text-center">
        "This product is simply amazing! It has helped me so much in achieving my goals."
        <cite className="text-base text-gray-600 block mt-2">— John Doe, CEO, Company Name</cite>
      </blockquote>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-base text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquet, ipsum vel iaculis bibendum, justo turpis ullamcorper mauris, non aliquam nisi purus vel nisl.
          </p>
          <p className="text-base text-gray-600">
            Integer efficitur turpis in bibendum tincidunt. Nulla facilisi. Vestibulum fringilla leo et purus consectetur, vel tincidunt dolor rhoncus.
          </p>
        </div>
        <div>
          <p className="text-base text-gray-600 mb-4">
            Nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula. Duis accumsan, nunc et tempus blandit, metus mi consectetur felis turpis vitae ligula.
          </p>
          <p className="text-base text-gray-600">
            consectetur adipiscing elit. Proin aliquam, ipsum vel iaculis bibendum, justo turpis ullamcorper mauris, non aliquam nisi purus vel nisl.
          </p>
        </div>
      </div>
    </div>
    </div>
    )
}