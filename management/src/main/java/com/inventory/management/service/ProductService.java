package com.inventory.management.service;

import com.inventory.management.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {


    Product createProduct(Product product);
    List<Product> getAllProducts();
    Page<Product> getAllProducts(String name, String category, Pageable pageable);
    Product getProductById(Long id);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    byte[] exportProductsToCSV();
}