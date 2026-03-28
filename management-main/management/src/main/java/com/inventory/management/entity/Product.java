package com.inventory.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String name;

    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity;

    @Positive(message = "Price must be greater than 0")
    private double price;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Supplier is required")
    private String supplier;
}