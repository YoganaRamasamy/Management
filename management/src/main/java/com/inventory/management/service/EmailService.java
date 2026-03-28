package com.inventory.management.service;

import com.inventory.management.entity.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendLowStockAlert(String productName, int currentQuantity, String recipientEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject("Low Stock Alert: " + productName);
        message.setText("The stock for product '" + productName + "' is low.\n" +
                "Current Quantity: " + currentQuantity + "\n" +
                "Please restock soon.");

        try {
            mailSender.send(message);
            System.out.println("Low stock email sent for: " + productName);
        } catch (Exception e) {
            System.err.println("Failed to send low stock email: " + e.getMessage());
        }
    }

    public void sendProductAddedNotification(Product product, String recipientEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject("New Product Added: " + product.getName());
        message.setText("A new product has been added to the inventory:\n\n" +
                "Name: " + product.getName() + "\n" +
                "Quantity: " + product.getQuantity() + "\n" +
                "Price: $" + product.getPrice() + "\n" +
                "Category: " + product.getCategory() + "\n" +
                "Supplier: " + product.getSupplier() + "\n\n" +
                "Best regards,\nInventory Management System");

        try {
            mailSender.send(message);
            System.out.println("Product added email sent for: " + product.getName());
        } catch (Exception e) {
            System.err.println("Failed to send product addition email: " + e.getMessage());
        }
    }
}
