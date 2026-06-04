package com.example.demo.Repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entites.EventLog;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {

	EventLog findTopByUserEmailAndFileNameOrderByIdDesc(String analystEmail, String fileName);
	
	 List<EventLog> findByUserEmailAndUserRole(String email, String role);
	    List<EventLog> findByEventName(String eventName);
	    List<EventLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
	
	long countByEventName(String eventName);

    // Average metrics
    @Query("SELECT AVG(e.riskScore) FROM EventLog e")
    Double findAverageRiskScore();

    @Query("SELECT AVG(e.requestRatePerMin) FROM EventLog e")
    Double findAverageRequestRate();

    // Analytics groupings
    @Query("SELECT e.eventName, COUNT(e) FROM EventLog e GROUP BY e.eventName")
    List<Object[]> countEventsByType();

    @Query("SELECT e.userRole, COUNT(e) FROM EventLog e GROUP BY e.userRole")
    List<Object[]> countEventsByRole();

    @Query("SELECT DATE(e.timestamp), COUNT(e) FROM EventLog e GROUP BY DATE(e.timestamp)")
    List<Object[]> countEventsByDate();

}
