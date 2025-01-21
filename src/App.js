import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrder, setNewOrder] = useState({
    orderDescription: "",
    productIds: [],
  });
  const [products, setProducts] = useState([]);
  const [newForm, setNewForm] = useState(false);
  const handleNewForm = async () => {
    setNewForm(true);
  };
  // Fetch orders and products from API
  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4005/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4005/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchQuery) ||
      order.orderDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewOrderChange = (event) => {
    const { name, value } = event.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleProductSelection = (event) => {
    const { value, checked } = event.target;
    const productId = parseInt(value, 10);
    setNewOrder((prevOrder) => {
      const updatedProductIds = checked
        ? [...prevOrder.productIds, productId]
        : prevOrder.productIds.filter((id) => id !== productId);
      return { ...prevOrder, productIds: updatedProductIds };
    });
  };

  const handleNewOrderSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:4005/api/orders", newOrder);
      fetchOrders();
      setNewOrder({ orderDescription: "", productIds: [] });
    } catch (error) {
      console.error("Error creating new order:", error);
    }
    setNewForm(false);
  };
  
  const handleCancel = async () => {
    setNewForm(false);
  };

  return (
    <div className="App">
      {newForm ? (
        <>
          <header className="App-header">
            <h1>New Order</h1>
          </header>
          <div className="new-order-form">
            <h2>Add New Order</h2>
            <form onSubmit={handleNewOrderSubmit}>
              <div className="form-group">
                <label htmlFor="orderDescription">Order Description:</label>
                <input
                  type="text"
                  id="orderDescription"
                  name="orderDescription"
                  value={newOrder.orderDescription}
                  onChange={handleNewOrderChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Products:</label>
                {products.map((product) => (
                  <div key={product.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={product.id}
                        checked={newOrder.productIds.includes(product.id)}
                        onChange={handleProductSelection}
                      />
                      {product.productName}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <button type="submit" className="form-button">
                  Book Order
                </button>
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <header className="App-header">
            <h1>Order Management</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Order ID or Description"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </header>
          <main>
            <div className="order-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Description</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.orderDescription}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" onClick={handleNewForm}>
              New Order
            </button>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
