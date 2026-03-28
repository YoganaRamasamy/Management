package com.inventory.management.service;

import com.inventory.management.entity.Product;
import com.inventory.management.exception.ResourceNotFoundException;
import com.inventory.management.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final EmailService emailService;

    public ProductServiceImpl(ProductRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @Override
    public Product createProduct(Product product) {
        Product saved = repository.save(product);
        
        // Send notification for new product addition
        emailService.sendProductAddedNotification(saved, "admin@example.com");
        
        checkAndSendLowStockAlert(saved);
        return saved;
    }

    @Override
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public Page<Product> getAllProducts(String name, String category, Pageable pageable) {
        if (name != null && !name.isEmpty() && category != null && !category.isEmpty()) {
            return repository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(name, category, pageable);
        } else if (name != null && !name.isEmpty()) {
            return repository.findByNameContainingIgnoreCase(name, pageable);
        } else if (category != null && !category.isEmpty()) {
            return repository.findByCategoryIgnoreCase(category, pageable);
        } else {
            return repository.findAll(pageable);
        }
    }

    @Override
    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public Product updateProduct(Long id, Product product) {

        Product existing = getProductById(id);

        existing.setName(product.getName());
        existing.setQuantity(product.getQuantity());
        existing.setPrice(product.getPrice());
        existing.setCategory(product.getCategory());
        existing.setSupplier(product.getSupplier());

        Product updated = repository.save(existing);
        checkAndSendLowStockAlert(updated);
        return updated;
    }

    @Override
    public byte[] exportProductsToCSV() {
        List<Product> products = repository.findAll();
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("ID,Name,Quantity,Price,Category,Supplier\n");

        for (Product product : products) {
            csvContent.append(product.getId()).append(",")
                    .append(product.getName()).append(",")
                    .append(product.getQuantity()).append(",")
                    .append(product.getPrice()).append(",")
                    .append(product.getCategory()).append(",")
                    .append(product.getSupplier()).append("\n");
        }

        return csvContent.toString().getBytes();
    }

    private void checkAndSendLowStockAlert(Product product) {
        if (product.getQuantity() < 30) {
            // Using a placeholder recipient email. In a real app, this could be from config
            // or user profile.
            emailService.sendLowStockAlert(product.getName(), product.getQuantity(), "admin@example.com");
        }
    }

    @Override
    public void deleteProduct(Long id) {
        repository.delete(getProductById(id));
    }
}