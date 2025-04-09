import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../user/Header";
import Footer from "../user/Footer";
import ChatBox from "@/components/ChatBox/ChatBox";

export default function RootUser() {
  const [isDarkMode, setIsDarkMode] = useState(false);


  const handleDarkModeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const body = document.body;

    if (isDarkMode) {
      body.classList.add("bg-black", "text-white");
      body.classList.remove("bg-white", "text-black");

      const links = document.querySelectorAll("a");
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

      links.forEach((link) => {
        link.classList.add("text-white", "hover:text-blue-400");
        link.classList.remove("text-black", "hover:text-blue-600");
      });

      headers.forEach((header) => {
        header.classList.add("text-white");
        header.classList.remove("text-black");
      });
    } else {
      body.classList.add("bg-white", "text-black");
      body.classList.remove("bg-black", "text-white");

      const links = document.querySelectorAll("a");
      const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

      links.forEach((link) => {
        link.classList.add("text-black", "hover:text-blue-600");
        link.classList.remove("text-white", "hover:text-blue-400");
      });

      headers.forEach((header) => {
        header.classList.add("text-black");
        header.classList.remove("text-white");
      });
    }
  }, [isDarkMode]);

  return (
    <>
      <Header onDarkModeToggle={handleDarkModeToggle} isDarkMode={isDarkMode} />
      <ChatBox />
      <main className="min-h-screen mt-[75px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
