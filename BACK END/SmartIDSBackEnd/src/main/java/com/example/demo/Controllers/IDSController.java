package com.example.demo.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entites.EventLog;
import com.example.demo.Repositories.EventLogRepository;
import com.example.demo.Services.IDSInferenceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.InputStream;
import java.util.*;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/ids")
public class IDSController {

    @Autowired
    private IDSInferenceService idsService;
    
    @Autowired
    
    private EventLogRepository eventLogRepository;

    @GetMapping("/predict")
    public List<Map<String, Object>> predictSamples() throws Exception {
      
        List<List<Double>> samples = Arrays.asList(
            Arrays.asList(25000.0, 14.0, 30.0, 0.75, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 4.0, 2.0, 1.0),
            Arrays.asList(500000.0, 2.0, 200.0, 0.95, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 3.0, 1.0, 5.0),
            Arrays.asList(12000.0, 10.0, 5.0, 0.30, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 2.0),
            Arrays.asList(800000.0, 22.0, 500.0, 0.99, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 2.0, 3.0, 4.0),
            Arrays.asList(15000.0, 9.0, 12.0, 0.20, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 3.0),
            Arrays.asList(40000.0, 23.0, 150.0, 0.85, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 2.0, 0.0, 4.0),
            Arrays.asList(7000.0, 16.0, 8.0, 0.10, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0),
            Arrays.asList(900000.0, 3.0, 400.0, 0.97, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 3.0, 2.0, 5.0),
            Arrays.asList(30000.0, 12.0, 20.0, 0.40, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 2.0, 3.0),
            Arrays.asList(850000.0, 1.0, 600.0, 0.99, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 2.0, 3.0, 4.0)
        );

        return idsService.predict(samples);
    }


        @PostMapping("/analyze-all")
        public ResponseEntity<String> analyzeAllEventLogs() {
            try {
                ObjectMapper mapper = new ObjectMapper();

                // ✅ Load scaler info safely from resources
                double[] mean, scale;
                List<String> featureOrder = new ArrayList<>();
                try (InputStream scalerStream = getClass().getResourceAsStream("/scaler_stats.json")) {
                    if (scalerStream == null) throw new RuntimeException("Missing scaler_stats.json");
                    JsonNode scalerJson = mapper.readTree(scalerStream);
                    mean = mapper.convertValue(scalerJson.get("mean"), double[].class);
                    scale = mapper.convertValue(scalerJson.get("scale"), double[].class);
                    for (JsonNode val : scalerJson.get("features")) featureOrder.add(val.asText());
                }

                // ✅ Load encoders safely from resources
                Map<String, Map<String, Integer>> encoders = new HashMap<>();
                try (InputStream encoderStream = getClass().getResourceAsStream("/encoders.json")) {
                    if (encoderStream == null) throw new RuntimeException("Missing encoders.json");
                    JsonNode encodersJson = mapper.readTree(encoderStream);
                    encodersJson.fields().forEachRemaining(field -> {
                        Map<String, Integer> inner = new HashMap<>();
                        field.getValue().fields().forEachRemaining(innerField ->
                                inner.put(innerField.getKey(), innerField.getValue().asInt()));
                        encoders.put(field.getKey(), inner);
                    });
                }

                List<EventLog> logs = eventLogRepository.findAll();

                for (EventLog log : logs) {
                    try {
                        List<Double> features = new ArrayList<>(15);

                        for (int i = 0; i < featureOrder.size(); i++) {
                            String feature = featureOrder.get(i);
                            double rawVal = 0.0;

                            switch (feature) {
                                case "bytesTransferred": rawVal = safe(log.getBytesTransferred()); break;
                                case "hourOfDay": rawVal = safe(log.getHourOfDay()); break;
                                case "requestRatePerMin": rawVal = safe(log.getRequestRatePerMin()); break;
                                case "riskScore": rawVal = safe(log.getRiskScore()); break;
                                case "isWeekend": rawVal = safe(log.getIsWeekend()); break;
                                case "usualIP": rawVal = safe(log.getUsualIP()); break;
                                case "usualBucket": rawVal = safe(log.getUsualBucket()); break;
                                case "unusualTime": rawVal = safe(log.getUnusualTime()); break;
                                case "highVolume": rawVal = safe(log.getHighVolume()); break;
                                case "crossBucketFlow": rawVal = safe(log.getCrossBucketFlow()); break;
                                case "isNormalPattern": rawVal = safe(log.getIsNormalPattern()); break;
                                case "mitigationTriggered": rawVal = safe(log.getMitigationTriggered()); break;
                                case "eventName":
                                    rawVal = encoders.get("eventName").getOrDefault(log.getEventName(), 0);
                                    break;
                                case "userRole":
                                    rawVal = encoders.get("userRole").getOrDefault(log.getUserRole(), 0);
                                    break;
                                case "geoLocation.country":
                                    rawVal = encoders.get("geoLocation.country").getOrDefault(log.getGeoLocationCountry(), 0);
                                    break;
                            }

                            double scaled = (rawVal - mean[i]) / scale[i];
                            features.add(scaled);
                        }

                        if (features.size() != 15)
                            throw new IllegalStateException("Feature vector not 15 for log ID " + log.getId());

                        // ✅ Predict using ONNX model
                        Map<String, Object> result = idsService.predictSingle(features);
                        log.setPredictedClass((String) result.get("predictedClass"));
                        log.setRiskLevel((String) result.get("riskLevel"));
                        log.setProbabilities((String) result.get("probabilities"));
                        eventLogRepository.save(log);

                    } catch (Exception e) {
                        System.err.println("⚠️ Error analyzing log ID " + log.getId() + ": " + e.getMessage());
                    }
                }

                return ResponseEntity.ok("✅ All event logs analyzed successfully and updated!");

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("❌ Error analyzing logs: " + e.getMessage());
            }
        }

        private double safe(Number val) {
            return val == null ? 0.0 : val.doubleValue();
        }
    


}
   


