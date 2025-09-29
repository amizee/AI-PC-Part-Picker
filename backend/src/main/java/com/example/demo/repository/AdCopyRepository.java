package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.AdCopy;
import org.springframework.stereotype.Repository;

@Repository
public interface AdCopyRepository extends JpaRepository<AdCopy, Long> {

}