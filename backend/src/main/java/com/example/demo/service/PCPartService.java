package com.example.demo.service;

import com.example.demo.model.PCPart;
import com.example.demo.repository.PCPartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import com.example.demo.model.PCPart;
import com.example.demo.model.CPU;
import com.example.demo.model.GPU;
import com.example.demo.model.Cooler;
import com.example.demo.model.Motherboard;
import com.example.demo.model.Memory;
import com.example.demo.model.Storage;
import com.example.demo.model.Case;
import com.example.demo.model.PowerSupply;
import com.example.demo.model.OS;



import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PCPartService {

    private final PCPartRepository pcPartRepository;

    @Autowired
    public PCPartService(PCPartRepository pcPartRepository) {
        this.pcPartRepository = pcPartRepository;
    }

    public Optional<PCPart> getPCPartById(Long id) {
        return pcPartRepository.findById(id);
    }

    public List<PCPart> getAllPCParts() {
        return pcPartRepository.findAll();
    }

    public List<PCPart> searchByName(String name) {
        return pcPartRepository.findByNameContainingIgnoreCase(name);
    }

    public List<PCPart> searchByPartType(List<String> partTypes) {
        return pcPartRepository.findByPartTypeIn(partTypes);
    }

    public List<PCPart> searchByNameAndPartType(String name, List<String> partTypes) {
        return pcPartRepository.findByNameContainingIgnoreCaseAndPartTypeIn(name, partTypes);
    }
    

}
