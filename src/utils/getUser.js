import { useGetUserQuery } from "@/api/userApi";

export const getUser = async () => {
  const dataStorage = JSON.parse(localStorage.getItem("user"));
  const id = dataStorage?.id;
  const user = await useGetUserQuery(id);
  
  return user?.data.user;
};
