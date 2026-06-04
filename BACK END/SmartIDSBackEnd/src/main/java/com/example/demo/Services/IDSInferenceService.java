package com.example.demo.Services;

import ai.onnxruntime.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.FloatBuffer;
import java.util.*;

@Service
public class IDSInferenceService {

    private final OrtEnvironment env;
    private final OrtSession session;
    private final double[] mean;
    private final double[] scale;

    private final String[] classNames = {
            "Credential_Theft",
            "DDoS_API_Flood",
            "Insider_Exfiltration",
            "Normal_Traffic"
    };

    public IDSInferenceService() throws Exception {
        env = OrtEnvironment.getEnvironment();

        // Load ONNX model
        try (InputStream modelStream = getClass().getResourceAsStream("/model.onnx")) {
            byte[] modelBytes = modelStream.readAllBytes();
            session = env.createSession(modelBytes, new OrtSession.SessionOptions());
        }

        // Load scaler stats
        try (InputStream scalerStream = getClass().getResourceAsStream("/scaler_stats.json")) {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> scalerData = mapper.readValue(scalerStream, Map.class);
            mean = ((List<Double>) scalerData.get("mean")).stream().mapToDouble(Double::doubleValue).toArray();
            scale = ((List<Double>) scalerData.get("scale")).stream().mapToDouble(Double::doubleValue).toArray();
        }

    }

    public List<Map<String, Object>> predict(List<List<Double>> samples) throws Exception {
        List<Map<String, Object>> results = new ArrayList<>();

        for (List<Double> sample : samples) {
            float[] input = preprocess(sample);
            Map<String, OnnxTensor> inputMap = new HashMap<>();
            OnnxTensor tensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(input), new long[]{1, input.length});
            inputMap.put(session.getInputNames().iterator().next(), tensor);

            try (OrtSession.Result output = session.run(inputMap)) {
                Object out = output.get(0).getValue();

                int idx;
                String predictedClass;
                String probString;

                if (out instanceof float[][] floats) {
                    idx = argMax(floats[0]);
                    predictedClass = classNames[idx];
                    probString = Arrays.toString(floats[0]);
                } else if (out instanceof long[] longs) {
                    idx = (int) longs[0];
                    predictedClass = classNames[idx];
                    probString = "[Predicted Label Index: " + idx + "]";
                } else if (out instanceof long[][] longs2D) {
                    idx = (int) longs2D[0][0];
                    predictedClass = classNames[idx];
                    probString = "[Predicted Label Index: " + idx + "]";
                } else {
                    idx = -1;
                    predictedClass = "Unknown_Output_Type";
                    probString = out.getClass().getSimpleName();
                }

                // Add riskLevel based on prediction index
                String riskLevel = switch (idx) {
                    case 0 -> "Credential_Theft";
                    case 1 -> "DDoS_API_Flood";
                    case 2 -> "Insider_Exfiltration";
                    case 3 -> "Normal_Traffic";
                    default -> "Unknown";
                };

                Map<String, Object> result = new LinkedHashMap<>();
                result.put("input", sample);
                result.put("predictedClass", predictedClass);
                result.put("riskLevel", riskLevel);
                result.put("probabilities", probString);

                results.add(result);
            }
        }

        return results;
    }
    
    public Map<String, Object> predictSingle(List<Double> sample) throws Exception {
        float[] input = preprocess(sample);
        Map<String, OnnxTensor> inputMap = new HashMap<>();
        OnnxTensor tensor = OnnxTensor.createTensor(env, FloatBuffer.wrap(input), new long[]{1, input.length});
        inputMap.put(session.getInputNames().iterator().next(), tensor);

        try (OrtSession.Result output = session.run(inputMap)) {
            Object out = output.get(0).getValue();

            int idx;
            String predictedClass;
            String probString;

            if (out instanceof float[][] floats) {
                idx = argMax(floats[0]);
                predictedClass = classNames[idx];
                probString = Arrays.toString(floats[0]);
            } else if (out instanceof long[] longs) {
                idx = (int) longs[0];
                predictedClass = classNames[idx];
                probString = "[Predicted Label Index: " + idx + "]";
            } else if (out instanceof long[][] longs2D) {
                idx = (int) longs2D[0][0];
                predictedClass = classNames[idx];
                probString = "[Predicted Label Index: " + idx + "]";
            } else {
                idx = -1;
                predictedClass = "Unknown_Output_Type";
                probString = out.getClass().getSimpleName();
            }

            // Map index to risk level
            String riskLevel = switch (idx) {
                case 0 -> "High";      // Credential_Theft
                case 1 -> "High";      // DDoS_API_Flood
                case 2 -> "Medium";    // Insider_Exfiltration
                case 3 -> "Low";       // Normal_Traffic
                default -> "Unknown";
            };

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("input", sample);
            result.put("predictedClass", predictedClass);
            result.put("riskLevel", riskLevel);
            result.put("probabilities", probString);

            return result;
        }
    }


    private float[] preprocess(List<Double> sample) {
        float[] arr = new float[sample.size()];
        for (int i = 0; i < sample.size(); i++) {
            double norm = (sample.get(i) - mean[i]) / scale[i];
            arr[i] = (float) norm;
        }
        return arr;
    }

    private int argMax(float[] array) {
        int idx = 0;
        float max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
                idx = i;
            }
        }
        return idx;
    }
}
