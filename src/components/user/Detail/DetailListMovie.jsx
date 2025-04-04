export default function DetailListMovie() {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <iframe
            className="w-full h-64"
            src="https://www.youtube.com/embed/lHuGo6u_upY?si=gji3gIUuP0YkwrfO"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="text-center text-lg font-semibold">Movie 1</div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <iframe
            className="w-full h-64"
            src="https://www.youtube.com/embed/8hTji6rJ1BQ?si=j5h7g2t3hNwxpSx7"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="text-center text-lg font-semibold">Movie 2</div>
        </div>
  
        <div className="flex flex-col items-center space-y-2">
          <iframe
            className="w-full h-64"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=a9dhsuIWbd6cdjG5"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="text-center text-lg font-semibold">Movie 3</div>
        </div>
  
        {/* Bạn có thể thêm nhiều item phim ở đây */}
      </div>
    );
  }
  