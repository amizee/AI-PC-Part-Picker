package com.example.demo.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.model.PCPart;
import com.example.demo.service.PCPartService;

@Configuration
public class AiConfig {

    @Autowired
    private final PCPartService pcPartService;

    @Autowired
    public AiConfig(PCPartService pcPartService) {
        this.pcPartService = pcPartService;
    }

    @Value("${ai.api.key}")
    private String apiKey;

    @Bean
    public String getApiKey() {
        return apiKey;
    }

}
