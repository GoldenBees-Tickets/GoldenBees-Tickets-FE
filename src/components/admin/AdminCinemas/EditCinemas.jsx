import { useState } from "react";
import { Form, Input, Button, Select as AntSelect, message } from "antd";
import Select from "react-select";
import citiesData from "../../../public/vietnamAddress.json"; // Dữ liệu thành phố
import { useUpdateCinemaMutation } from "../../../api/cinemaApi"; // API để lấy và cập nhật cinema
import { useNavigate } from "react-router-dom";
import { useGetBranchesQuery } from "../../../api/branchApi"; // API để lấy danh sách chi nhánh
import { IoClose } from "react-icons/io5";

export default function EditCinema({
  id,
  name,
  city,
  district,
  ward,
  street,
  branch_id,
  setToggleUpdateCinema,
}) {
  const navigate = useNavigate();
  const { data: listBranches } = useGetBranchesQuery();
  const [updateCinema] = useUpdateCinemaMutation();

  const [selectedCity, setSelectedCity] = useState(city);
  const [selecteddistricts, setSelecteddistricts] = useState(district);
  const [selectedWards, setSelectedwards] = useState(ward);
  const [selectedStreet, setSelectedStreet] = useState(street);
  const [branchId, setBranchId] = useState(branch_id);
  const [selectName, setSelectName] = useState(name);

  const [errors, setErrors] = useState({
    name: "",
    city: "",
    districts: "",
    wards: "",
    street: "",
    branch_id: "",
  });

  const handleCityChange = (cityOption) => {
    const city = citiesData.find((item) => item.Name === cityOption.value);
    setSelectedCity(city?.Name);
    setSelecteddistricts(null);
    setSelectedwards(null);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const handledistrictsChange = (districtOption) => {
    const district = citiesData
      ?.filter((item) => item.Name === selectedCity)[0]
      ?.Districts?.find((item) => item.Name === districtOption.value);

    setSelecteddistricts(district?.Name);
    setSelectedwards(null);
    setErrors((prev) => ({ ...prev, districts: "" }));
  };

  const handlewardsChange = (wardOption) => {
    setSelectedwards(wardOption?.value);
    setErrors((prev) => ({ ...prev, wards: "" }));
  };

  const handleStreetChange = (e) => {
    setSelectedStreet(e.target.value);
    setErrors((prev) => ({ ...prev, street: "" }));
  };

  const handleBranchName = (branch) => {
    setBranchId(branch?.value);
  };

  const editCinema = async (e) => {
    e.preventDefault();

    setErrors({
      name: "",
      city: "",
      districts: "",
      wards: "",
      street: "",
      branch_id: "",
    });

    let isValid = true;

    if (!selectName) {
      setErrors((prev) => ({ ...prev, name: "Tên là bắt buộc." }));
      isValid = false;
    }

    if (!selectedCity) {
      setErrors((prev) => ({ ...prev, city: "Thành phố là bắt buộc." }));
      isValid = false;
    }

    if (!selecteddistricts) {
      setErrors((prev) => ({ ...prev, districts: "Quận/Huyện là bắt buộc." }));
      isValid = false;
    }

    if (!selectedWards) {
      setErrors((prev) => ({ ...prev, wards: "Phường/Xã là bắt buộc." }));
      isValid = false;
    }

    if (!selectedStreet) {
      setErrors((prev) => ({ ...prev, street: "Tên đường là bắt buộc." }));
      isValid = false;
    }

    if (!branchId) {
      setErrors((prev) => ({ ...prev, branch_id: "Chi nhánh là bắt buộc." }));
      isValid = false;
    }

    if (!isValid) return;

    const cinemaData = {
      name: selectName,
      city: selectedCity,
      district: selecteddistricts,
      ward: selectedWards,
      street: selectedStreet,
      branch_id: branchId,
    };

    try {
      await updateCinema({ id, ...cinemaData });
      message.success("Cập nhật rạp thành công!");
      setToggleUpdateCinema(false);
    } catch (error) {
      message.error("Cập nhật rạp thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800">Chỉnh sửa rạp chiếu</h1>
        <Button 
          type="text" 
          icon={<IoClose size={20} />} 
          onClick={() => setToggleUpdateCinema(false)}
          className="flex items-center justify-center"
        />
      </div>

      <Form layout="vertical" onFinish={editCinema} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên Cinema */}
          <Form.Item 
            label="Tên" 
            validateStatus={errors.name ? "error" : ""} 
            help={errors.name}
          >
            <Input
              value={selectName}
              onChange={(e) => setSelectName(e.target.value)}
              placeholder="Nhập tên rạp"
            />
          </Form.Item>

          {/* Thành phố */}
          <Form.Item 
            label="Thành phố" 
            validateStatus={errors.city ? "error" : ""} 
            help={errors.city}
          >
            <Select
              className="w-full"
              options={
                citiesData?.map((city) => ({
                  value: city?.Name,
                  label: city?.Name,
                })) || []
              }
              onChange={handleCityChange}
              value={
                selectedCity ? { value: selectedCity, label: selectedCity } : null
              }
              placeholder="Chọn thành phố"
              isClearable
            />
          </Form.Item>

          {/* Quận/Huyện */}
          <Form.Item 
            label="Quận/Huyện" 
            validateStatus={errors.districts ? "error" : ""} 
            help={errors.districts}
          >
            <Select
              className="w-full"
              options={
                citiesData
                  ?.filter((item) => item.Name === selectedCity)[0]
                  ?.Districts?.map((district) => ({
                    value: district?.Name,
                    label: district?.Name,
                  })) || []
              }
              onChange={handledistrictsChange}
              value={
                selecteddistricts
                  ? { value: selecteddistricts, label: selecteddistricts }
                  : null
              }
              placeholder="Chọn quận/huyện"
              isClearable
            />
          </Form.Item>

          {/* Phường/Xã */}
          <Form.Item 
            label="Phường/Xã" 
            validateStatus={errors.wards ? "error" : ""} 
            help={errors.wards}
          >
            <Select
              className="w-full"
              options={
                citiesData
                  ?.filter((item) => item.Name === selectedCity)[0]
                  ?.Districts?.filter(
                    (item) => item.Name === selecteddistricts
                  )[0]
                  ?.Wards?.map((ward) => ({
                    value: ward?.Name,
                    label: ward?.Name,
                  })) || []
              }
              onChange={handlewardsChange}
              value={
                selectedWards
                  ? { value: selectedWards, label: selectedWards }
                  : null
              }
              placeholder="Chọn phường/xã"
              isClearable
            />
          </Form.Item>

          {/* Đường */}
          <Form.Item 
            label="Tên đường" 
            validateStatus={errors.street ? "error" : ""} 
            help={errors.street}
          >
            <Input
              value={selectedStreet}
              onChange={handleStreetChange}
              placeholder="Nhập số nhà và tên đường"
            />
          </Form.Item>

          {/* Chi nhánh */}
          <Form.Item 
            label="Chi nhánh" 
            validateStatus={errors.branch_id ? "error" : ""} 
            help={errors.branch_id}
          >
            <Select
              className="w-full"
              options={
                listBranches?.branches?.map((branch) => ({
                  value: branch.id,
                  label: branch.name,
                })) || []
              }
              onChange={handleBranchName}
              value={
                branchId && listBranches?.branches
                  ? {
                      value: branchId,
                      label: listBranches?.branches?.find(
                        (branch) => branch.id === branchId
                      )?.name,
                    }
                  : null
              }
              placeholder="Chọn chi nhánh"
              isClearable
            />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button onClick={() => setToggleUpdateCinema(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
}
