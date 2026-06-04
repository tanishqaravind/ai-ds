package com.example.demo.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entites.FileMetaData;

public interface FileMetaDataRepository extends JpaRepository<FileMetaData, Long> {

	List<FileMetaData> findByEmail(String email);

	FileMetaData findByFileName(String filename);

	FileMetaData findByEmailAndFileName(String analystEmail, String fileName);
	
	


}
