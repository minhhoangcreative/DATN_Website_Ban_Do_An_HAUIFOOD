package com.apec.pos.dto.BillDetailDTO;


import com.apec.pos.entity.FoodEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDetailTopProDuct {
    private FoodEntity product;
    private Integer salesCount;
}
