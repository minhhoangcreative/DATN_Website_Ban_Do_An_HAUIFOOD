package com.apec.pos.controller.admin;

import com.apec.pos.dto.BillDetailDTO.BillDetailTopProDuct;
import com.apec.pos.service.BillDetailService;
import com.apec.pos.service.BillService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "ADMIN")
@SecurityRequirement(name = "bearerAuth")
public class BillDetailController {
    @Autowired
    private BillDetailService billDetailService;

    @GetMapping("/mostSoldProducts")
    public List<BillDetailTopProDuct> getMostSoldProducts() {
        return billDetailService.getMostSoldProducts();
    }

    @GetMapping("/top-revenue-restaurant")
    public ResponseEntity<List<Object[]>> getTopRevenueRestaurant() {
        List<Object[]> topRevenueRestaurants = billDetailService.findTopRevenueRestaurant();
        return ResponseEntity.ok(topRevenueRestaurants);
    }
}
