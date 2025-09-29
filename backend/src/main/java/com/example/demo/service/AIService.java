package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.config.AiConfig;
import com.example.demo.model.PCPart;
import com.example.demo.repository.PCPartRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.annotation.PostConstruct;

@Service
public class AIService {

    private String systemContextString = "";

    @Autowired
    private RestTemplate restTemplate;

    private final AiConfig aiConfig;
    private final PCPartRepository pcPartRepository;

    @Autowired
    public AIService(AiConfig aiConfig, PCPartRepository pcPartRepository) {
        this.aiConfig = aiConfig;
        this.pcPartRepository = pcPartRepository;
    }

    @PostConstruct
    public String setSystemContextString() {
        List<PCPart> partsContext = this.pcPartRepository.findAll();
        String systemInstruction = "Imagine you are a chat bot for a PC Building Site called 'AI PC PartPicker'\n These are your parts\n";
        return partsContext.stream().map(part -> part.getName()).reduce(systemInstruction,
                (acc, name) -> acc + name + "\n");
    }

    private final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";

    public String callApi(String prompt, ArrayList<Map<String, String>> contexts) {

        String apiUrl = String.format(API_URL_TEMPLATE, this.aiConfig.getApiKey());

        if (systemContextString.isEmpty()) {
            systemContextString = setSystemContextString();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode requestBodyNode = objectMapper.createObjectNode();
        ObjectNode contentNode = objectMapper.createObjectNode();
        contentNode.put("role", "user");
        ObjectNode partsNode = objectMapper.createObjectNode();
        partsNode.put("text", prompt);
        contentNode.set("parts", objectMapper.createArrayNode().add(partsNode));
        requestBodyNode.set("contents", objectMapper.createArrayNode().add(contentNode));

        for (Map<String, String> context : contexts) {
            ObjectNode contextNode = objectMapper.createObjectNode();
            contextNode.put("role", context.get("role"));
            ObjectNode contextPartsNode = objectMapper.createObjectNode();
            contextPartsNode.put("text", context.get("text"));
            contextNode.set("parts", objectMapper.createArrayNode().add(contextPartsNode));
            requestBodyNode.withArray("contents").add(contextNode);
        }

        ObjectNode systemInstructionNode = objectMapper.createObjectNode();
        systemInstructionNode.put("role", "user");
        ObjectNode systemInstructionPartsNode = objectMapper.createObjectNode();
        systemInstructionPartsNode.put("text", systemContextString);
        systemInstructionNode.set("parts", objectMapper.createArrayNode().add(systemInstructionPartsNode));
        requestBodyNode.set("systemInstruction", systemInstructionNode);

        String requestBody;
        try {
            requestBody = objectMapper.writeValueAsString(requestBodyNode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to construct JSON request body", e);
        }

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);

        return parseAIString(response.getBody());
    }

    private String parseAIString(String aiString) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode rootNode = (ObjectNode) objectMapper.readTree(aiString);
            if (rootNode.has("candidates") && rootNode.path("candidates").isArray()
                    && rootNode.path("candidates").size() > 0) {
                ObjectNode candidateNode = (ObjectNode) rootNode.path("candidates").get(0);
                if (candidateNode.has("content") && candidateNode.path("content").has("parts")
                        && candidateNode.path("content").path("parts").isArray()
                        && candidateNode.path("content").path("parts").size() > 0) {
                    return candidateNode.path("content").path("parts").get(0).path("text").asText();
                }
            }
            throw new RuntimeException("Invalid AI response structure");
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

}