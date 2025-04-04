import { useState } from 'react';

export default function FoodMovies({ 
  combo, 
  onAddItem, 
  onRemoveItem, 
  selectedItems = []
}) {
  const [quantities, setQuantities] = useState(
    combo.reduce((acc, item) => {
      const existingItem = selectedItems.find(i => i.id === item.id);
      return { ...acc, [item.id]: existingItem ? existingItem.quantity : 0 };
    }, {})
  );

  const handleIncrease = (item) => {
    const newQuantity = (quantities[item.id] || 0) + 1;
    setQuantities({
      ...quantities,
      [item.id]: newQuantity
    });
    onAddItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: newQuantity
    });
  };

  const handleDecrease = (item) => {
    if (quantities[item.id] <= 0) return;
    
    const newQuantity = quantities[item.id] - 1;
    setQuantities({
      ...quantities,
      [item.id]: newQuantity
    });
    
    if (newQuantity === 0) {
      onRemoveItem(item.id);
    } else {
      onAddItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: newQuantity
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {combo.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-44 overflow-hidden">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 text-gray-800">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex justify-between items-center mt-2">
              <span className="font-semibold text-orange-600">
                {Number(item.price).toLocaleString()} đ
              </span>
              
              <div className="flex items-center">
                <button
                  onClick={() => handleDecrease(item)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    quantities[item.id] ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="mx-3 w-5 text-center font-medium">
                  {quantities[item.id] || 0}
                </span>
                
                <button
                  onClick={() => handleIncrease(item)}
                  className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
