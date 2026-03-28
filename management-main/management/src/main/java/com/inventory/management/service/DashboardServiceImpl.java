package com.inventory.management.service;

import com.inventory.management.entity.Product;
import com.inventory.management.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;

    public DashboardServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        List<Product> allProducts = productRepository.findAll();
        
        long totalProducts = allProducts.size();
        
        long lowStockCount = productRepository.findByQuantityLessThan(30).size();
        
        double totalStockValue = allProducts.stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("lowStockCount", lowStockCount);
        stats.put("totalStockValue", totalStockValue);
        
        return stats;
    }
}
