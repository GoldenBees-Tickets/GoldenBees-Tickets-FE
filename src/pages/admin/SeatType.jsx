import ListSeatType from "@/components/admin/AdminSeatType/ListSeatType";
import { Card } from "antd";

export default function SeatType() {
  return (
    <div className="p-6">
      <Card className="shadow-md">
        <ListSeatType />
      </Card>
    </div>
  );
}
