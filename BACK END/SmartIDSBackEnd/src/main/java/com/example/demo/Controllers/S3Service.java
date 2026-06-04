package com.example.demo.Controllers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.security.Key;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.example.demo.Entites.FileMetaData;
import com.example.demo.Repositories.FileMetaDataRepository;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private FileMetaDataRepository fileMetadataRepository;

    private String bucketName = "databuckets12"; 

    // Check if the file with the same name already exists for the given email
    private boolean isFileAlreadyExists(String filename, String email) {
        // Search for existing files by email and filename
        List<FileMetaData> existingFiles = fileMetadataRepository.findByEmail(email);
        for (FileMetaData fileMetadata : existingFiles) {
            if (fileMetadata.getFileName().equals(filename)) {
                return true;  // Found a file with the same name
            }
        }
        return false;  // No duplicate found
    }

    // Upload file to S3 and store metadata
    public ResponseEntity<String> uploadFile(MultipartFile file, String email, String secretKey) {
        try {
            String filename = file.getOriginalFilename();

            // Check if the file with the same name already exists for the given email
            if (isFileAlreadyExists(filename, email)) {
                // Return HTTP 400 (Bad Request) with a message indicating the file already exists
                return new ResponseEntity<>("Duplicate file: A file with the same name already exists.", HttpStatus.BAD_REQUEST);
            }

            // Convert file to bytes
            byte[] fileBytes = file.getBytes();

            // Encrypt the file with AES before uploading
            Key aesKeySpec = EncryptionUtils.createKey(secretKey, "AES");
            byte[] encryptedBytes = EncryptionUtils.encryptData(fileBytes, aesKeySpec);

            // Upload the encrypted file to S3
            try (InputStream encryptedStream = new ByteArrayInputStream(encryptedBytes)) {
                s3Client.putObject(bucketName, filename, encryptedStream, null);
            }

            // Save the file metadata
            String encryptedKeyStore = EncryptionUtils.encodeKey(aesKeySpec);

            FileMetaData fileMetadata = new FileMetaData(filename, email, secretKey, encryptedKeyStore, null); // No file hash, as we're checking by name only
            fileMetadataRepository.save(fileMetadata);

            // Return HTTP 200 OK with success message
            return new ResponseEntity<>("File uploaded successfully.", HttpStatus.OK);

        } catch (Exception e) {
            // Log the error and return HTTP 500 (Internal Server Error)
            logger.error("Error during file upload: ", e);
            return new ResponseEntity<>("Error during file upload: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download the file from S3
    public ByteArrayInputStream downloadFile(String filename) {
        try {
            // Download the file from S3
            S3ObjectInputStream s3InputStream = s3Client.getObject(bucketName, filename).getObjectContent();
            byte[] encryptedBytes = s3InputStream.readAllBytes();
            s3InputStream.close();

            // Retrieve the AES key for decryption
            FileMetaData fileMetadata = fileMetadataRepository.findByFileName(filename);
            if (fileMetadata == null) {
                throw new IllegalArgumentException("File metadata not found");
            }
            Key aesKeySpec = EncryptionUtils.createKey(fileMetadata.getSecretKey(), "AES");

            // Decrypt the file using AES
            byte[] decryptedBytes = EncryptionUtils.decryptData(encryptedBytes, aesKeySpec);

            return new ByteArrayInputStream(decryptedBytes);
        } catch (Exception e) {
            logger.error("Error during decryption/download: ", e);
            return null;
        }
    }
}
