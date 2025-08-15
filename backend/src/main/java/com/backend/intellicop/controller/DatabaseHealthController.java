package com.backend.intellicop.controller;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseHealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/health/database")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        long startTime = System.currentTimeMillis();

        try {
            // Test simple query
            jdbcTemplate.execute("SELECT 1");
            long latency = System.currentTimeMillis() - startTime;
            
            // Get additional DB metrics
            String dbProduct = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductName();
            String dbVersion = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductVersion();
            
            response.put("status", "UP");
            response.put("latencyMs", latency);
            response.put("healthPercentage", calculateHealthPercentage(latency));
            response.put("database", dbProduct);
            response.put("version", dbVersion);
            response.put("timestamp", startTime);
            
            return ResponseEntity.ok(response);
            
        } catch (SQLException e) {
            return handleDatabaseError(response, startTime, e);
        } catch (Exception e) {
            return handleGenericError(response, startTime, e);
        }
    }

    private int calculateHealthPercentage(long latency) {
        // More sophisticated calculation
        if (latency > 1000) return 0;
        if (latency > 500) return 25;
        if (latency > 200) return 50;
        if (latency > 100) return 75;
        return 100;
    }

    private ResponseEntity<Map<String, Object>> handleDatabaseError(
            Map<String, Object> response, 
            long timestamp,
            SQLException e) {
        
        response.put("status", "DOWN");
        response.put("error", "Database connection failed");
        response.put("errorCode", e.getErrorCode());
        response.put("sqlState", e.getSQLState());
        response.put("latencyMs", -1);
        response.put("healthPercentage", 0);
        response.put("timestamp", timestamp);
        
        return ResponseEntity.status(503).body(response); // Service Unavailable
    }

    private ResponseEntity<Map<String, Object>> handleGenericError(
            Map<String, Object> response, 
            long timestamp,
            Exception e) {
        
        response.put("status", "ERROR");
        response.put("error", e.getMessage());
        response.put("latencyMs", -1);
        response.put("healthPercentage", 0);
        response.put("timestamp", timestamp);
        
        return ResponseEntity.internalServerError().body(response);
    }
}