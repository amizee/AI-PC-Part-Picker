package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.AdCopy;
import com.example.demo.model.PCPart;
import com.example.demo.repository.AdCopyRepository;
import com.example.demo.repository.PCPartRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdCopyService {
    @Autowired
    private PCPartRepository pcPartRepository;

    @Autowired
    private UserRepository userRepository;

    private final AdCopyRepository adCopyRepository;

    public AdCopyService(AdCopyRepository adCopyRepository) {
        this.adCopyRepository = adCopyRepository;
    }

    public List<AdCopy> findAll() {
        return adCopyRepository.findAll();
    }

    public void deleteOne(Long id) {
        adCopyRepository.deleteById(id);
    }

    public AdCopy save(AdCopy adCopy) {
        return adCopyRepository.save(adCopy);
    }

    public Optional<AdCopy> findById(Long id) {
        return adCopyRepository.findById(id);
    }

}