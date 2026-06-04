package com.example.demo.Entites;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "event_logs")
public class EventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail; // Analyst or Developer
    private String userRole; // "Analyst" or "Developer"
    private String eventName; // "PutObject" or "GetObject"
    private double bytesTransferred;
    private int hourOfDay;
    private double requestRatePerMin;
    private double riskScore;
    private int isWeekend;
    private int usualIP;
    private int usualBucket;
    private int unusualTime;
    private int highVolume;
    private int crossBucketFlow;
    private int isNormalPattern;
    private int mitigationTriggered;
    private int geoLocationCountry;

    private String predictedClass;
    private String riskLevel;
    private String probabilities;
    
    private String fileName;
    
    private Date timestamp = new Date();

    public EventLog() {
		
	}

	public EventLog(Long id, String userEmail, String userRole, String eventName, double bytesTransferred, int hourOfDay,
			double requestRatePerMin, double riskScore, int isWeekend, int usualIP, int usualBucket, int unusualTime,
			int highVolume, int crossBucketFlow, int isNormalPattern, int mitigationTriggered, int geoLocationCountry,
			String predictedClass, String riskLevel, String probabilities, Date timestamp, String fileName) {
		super();
		this.id = id;
		this.userEmail = userEmail;
		this.userRole = userRole;
		this.eventName = eventName;
		this.bytesTransferred = bytesTransferred;
		this.hourOfDay = hourOfDay;
		this.requestRatePerMin = requestRatePerMin;
		this.riskScore = riskScore;
		this.isWeekend = isWeekend;
		this.usualIP = usualIP;
		this.usualBucket = usualBucket;
		this.unusualTime = unusualTime;
		this.highVolume = highVolume;
		this.crossBucketFlow = crossBucketFlow;
		this.isNormalPattern = isNormalPattern;
		this.mitigationTriggered = mitigationTriggered;
		this.geoLocationCountry = geoLocationCountry;
		this.predictedClass = predictedClass;
		this.riskLevel = riskLevel;
		this.probabilities = probabilities;
		this.timestamp = timestamp;
		this.fileName = fileName;
	}
	
	

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserRole() {
		return userRole;
	}

	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public double getBytesTransferred() {
		return bytesTransferred;
	}

	public void setBytesTransferred(double bytesTransferred) {
		this.bytesTransferred = bytesTransferred;
	}

	public int getHourOfDay() {
		return hourOfDay;
	}

	public void setHourOfDay(int hourOfDay) {
		this.hourOfDay = hourOfDay;
	}

	public double getRequestRatePerMin() {
		return requestRatePerMin;
	}

	public void setRequestRatePerMin(double requestRatePerMin) {
		this.requestRatePerMin = requestRatePerMin;
	}

	public double getRiskScore() {
		return riskScore;
	}

	public void setRiskScore(double riskScore) {
		this.riskScore = riskScore;
	}

	public int getIsWeekend() {
		return isWeekend;
	}

	public void setIsWeekend(int isWeekend) {
		this.isWeekend = isWeekend;
	}

	public int getUsualIP() {
		return usualIP;
	}

	public void setUsualIP(int usualIP) {
		this.usualIP = usualIP;
	}

	public int getUsualBucket() {
		return usualBucket;
	}

	public void setUsualBucket(int usualBucket) {
		this.usualBucket = usualBucket;
	}

	public int getUnusualTime() {
		return unusualTime;
	}

	public void setUnusualTime(int unusualTime) {
		this.unusualTime = unusualTime;
	}

	public int getHighVolume() {
		return highVolume;
	}

	public void setHighVolume(int highVolume) {
		this.highVolume = highVolume;
	}

	public int getCrossBucketFlow() {
		return crossBucketFlow;
	}

	public void setCrossBucketFlow(int crossBucketFlow) {
		this.crossBucketFlow = crossBucketFlow;
	}

	public int getIsNormalPattern() {
		return isNormalPattern;
	}

	public void setIsNormalPattern(int isNormalPattern) {
		this.isNormalPattern = isNormalPattern;
	}

	public int getMitigationTriggered() {
		return mitigationTriggered;
	}

	public void setMitigationTriggered(int mitigationTriggered) {
		this.mitigationTriggered = mitigationTriggered;
	}

	public int getGeoLocationCountry() {
		return geoLocationCountry;
	}

	public void setGeoLocationCountry(int geoLocationCountry) {
		this.geoLocationCountry = geoLocationCountry;
	}

	public String getPredictedClass() {
		return predictedClass;
	}

	public void setPredictedClass(String predictedClass) {
		this.predictedClass = predictedClass;
	}

	public String getRiskLevel() {
		return riskLevel;
	}

	public void setRiskLevel(String riskLevel) {
		this.riskLevel = riskLevel;
	}

	public String getProbabilities() {
		return probabilities;
	}

	public void setProbabilities(String probabilities) {
		this.probabilities = probabilities;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
    
}
