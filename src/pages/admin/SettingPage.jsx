import { FaUser, FaLock, FaDatabase, FaBuilding, FaUsers, FaCog } from "react-icons/fa";
import TicketPricing from "@/components/admin/AdminSetting/TicketPricing";

export default function SettingsPage() {

  return (
    <div className="flex w-full bg-gray-100 mr-4">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-md">
        <h2 className="text-lg font-bold mb-4">Cài đặt</h2>
        <ul className="space-y-2">
          <li className="flex items-center p-2 bg-blue-100 rounded-md text-blue-600">
            <FaUser className="mr-2" /> Profile
          </li>
          <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
            <FaLock className="mr-2" /> Giá vé
          </li>
          <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
            <FaDatabase className="mr-2" /> Data
          </li>
          <hr />
          <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
            <FaBuilding className="mr-2" /> Company details
          </li>
          <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
            <FaUsers className="mr-2" /> Team members
          </li>
          <li className="flex items-center p-2 hover:bg-gray-200 rounded-md cursor-pointer">
            <FaCog className="mr-2" /> Format settings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      {/* <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Team Members</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add Member</button>
          </div>
          
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Actions</th>
                <th className="p-3">Member</th>
                <th className="p-3">Manager</th>
                <th className="p-3">Admin</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Create new job and stages</td>
                <td className="p-3 text-center"><input type="checkbox" /></td>
                <td className="p-3 text-center"><input type="checkbox" /></td>
                <td className="p-3 text-center"><input type="checkbox" checked /></td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Edit job and stages</td>
                <td className="p-3 text-center"><input type="checkbox" /></td>
                <td className="p-3 text-center"><input type="checkbox" checked /></td>
                <td className="p-3 text-center"><input type="checkbox" checked /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
      <TicketPricing />
    </div>
  );
}