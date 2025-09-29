//package com.example.demo.config;
//
//import com.google.cloud.vertexai.VertexAI;
//import com.google.cloud.vertexai.generativeai.preview.ChatSession;
//import com.google.cloud.vertexai.generativeai.preview.GenerativeModel;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.context.annotation.SessionScope;
//
//import java.io.IOException;
//
//@Configuration
//public class VertexAIConfig {
//    // Change if using a different model
//    private static final String MODEL_NAME = "gemini-pro";
//    private static final String LOCATION = "us-central1";
//    // Replace with your project ID with gcloud CLI
//    private static final String PROJECT_ID = "projectpc-439701";
//
//    @Bean
//    public VertexAI vertexAI() throws IOException {
//        return new VertexAI(PROJECT_ID, LOCATION);
//    }
//
//    @Bean
//    public GenerativeModel generativeModel(VertexAI vertexAI) {
//
//        return new GenerativeModel(MODEL_NAME, vertexAI);
//    }
//
//    @Bean
//    @SessionScope
//    public ChatSession chatSession(@Qualifier("generativeModel") GenerativeModel generativeModel) {
//        return new ChatSession(generativeModel);
//    }
//
//}
