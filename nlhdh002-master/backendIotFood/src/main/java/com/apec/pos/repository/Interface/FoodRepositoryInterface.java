package com.apec.pos.repository.Interface;

import com.apec.pos.entity.FoodEntity;
import org.springframework.data.repository.CrudRepository;

public interface FoodRepositoryInterface extends CrudRepository<FoodEntity, Integer> {
    FoodEntity findFoodById(Integer id);
}