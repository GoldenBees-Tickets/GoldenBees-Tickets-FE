import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import Select from "react-select";
import citiesData from "../../../public/vietnamAddress.json";
import { useCreateCinemaMutation } from "../../../api/cinemaApi";
import { useGetBranchesQuery } from "../../../api/branchApi";
import { IoClose } from "react-icons/io5";

export default function AddCinema({ setAddCinema }) {
  const { data: listBranches } = useGetBranchesQuery();
  const [createCinema] = useCreateCinemaMutation();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selecteddistricts, setSelecteddistricts] = useState(null);
  const [selectedWards, setSelectedwards] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [name, setName] = useState(""); 
  const [errors, setErrors] = useState({
    name: "",
    city: "",
    districts: "",
    wards: "",
    street: "",
    branch_id: "",
  });

  const handleCityChange = (selectedOption) => {
    const listDistricts = citiesData.find(
      (item) => item.Id === selectedOption.value
    );
    setSelectedCity(listDistricts);
    setSelecteddistricts(null);
    setSelectedwards(null);
    setSelectedStreet(null);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const handledistrictsChange = (selectedOption) => {
    const listWards = selectedCity?.Districts.find(
      (item) => item.Id === selectedOption.value
    );
    setSelecteddistricts(listWards);
    setSelectedwards(null);
    setSelectedStreet(null);
    setErrors((prev) => ({ ...prev, districts: "" }));
  };

  const handlewardsChange = (selectedOption) => {
    setSelectedwards(selectedOption?.label);
    setSelectedStreet(null);
    setErrors((prev) => ({ ...prev, wards: "" }));
  };

  const handleStreetChange = (selectedOption) => {
    setSelectedStreet(selectedOption);
    setErrors((prev) => ({ ...prev, street: "" }));
  };

  const handleBranchName = (branch) => {
    setBranchId(branch?.value); 
  };

  const addCinema = async (e) => {
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

    if (!name) {
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
      name: name,
      city: selectedCity?.Name,
      district: selecteddistricts?.Name,
      ward: selectedWards,
      street: selectedStreet,
      branch_id: branchId,
    };

    try {
      const response = await createCinema(cinemaData);
      if (response?.data) {
        message.success("Thêm cinema thành công!");
        setAddCinema(false);
        setName(""); 
        setSelectedCity(null);
        setSelecteddistricts(null);
        setSelectedwards(null);
        setSelectedStreet(null);
        setBranchId(null);
      }
    } catch (error) {
      message.error("Thêm cinema thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-xl font-bold text-gray-800">Thêm Cinema</h1>
        <Button 
          type="text" 
          icon={<IoClose size={20} />} 
          onClick={() => setAddCinema(false)}
          className="flex items-center justify-center"
        />
      </div>

      <Form layout="vertical" onFinish={addCinema} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên Cinema */}
          <Form.Item 
            label="Tên" 
            validateStatus={errors.name ? "error" : ""} 
            help={errors.name}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên cinema"
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
              options={citiesData.map((city) => ({
                value: city.Id,
                label: city.Name,
              }))}
              onChange={handleCityChange}
              value={selectedCity?.label}
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
              options={selectedCity
                ? selectedCity?.Districts.map((district) => ({
                    value: district.Id,
                    label: district.Name,
                  }))
                : []}
              onChange={handledistrictsChange}
              value={selecteddistricts?.label}
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
              options={selecteddistricts
                ? selecteddistricts?.Wards.map((ward) => ({
                    value: ward.Id,
                    label: ward.Name,
                  }))
                : []}
              onChange={handlewardsChange}
              value={selectedWards?.label}
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
              onChange={(e) => handleStreetChange(e.target.value)}
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
              options={listBranches
                ? listBranches?.branches?.map((branch) => ({
                    value: branch.id,
                    label: branch.name,
                  }))
                : []}
              onChange={handleBranchName}
              value={branchId
                ? { value: branchId, label: listBranches?.branches?.find((branch) => branch.id === branchId)?.name }
                : null}
              placeholder="Chọn chi nhánh"
              isClearable
            />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button onClick={() => setAddCinema(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
        </div>
      </Form>
    </div>
  );
}
