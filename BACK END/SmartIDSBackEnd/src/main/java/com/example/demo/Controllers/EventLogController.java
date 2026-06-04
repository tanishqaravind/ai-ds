package com.example.demo.Controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entites.EventLog;
import com.example.demo.Repositories.EventLogRepository;

@RestController
@RequestMapping("/api/eventlogs")
@CrossOrigin(origins = "*")
public class EventLogController {

    @Autowired
    private EventLogRepository eventLogRepo;

    // 1️⃣ Get all event logs
    @GetMapping("/all")
    public ResponseEntity<List<EventLog>> getAllEventLogs() {
        List<EventLog> logs = eventLogRepo.findAll();
        return ResponseEntity.ok(logs);
    }

    // 2️⃣ Get all event logs by Analyst email
    @GetMapping("/by-analyst/{email}")
    public ResponseEntity<List<EventLog>> getLogsByAnalyst(@PathVariable String email) {
        List<EventLog> logs = eventLogRepo.findByUserEmailAndUserRole(email, "Analyst");
        return ResponseEntity.ok(logs);
    }

    // 3️⃣ Get all event logs by Developer email
    @GetMapping("/by-developer/{email}")
    public ResponseEntity<List<EventLog>> getLogsByDeveloper(@PathVariable String email) {
        List<EventLog> logs = eventLogRepo.findByUserEmailAndUserRole(email, "Developer");
        return ResponseEntity.ok(logs);
    }

    // 4️⃣ Get all event logs by Event Type (PutObject, GetObject, etc.)
    @GetMapping("/by-event/{eventType}")
    public ResponseEntity<List<EventLog>> getLogsByEventType(@PathVariable String eventType) {
        List<EventLog> logs = eventLogRepo.findByEventName(eventType);
        return ResponseEntity.ok(logs);
    }

    // 5️⃣ Get logs between two dates
    @GetMapping("/by-date")
    public ResponseEntity<List<EventLog>> getLogsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<EventLog> logs = eventLogRepo.findByTimestampBetween(startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        return ResponseEntity.ok(logs);
    }

    // 6️⃣ Get summary analytics (total uploads/downloads, risk averages, etc.)
    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        long totalLogs = eventLogRepo.count();
        long totalUploads = eventLogRepo.countByEventName("PutObject");
        long totalDownloads = eventLogRepo.countByEventName("GetObject");

        Double avgRisk = eventLogRepo.findAverageRiskScore();
        Double avgRate = eventLogRepo.findAverageRequestRate();

        return ResponseEntity.ok(new Object() {
            public final long totalEvents = totalLogs;
            public final long totalUploadsCount = totalUploads;
            public final long totalDownloadsCount = totalDownloads;
            public final Double averageRiskScore = avgRisk;
            public final Double averageRequestRate = avgRate;
        });
    }

    // 7️⃣ Get analytics grouped by event type
    @GetMapping("/analytics/by-event")
    public ResponseEntity<?> getEventTypeStats() {
        List<Object[]> results = eventLogRepo.countEventsByType();
        return ResponseEntity.ok(results);
    }

    // 8️⃣ Get analytics grouped by user role (Analyst vs Developer)
    @GetMapping("/analytics/by-role")
    public ResponseEntity<?> getEventStatsByRole() {
        List<Object[]> results = eventLogRepo.countEventsByRole();
        return ResponseEntity.ok(results);
    }

    // 9️⃣ Get analytics grouped by date
    @GetMapping("/analytics/by-date")
    public ResponseEntity<?> getEventStatsByDate() {
        List<Object[]> results = eventLogRepo.countEventsByDate();
        return ResponseEntity.ok(results);
    }
}

