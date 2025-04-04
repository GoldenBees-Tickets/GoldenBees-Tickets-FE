import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetActorsQuery } from '../../api/actorApi';

import DetailListMovie from '../../components/User/Detail/DetailListMovie';
import FilterMovie from '../../components/User/Detail/FilterMovie';
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function Actor() {
  const { id } = useParams();
  const { data: list, error, isLoading } = useGetActorsQuery();

  const actor = list?.actors?.find((actor) => actor.id === parseInt(id, 10));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading actor details.</div>;

  if (!actor) return <div>Actor not found.</div>;

  const { name, dob, bio, gender, profile_picture, createdAt } = actor;

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-[65%] p-4">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
              <img
                src={`${API_BASE_URL}/${profile_picture}`}
                alt={name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full md:w-2/3 p-4 md:pl-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{name}</h1>
              <div className="text-sm text-gray-700 mb-2">
                <strong>Ngày Sinh:</strong> {dob}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <strong>Giới tính:</strong> {gender === 'Female' ? 'Nữ' : 'Nam'}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <strong>Tiểu sử:</strong>
                <p className="mt-2">{bio || "No bio available"}</p>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <strong>Ngày tạo:</strong> {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <FilterMovie />
      </div>

      <div className="w-full md:w-[35%] p-4 mt-6 md:mt-0">
        <DetailListMovie />
      </div>
    </div>
  );
}
