package com.example.demo.Controllers;


import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class EncryptionUtils {

    public static SecretKey generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256); // AES-256
        return keyGen.generateKey();
    }

    public static Key createKey(String secretKey, String algorithm) throws NoSuchAlgorithmException {
        if ("AES".equals(algorithm)) {
            byte[] keyBytes = getKeyBytes(secretKey);
            return new SecretKeySpec(keyBytes, "AES");
        } else {
            throw new IllegalArgumentException("Unsupported algorithm: " + algorithm);
        }
    }

    private static byte[] getKeyBytes(String secretKey) throws NoSuchAlgorithmException {
        // Hash the secret key to ensure it is the right length
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] key = secretKey.getBytes();
        key = sha.digest(key);
        return java.util.Arrays.copyOf(key, 32); // Use only the first 32 bytes
    }

    public static String encodeKey(Key key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    public static byte[] encryptData(byte[] data, Key key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data);
    }

    public static byte[] decryptData(byte[] encryptedData, Key key) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(encryptedData);
    }
}

