import { useState } from "react";
import Select from "react-select";
import citiesData from "../../../public/vietnamAddress.json";
import { useCreateBranchMutation } from "../../../api/branchApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddBranch() {
  const [Add] = useCreateBranchMutation();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    city: "",
  });

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const addBranch = async (e) => {
    e.preventDefault();
    setErrors({ name: "", city: "" });

    let isValid = true;

    // Validation
    if (!name) {
      setErrors((prev) => ({ ...prev, name: "Tên là bắt buộc." }));
      isValid = false;
    }

    if (!selectedCity) {
      setErrors((prev) => ({ ...prev, city: "Thành phố là bắt buộc." }));
      isValid = false;
    }

    if (!isValid) return;

    const branchData = {
      name: name,
      city: selectedCity.label,
    };

    try {
      await Add(branchData).unwrap();
      toast.success("Thêm chi nhánh thành công!");
      setName("");
      setSelectedCity(null);

      navigate("/admin/branches");
    } catch (error) {
      console.error("Thêm chi nhánh thất bại:", error);
      toast.error("Thêm chi nhánh thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <form onSubmit={addBranch} className="font-[sans-serif] text-[#333] max-w-4xl mx-auto px-6 my-6">
        <h1 className="text-4xl font-bold mb-12 text-center">Thêm chi nhánh mới</h1>
        <div className="grid sm:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <label className="text-[13px] mb-2">Tên</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Nhập tên"
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
              options={citiesData.map(city => ({ value: city.Name, label: city.Name, id: city.Id }))}
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
          Gửi
        </button>
      </form>
    </>
  );
}

