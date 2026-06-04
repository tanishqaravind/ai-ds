package com.example.demo.Entites;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "fileMetaData")
public class FileMetaData {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String fileName;
	    private String email;
	    private String secretKey; // The original secret key
	    private String encryptedKeyStore; // Encrypted key
	    
	    public FileMetaData() {
	    }

		public FileMetaData(String fileName, String email, String secretKey, String encryptedKeyStore,
				String fileSignature) {
			super();
			this.fileName = fileName;
			this.email = email;
			this.secretKey = secretKey;
			this.encryptedKeyStore = encryptedKeyStore;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getFileName() {
			return fileName;
		}

		public void setFileName(String fileName) {
			this.fileName = fileName;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getSecretKey() {
			return secretKey;
		}

		public void setSecretKey(String secretKey) {
			this.secretKey = secretKey;
		}

		public String getEncryptedKeyStore() {
			return encryptedKeyStore;
		}

		public void setEncryptedKeyStore(String encryptedKeyStore) {
			this.encryptedKeyStore = encryptedKeyStore;
		}

		

		@Override
		public String toString() {
			return "FileMetadata [id=" + id + ", fileName=" + fileName + ", email=" + email + ", secretKey=" + secretKey
					+ ", encryptedKeyStore=" + encryptedKeyStore 
					+ "]";
		}

}
