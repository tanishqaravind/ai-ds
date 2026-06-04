package com.example.demo.Controllers;


import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entites.Developers;
import com.example.demo.Entites.EventLog;
import com.example.demo.Entites.FileMetaData;
import com.example.demo.Repositories.AnalystsRepository;
import com.example.demo.Repositories.DevelopersRepository;
import com.example.demo.Repositories.EventLogRepository;
import com.example.demo.Repositories.FileMetaDataRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/files")
public class AnalystFileSavesController {

    @Autowired
    private S3Service s3Service;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepo;

    @Autowired
    private EventLogRepository eventLogRepo;
    
    @Autowired
    
    private DevelopersRepository developersRepository;
    
    @Autowired
    
    private AnalystsRepository analystsRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("analystEmail") String analystEmail,
            @RequestParam("requestRatePerMin") Double requestRatePerMin,
            @RequestParam("riskScore") Double riskScore,
            @RequestParam("usualIP") Integer usualIP,
            @RequestParam("usualBucket") Integer usualBucket,
            @RequestParam("unusualTime") Integer unusualTime,
            @RequestParam("highVolume") Integer highVolume,
            @RequestParam("crossBucketFlow") Integer crossBucketFlow,
            @RequestParam("isNormalPattern") Integer isNormalPattern,
            @RequestParam("mitigationTriggered") Integer mitigationTriggered,
            @RequestParam("geoLocationCountry") Integer geoLocationCountry) {

        try {
            SecretKey aesKey = EncryptionUtils.generateAESKey();
            String secretKey = EncryptionUtils.encodeKey(aesKey);

            ResponseEntity<String> uploadResponse = s3Service.uploadFile(file, analystEmail, secretKey);
            if (!uploadResponse.getStatusCode().is2xxSuccessful()) {
                return uploadResponse;
            }

            EventLog log = new EventLog();
            log.setUserEmail(analystEmail);
            log.setUserEmail(analystEmail);
            log.setUserRole("Analyst");
            log.setEventName("PutObject");
            log.setBytesTransferred(file.getSize());
            log.setHourOfDay(LocalDateTime.now().getHour());
            log.setRequestRatePerMin(requestRatePerMin);
            log.setRiskScore(riskScore);
            log.setIsWeekend(LocalDate.now().getDayOfWeek().getValue() >= 6 ? 1 : 0);
            log.setUsualIP(usualIP);
            log.setUsualBucket(usualBucket);
            log.setUnusualTime(unusualTime);
            log.setHighVolume(highVolume);
            log.setCrossBucketFlow(crossBucketFlow);
            log.setIsNormalPattern(isNormalPattern);
            log.setMitigationTriggered(mitigationTriggered);
            log.setGeoLocationCountry(geoLocationCountry);
            log.setFileName(file.getOriginalFilename());
            eventLogRepo.save(log);

            return ResponseEntity.ok(Map.of(
                    "message", "File uploaded successfully, metadata and event log saved",
                    "fileName", file.getOriginalFilename()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/download/dev/{devpEmail}/{fileName}")
    public ResponseEntity<?> downloadFile(
            @PathVariable("devpEmail") String devpEmail,
            @PathVariable("fileName") String fileName) {

        try {
            // 1️⃣ Find file metadata
            FileMetaData fileMetaData = fileMetaDataRepo.findByFileName(fileName);
            if (fileMetaData == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "File not found"));
            }

           String analystEmail = fileMetaData.getEmail(); 
            
            Optional<Developers> devp = developersRepository.findByEmail(devpEmail);

            String newAnalyst = devp.get().getAnalysts().getEmail();
            
            boolean isDeveloperAllowed = newAnalyst.equals(analystEmail);
            
            if (!isDeveloperAllowed) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You do not have access to this file"));
            }

            // 3️⃣ Download file from S3
            ByteArrayInputStream fileStream = s3Service.downloadFile(fileName);
            if (fileStream == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to download/decrypt the file"));
            }

            // 4️⃣ Log the download event
            EventLog originalLog = eventLogRepo.findTopByUserEmailAndFileNameOrderByIdDesc(analystEmail, fileName);
            if (originalLog != null) {
                EventLog downloadLog = new EventLog();
                downloadLog.setUserEmail(devpEmail);
                downloadLog.setUserRole("Developer");
                downloadLog.setEventName("GetObject");
                downloadLog.setBytesTransferred(originalLog.getBytesTransferred());
                downloadLog.setHourOfDay(LocalDateTime.now().getHour());
                downloadLog.setRequestRatePerMin(originalLog.getRequestRatePerMin());
                downloadLog.setRiskScore(originalLog.getRiskScore());
                downloadLog.setIsWeekend(originalLog.getIsWeekend());
                downloadLog.setUsualIP(originalLog.getUsualIP());
                downloadLog.setUsualBucket(originalLog.getUsualBucket());
                downloadLog.setUnusualTime(originalLog.getUnusualTime());
                downloadLog.setHighVolume(originalLog.getHighVolume());
                downloadLog.setCrossBucketFlow(originalLog.getCrossBucketFlow());
                downloadLog.setIsNormalPattern(originalLog.getIsNormalPattern());
                downloadLog.setMitigationTriggered(originalLog.getMitigationTriggered());
                downloadLog.setGeoLocationCountry(originalLog.getGeoLocationCountry());
                downloadLog.setFileName(fileName);

                eventLogRepo.save(downloadLog);
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + fileName)
                    .body(fileStream.readAllBytes());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error downloading file: " + e.getMessage()));
        }
    }

  
    @GetMapping("/download/analyst/{analystEmail}/{fileName}")
    public ResponseEntity<?> downloadFileByAnalyst(
            @PathVariable String analystEmail,
            @PathVariable String fileName) {

        FileMetaData fileMeta = fileMetaDataRepo.findByEmailAndFileName(analystEmail, fileName);
        if (fileMeta == null) {
            return ResponseEntity.status(404).body("File not found or you don't have access");
        }

        try {
            ByteArrayInputStream fileStream = s3Service.downloadFile(fileName);
            if (fileStream == null) {
                return ResponseEntity.status(500).body("Error retrieving file");
            }

            EventLog originalLog = eventLogRepo.findTopByUserEmailAndFileNameOrderByIdDesc(analystEmail, fileName);
            if (originalLog != null) {
                EventLog downloadLog = new EventLog();
                downloadLog.setUserEmail(analystEmail);
                downloadLog.setUserRole("Analyst");
                downloadLog.setEventName("GetObject");
                downloadLog.setBytesTransferred(originalLog.getBytesTransferred());
                downloadLog.setHourOfDay(LocalDateTime.now().getHour());
                downloadLog.setRequestRatePerMin(originalLog.getRequestRatePerMin());
                downloadLog.setRiskScore(originalLog.getRiskScore());
                downloadLog.setIsWeekend(originalLog.getIsWeekend());
                downloadLog.setUsualIP(originalLog.getUsualIP());
                downloadLog.setUsualBucket(originalLog.getUsualBucket());
                downloadLog.setUnusualTime(originalLog.getUnusualTime());
                downloadLog.setHighVolume(originalLog.getHighVolume());
                downloadLog.setCrossBucketFlow(originalLog.getCrossBucketFlow());
                downloadLog.setIsNormalPattern(originalLog.getIsNormalPattern());
                downloadLog.setMitigationTriggered(originalLog.getMitigationTriggered());
                downloadLog.setGeoLocationCountry(originalLog.getGeoLocationCountry());
                downloadLog.setFileName(fileName);

                eventLogRepo.save(downloadLog);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileStream.readAllBytes());

        } catch (Exception e) {
           
            return ResponseEntity.status(500).body("Error downloading file: " + e.getMessage());
        }
    }
    
    @GetMapping("/analyst/{analystEmail}")
    public ResponseEntity<List<FileMetaData>> getFilesByAnalyst(@PathVariable String analystEmail) {
        List<FileMetaData> files = fileMetaDataRepo.findByEmail(analystEmail);

        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/devp/{devpEmail}")
    public ResponseEntity<List<FileMetaData>> getFilesByDeveloper(@PathVariable String devpEmail) {
    	
    	Optional<Developers> devp = developersRepository.findByEmail(devpEmail);
    	
    	String analystEmail = devp.get().getAnalysts().getEmail();
    	
        List<FileMetaData> files = fileMetaDataRepo.findByEmail(analystEmail);

        return ResponseEntity.ok(files);
    }
}
