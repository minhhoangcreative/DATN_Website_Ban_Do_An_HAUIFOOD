package com.apec.pos.service;

import com.apec.pos.dto.BillDetailDTO.BillDetailTopProDuct;
import com.apec.pos.entity.FoodEntity;
import com.apec.pos.repository.*;
import com.apec.pos.repository.Interface.BillDetailRepositoryInterface;
import com.apec.pos.repository.Interface.FoodRepositoryInterface;
import com.apec.pos.service.serviceInterface.BillDetailServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BillDetailService implements BillDetailServiceInterface {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private BillDetailRepositoryInterface billDeTailRepository;

    @Autowired
    private FoodRepositoryInterface foodRepository;

    @Override
    public List<BillDetailTopProDuct> getMostSoldProducts() {
        List<BillDetailTopProDuct> billDetailTopProDucts = new ArrayList<>();
        List<Object[]> mostSoldProducts = billDeTailRepository.findMostSoldProducts();
        for (Object[] product : mostSoldProducts) {
            FoodEntity food = foodRepository.findFoodById((Integer) product[0]);
            BillDetailTopProDuct billDetailTopProDuct = new BillDetailTopProDuct(food, ((Long) product[1]).intValue());
            billDetailTopProDucts.add(billDetailTopProDuct);
        }
        return billDetailTopProDucts;
    }
    @Override
    public List<Object[]> findTopRevenueRestaurant() {
        return billDeTailRepository.findTopRevenueRestaurant();
    }

}
