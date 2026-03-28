package com.inventory.management.controller;
 
import com.inventory.management.service.ProductService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ProductService productService;

    public ReportController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportProducts() {
        byte[] csvData = productService.exportProductsToCSV();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inventory_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
