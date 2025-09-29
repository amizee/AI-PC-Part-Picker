package com.example.demo.repository;
import com.example.demo.model.PCPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface PCPartRepository extends JpaRepository<PCPart, Long> {

    List<PCPart> findByNameContainingIgnoreCase(String name);

    List<PCPart> findByPartTypeIn(List<String> partTypes);

    List<PCPart> findByNameContainingIgnoreCaseAndPartTypeIn(String name, List<String> partTypes);
}

