package com.backend.intellicop.controller;

import java.io.ByteArrayOutputStream;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class DatabaseHealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ------------------ JSON API ------------------
    @GetMapping("/api/health/database")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        long startTime = System.currentTimeMillis();

        try {
            jdbcTemplate.execute("SELECT 1");
            long latency = System.currentTimeMillis() - startTime;

            String dbProduct = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductName();
            String dbVersion = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductVersion();

            response.put("status", "UP");
            response.put("latencyMs", latency);
            response.put("healthPercentage", calculateHealthPercentage(latency));
            response.put("database", dbProduct);
            response.put("version", dbVersion);
            response.put("timestamp", startTime);

        } catch (SQLException e) {
            return handleDatabaseError(response, startTime, e);
        } catch (Exception e) {
            return handleGenericError(response, startTime, e);
        }

        return ResponseEntity.ok(response);
    }

    // ------------------ PDF Report API ------------------
    @GetMapping("/api/health/database/report")
    public void generateDatabaseHealthReport(HttpServletResponse response) {
        Map<String, Object> healthData = getDatabaseHealthData();

        try {
            Document document = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Paragraph title = new Paragraph("Database Health Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("Generated at: " + new java.util.Date()));
            document.add(Chunk.NEWLINE);

            for (Map.Entry<String, Object> entry : healthData.entrySet()) {
                document.add(new Paragraph(entry.getKey() + ": " + entry.getValue()));
            }

            document.close();

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=database_health_report.pdf");
            response.getOutputStream().write(baos.toByteArray());
            response.getOutputStream().flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ------------------ Helper Methods ------------------
    private Map<String, Object> getDatabaseHealthData() {
        Map<String, Object> healthData = new HashMap<>();
        long timestamp = System.currentTimeMillis();

        try {
            jdbcTemplate.execute("SELECT 1");
            long latency = System.currentTimeMillis() - timestamp;

            String dbProduct = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductName();
            String dbVersion = jdbcTemplate.getDataSource().getConnection().getMetaData().getDatabaseProductVersion();

            healthData.put("status", "UP");
            healthData.put("latencyMs", latency);
            healthData.put("healthPercentage", calculateHealthPercentage(latency));
            healthData.put("database", dbProduct);
            healthData.put("version", dbVersion);
            healthData.put("timestamp", timestamp);

        } catch (SQLException e) {
            healthData.put("status", "DOWN");
            healthData.put("error", e.getMessage());
            healthData.put("latencyMs", -1);
            healthData.put("healthPercentage", 0);
            healthData.put("timestamp", timestamp);
        } catch (Exception e) {
            healthData.put("status", "ERROR");
            healthData.put("error", e.getMessage());
            healthData.put("latencyMs", -1);
            healthData.put("healthPercentage", 0);
            healthData.put("timestamp", timestamp);
        }

        return healthData;
    }

    private int calculateHealthPercentage(long latency) {
        if (latency > 1000) return 0;
        if (latency > 500) return 25;
        if (latency > 200) return 50;
        if (latency > 100) return 75;
        return 100;
    }

    private ResponseEntity<Map<String, Object>> handleDatabaseError(
            Map<String, Object> response, long timestamp, SQLException e) {

        response.put("status", "DOWN");
        response.put("error", "Database connection failed");
        response.put("errorCode", e.getErrorCode());
        response.put("sqlState", e.getSQLState());
        response.put("latencyMs", -1);
        response.put("healthPercentage", 0);
        response.put("timestamp", timestamp);

        return ResponseEntity.status(503).body(response);
    }

    private ResponseEntity<Map<String, Object>> handleGenericError(
            Map<String, Object> response, long timestamp, Exception e) {

        response.put("status", "ERROR");
        response.put("error", e.getMessage());
        response.put("latencyMs", -1);
        response.put("healthPercentage", 0);
        response.put("timestamp", timestamp);

        return ResponseEntity.internalServerError().body(response);
    }
}
