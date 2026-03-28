package com.inventory.management.controller;

import com.inventory.management.entity.Product;
import com.inventory.management.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(service.createProduct(product));
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            Pageable pageable) {
        return ResponseEntity.ok(service.getAllProducts(name, category, pageable));
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,@Valid
                          @RequestBody Product product) {
        return service.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Deleted Successfully";
    }
}