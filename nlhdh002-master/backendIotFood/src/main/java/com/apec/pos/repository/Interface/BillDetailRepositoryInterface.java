package com.apec.pos.repository.Interface;

import com.apec.pos.entity.BillDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillDetailRepositoryInterface extends JpaRepository<BillDetailEntity, Long> {

    @Query("SELECT b.foodEntityId, SUM(b.quantity) AS totalQuantity " +
            "FROM BillDetailEntity b " +
            "GROUP BY b.foodEntityId " +
            "ORDER BY totalQuantity DESC LIMIT 20 ")
    List<Object[]> findMostSoldProducts();


    @Query("SELECT r.id AS restaurantId, r.restaurantName,r.imgRes,r.address, r.phoneNumber, SUM(b.quantity * f.price) AS totalRevenue " +
            "FROM BillDetailEntity b " +
            "JOIN FoodEntity f ON b.foodEntityId = f.id " +
            "JOIN RestaurantEntity r ON f.restaurantEntityId = r.id " +
            "GROUP BY r.id, r.restaurantName " +
            "ORDER BY totalRevenue DESC LIMIT 20")
    List<Object[]> findTopRevenueRestaurant();
}