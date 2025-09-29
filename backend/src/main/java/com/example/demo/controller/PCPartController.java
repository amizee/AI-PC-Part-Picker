package com.example.demo.controller;

import com.example.demo.model.PCPart;
import com.example.demo.service.PCPartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays; 

import java.util.List;

@RestController
@RequestMapping("/api/pcparts")
public class PCPartController {

    private final PCPartService pcPartService;

    @Autowired
    public PCPartController(PCPartService pcPartService) {
        this.pcPartService = pcPartService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PCPart> getPCPartById(@PathVariable Long id) {
        return pcPartService.getPCPartById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search-parts")
    public List<PCPart> searchPCParts(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false) List<String> partTypes) {

        // Normalize query and part types
        String normalizedQuery = query.trim().isEmpty() ? null : query;
        List<String> normalizedPartTypes = (partTypes == null || partTypes.isEmpty()) ? null : partTypes;

        // Perform search
        if (normalizedQuery != null && normalizedPartTypes == null) {
            return pcPartService.searchByName(normalizedQuery);  // Search all parts by name
        } else if (normalizedQuery == null && normalizedPartTypes != null) {
            return pcPartService.searchByPartType(normalizedPartTypes);  // Search by part types only
        } else {
            return pcPartService.searchByNameAndPartType(normalizedQuery, normalizedPartTypes);  // Search by both
        }
    }
}

