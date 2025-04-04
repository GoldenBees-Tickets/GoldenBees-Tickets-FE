import { useState } from "react";
import { Button } from "antd";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import ListShowtimes from "@/components/admin/AdminShowtime/ListShowtimes";
import { useGetUserQuery } from "@/api/userApi";
import { useMemo } from "react";

export default function Showtime() {
  const userStorage = JSON.parse(localStorage.getItem("user"));
  const id = userStorage?.id;  

  const { data: user } = useGetUserQuery(id, {
    skip: !id,
  });  

  const userData = useMemo(() => user?.user || {}, [user]);
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Suất chiếu</h2>
        <Link to={`create?branch_id=${userData.branch_id}`}>
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center"
          >
            Thêm Suất chiếu
          </Button>
        </Link>
      </div>
      
      <div className="mt-4">
        <ListShowtimes branch_id={userData.branch_id} />
      </div>
    </div>
  );
}
