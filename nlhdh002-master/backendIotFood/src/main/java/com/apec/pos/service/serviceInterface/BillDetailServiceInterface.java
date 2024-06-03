package com.apec.pos.service.serviceInterface;

import com.apec.pos.dto.BillDetailDTO.BillDetailTopProDuct;

import java.util.List;

public interface BillDetailServiceInterface {
    List<BillDetailTopProDuct> getMostSoldProducts();
    public List<Object[]> findTopRevenueRestaurant();
}
