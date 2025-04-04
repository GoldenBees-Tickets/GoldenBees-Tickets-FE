export default function FormAddTicket() {
    return (
      <>
        <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
            mua vé nhanh
          </div>
          <form className="py-4 px-6" action="" method="POST">
           
          <div className="mb-4">
             
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="appointmentType"
              >
                <option value="consultation">Chọn phim</option>
                <option value="checkup">Checkup</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
  

          <div className="mb-4">
            
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="appointmentType"
              >
                <option value="consultation">Chọn rạp</option>
                <option value="checkup">Checkup</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
  
        
            <div className="mb-4">
            
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="appointmentType"
              >
                <option value="consultation">Chọn ngày</option>
                <option value="checkup">Checkup</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>
  
          
          </form>
        </div>
      </>
    );
  }
  