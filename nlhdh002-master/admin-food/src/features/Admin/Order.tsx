import React, { useState, useEffect } from 'react';
import './Order.css';

interface Restaurant {
    id: number;
    name: string;
    image: string;
    address: string;
    phone: string;
    revenue: number;
}

export function Order() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBRE1JTiIsImlhdCI6MTcxNjgwMzAyMCwiZXhwIjoxNzE3ODgzMDIwfQ.VEu7DQDHudGg5ltSugappzY908DyQ0k8Y0yvBziQA1Q";

        fetch('http://localhost:8081/ADMIN/top-revenue-restaurant', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map((item: any) => ({
                    id: item[0],
                    name: item[1],
                    image: item[2],
                    address: item[3],
                    phone: item[4],
                    revenue: item[5],
                }));
                setRestaurants(formattedData);
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
            <h1 className="title">Nhà Hàng Doanh Thu Hàng Đầu</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Tên nhà hàng</th>
                        <th>Hình ảnh</th>
                        <th>Địa Chỉ</th>
                        <th>SDT</th>
                        <th>Doanh Thu</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.map(restaurant => (
                        <tr key={restaurant.id}>
                            <td>{restaurant.id}</td>
                            <td>{restaurant.name}</td>
                            <td>
                                <img className="img" src={restaurant.image} alt={restaurant.name} />
                            </td>
                            <td>{restaurant.address}</td>
                            <td>{restaurant.phone}</td>
                            <td>{restaurant.revenue}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
