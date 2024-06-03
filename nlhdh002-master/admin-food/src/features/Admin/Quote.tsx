import React, { useState, useEffect } from 'react';
import './Quote.css';

interface Product {
  id: number;
  foodName: string;
  price: number;
  imgFood: string;
}

interface SalesData {
  product: Product;
  salesCount: number;
}

export function Quote() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBRE1JTiIsImlhdCI6MTcxNjgwMzAyMCwiZXhwIjoxNzE3ODgzMDIwfQ.VEu7DQDHudGg5ltSugappzY908DyQ0k8Y0yvBziQA1Q";

    fetch('http://localhost:8081/ADMIN/mostSoldProducts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
      <div className="container">
        <h1 className="title">Top Sản Phẩm Bán Chạy</h1>
        <div className="table-container">
          <table className="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Sản phẩm</th>
              <th>Giá</th>
              <th>Hình ảnh</th>
              <th>Số lượng bán</th>
              <th>Doanh thu</th>
            </tr>
            </thead>
            <tbody>
            {data.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.id}</td>
                  <td>{item.product.foodName}</td>
                  <td>{item.product.price}</td>
                  <td>
                    <img className="img" src={item.product.imgFood} alt={item.product.foodName} width="50" />
                  </td>
                  <td>{item.salesCount}</td>
                  <td>{item.product.price * item.salesCount}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
