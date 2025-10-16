package com.backend.intellicop.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.intellicop.entity.CompletedVisitor;
import com.backend.intellicop.entity.VisitorMeeting;
import com.backend.intellicop.service.VisitorMeetingService;

@RestController
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Adjust if frontend port differs
public class VisitorMeetingController {

    @Autowired
    private VisitorMeetingService visitorMeetingService;

    /** ✅ Get all visitors */
    @GetMapping
    public List<VisitorMeeting> getAllVisitors() {
        return visitorMeetingService.getAllVisitors();
    }

    /** ✅ Get today’s visitors */
    @GetMapping("/today")
    public List<VisitorMeeting> getTodayVisitors() {
        LocalDate today = LocalDate.now();
        return visitorMeetingService.getVisitorsByDate(today);
    }

    /** ✅ Get upcoming visitors */
    @GetMapping("/upcoming")
    public List<VisitorMeeting> getUpcomingVisitors() {
        LocalDate today = LocalDate.now();
        return visitorMeetingService.getUpcomingVisitors(today);
    }

    /** ✅ Schedule new visitor */
    @PostMapping
    public VisitorMeeting scheduleVisitor(@RequestBody VisitorMeeting visitor) {
        return visitorMeetingService.scheduleVisitor(visitor);
    }

    /** ✅ Update visitor (reschedule) */
    @PutMapping("/{id}")
    public VisitorMeeting updateVisitor(@PathVariable Long id, @RequestBody VisitorMeeting updatedVisitor) {
        return visitorMeetingService.updateVisitor(id, updatedVisitor);
    }

    /** ✅ Delete visitor */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisitor(@PathVariable Long id) {
        visitorMeetingService.deleteVisitor(id);
        return ResponseEntity.ok().build();
    }

    /** ✅ Update visitor status (Completed / Cancelled) */
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        visitorMeetingService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    /** ✅ Get all completed visitors (from new table) */
    @GetMapping("/completed")
    public List<CompletedVisitor> getAllCompletedVisitors() {
        return visitorMeetingService.getAllCompletedVisitors();
    }

    /** ✅ Mark visitor as completed and move to completed table */
    @PutMapping("/{id}/complete")
    public ResponseEntity<Void> markVisitorCompleted(@PathVariable Long id) {
        visitorMeetingService.updateStatus(id, "Completed");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/visitors/completed")
    public List<CompletedVisitor> getCompletedVisitors() {
        return visitorMeetingService.getAllCompletedVisitors();
    }

}
