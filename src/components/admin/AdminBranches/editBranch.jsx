import { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import citiesData from "../../../public/vietnamAddress.json";
import {
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
} from "../../../api/branchApi";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBranch() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate
  const [update] = useUpdateBranchMutation();
  const { data: branch } = useGetBranchByIdQuery(id);

  const [selectedCity, setSelectedCity] = useState(null);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    city: "",
  });

  useEffect(() => {
    if (branch) {
      setName(branch.branch.name);
      setSelectedCity({
        value: branch.branch.cityId,
        label: branch.branch.city,
      });
    }
  }, [branch]);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const editBranch = async (e) => {
    e.preventDefault();
    setErrors({ name: "", city: "" });

    let isValid = true;

    // Validation
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Tên chi nhánh là bắt buộc." }));
      isValid = false;
    }

    if (!selectedCity) {
      setErrors((prev) => ({ ...prev, city: "Thành phố là bắt buộc." }));
      isValid = false;
    }

    if (!isValid) return;

    const branchData = {
      name,
      city: selectedCity.label,
    };

    try {
      await update({ id, ...branchData });
      toast.success("Cập nhật thành công!");
      navigate("/admin/branches"); // Use navigate instead of window.location.href
    } catch (error) {
      console.error("Error updating branch:", error);
    }
  };

  return (
    <div className="font-[sans-serif] text-[#333] max-w-4xl mx-auto px-6 my-6">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Chỉnh sửa chi nhánh
      </h1>
      <form onSubmit={editBranch}>
        <div className="grid sm:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className="text-[13px] mb-2">Tên chi nhánh</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name || ""}
              placeholder="Nhập tên chi nhánh"
              className="px-2 pt-5 pb-2 bg-white w-full text-sm border-b-2 border-gray-100 focus:border-[#333] outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-[13px] mb-2">Thành phố</label>
            <Select
              className="w-full"
              options={citiesData.map((city) => ({
                value: city.Id,
                label: city.Name,
              }))}
              onChange={handleCityChange}
              value={selectedCity}
              placeholder="Chọn thành phố"
              isClearable
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-10 px-2 py-2.5 w-full rounded-sm text-sm bg-[#333] hover:bg-[#222] text-white"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
