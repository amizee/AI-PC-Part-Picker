package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AiController {

    @Autowired
    AIService aiService;

    @PostMapping("/api/prompt")
    public Map<String, String> getResponse(@RequestBody Map<String, Object> requestBody) {
        String prompt = (String) requestBody.get("prompt");
        @SuppressWarnings("unchecked")
        ArrayList<Map<String, String>> contextList = (ArrayList<Map<String, String>>) requestBody.get("context");
        String response = aiService.callApi(prompt, contextList);
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("response", response);
        return responseBody;
    }

}