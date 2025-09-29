package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.example.demo.DTO.AdCopyRequest;
import com.example.demo.model.PCPart;
import com.example.demo.model.User;
import com.example.demo.service.AIService;
import com.example.demo.service.PCPartService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.AdCopy;

import com.example.demo.repository.AdCopyRepository;
import com.example.demo.service.AdCopyService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class AdCopyController {

  private final AdCopyService adCopyService;
  private final PCPartService pcPartService;
  private final UserService userService;
  private final AIService aiService;

  @Autowired
  public AdCopyController(AdCopyService adCopyService, PCPartService pcPartService, UserService userService, AIService aiService) {
    this.adCopyService = adCopyService;
    this.pcPartService = pcPartService;
    this.userService = userService;
    this.aiService = aiService;
  }

  @PostMapping("/ad-copies/generate")
  public ResponseEntity<AdCopy> generateAdCopy(@RequestBody AdCopyRequest adCopyRequest) {
    System.out.println("AdCopyRequest received: " + adCopyRequest); // Debugging
    // Retrieve the PCPart
    Optional<PCPart> pcPartOptional = pcPartService.getPCPartById(adCopyRequest.getPcPartId());
    if (!pcPartOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    PCPart pcPart = pcPartOptional.get();

    // Prepare the prompt for the AI
    String prompt = createPrompt(pcPart, adCopyRequest);

    // Call AIService to generate the ad copy content
    String adCopyContent;
    try {
      adCopyContent = aiService.callApi(prompt, new ArrayList<>());
      if (adCopyContent == null) {
        System.err.println("Failed to generate ad copy content.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
    } catch (Exception e) {
      System.err.println("Error while calling AIService: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }


    // Create AdCopy entity
    AdCopy adCopy = new AdCopy();
    adCopy.setPcPart(pcPart);
    adCopy.setTitle(adCopyRequest.getTitle());
    adCopy.setContent(adCopyContent);
    adCopy.setUsed(adCopyRequest.isUsed());
    adCopy.setBoxed(adCopyRequest.isBoxed());
    adCopy.setAgeInMonths(adCopyRequest.getAgeInMonths());

    // Set user
    Optional<User> userOptional = userService.getUserById(adCopyRequest.getUserId());
    if (!userOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }
    User user = userOptional.get();
    adCopy.setUser(user);

    // Save the ad copy
    adCopyService.save(adCopy);

    // Return the ad copy
    return ResponseEntity.ok(adCopy);
  }

  @PostMapping("/ad-copies/{id}/regenerate")
  public ResponseEntity<AdCopy> regenerateAdCopy(@PathVariable Long id) {
    // Retrieve the existing AdCopy
    Optional<AdCopy> adCopyOptional = adCopyService.findById(id);
    if (!adCopyOptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    AdCopy adCopy = adCopyOptional.get();

    // Create the prompt based on existing AdCopy
    AdCopyRequest adCopyRequest = new AdCopyRequest();
    adCopyRequest.setPcPartId(adCopy.getPcPart().getId());
    adCopyRequest.setUsed(adCopy.isUsed());
    adCopyRequest.setBoxed(adCopy.isBoxed());
    adCopyRequest.setAgeInMonths(adCopy.getAgeInMonths());
    adCopyRequest.setTitle(adCopy.getTitle());
    adCopyRequest.setUserId(adCopy.getUser().getId());

    String prompt = createPrompt(adCopy.getPcPart(), adCopyRequest);

    // Call AIService to generate the ad copy content
    String adCopyContent = aiService.callApi(prompt, new ArrayList<>());

    // Update the AdCopy content
    adCopy.setContent(adCopyContent);

    // Save the ad copy
    adCopyService.save(adCopy);

    // Return the updated ad copy
    return ResponseEntity.ok(adCopy);
  }

  private String createPrompt(PCPart pcPart, AdCopyRequest adCopyRequest) {
    return "Create an engaging ad copy for the following PC part:\n" +
            "Part Name: " + pcPart.getName() + "\n" +
            "Part Type: " + pcPart.getPartType() + "\n" +
            "Price: $" + pcPart.getPrice() + "\n" +
            "Details:\n" +
            "- Used: " + (adCopyRequest.isUsed() ? "Yes" : "No") + "\n" +
            "- Boxed: " + (adCopyRequest.isBoxed() ? "Yes" : "No") + "\n" +
            "- Age: " + adCopyRequest.getAgeInMonths() + " months\n";
//    StringBuilder prompt = new StringBuilder();
//    prompt.append("Create an engaging ad copy for the following PC part:\n");
//    prompt.append("Part Name: ").append(pcPart.getName()).append("\n");
//    prompt.append("Part Type: ").append(pcPart.getPartType()).append("\n");
//    prompt.append("Price: $").append(pcPart.getPrice()).append("\n");
//    prompt.append("Details:\n");
//    prompt.append("- Used: ").append(adCopyRequest.isUsed() ? "Yes" : "No").append("\n");
//    prompt.append("- Boxed: ").append(adCopyRequest.isBoxed() ? "Yes" : "No").append("\n");
//    prompt.append("- Age: ").append(adCopyRequest.getAgeInMonths()).append(" months\n");
//    return prompt.toString();
  }

  @GetMapping("/ad-copies")
  public List<AdCopy> listAdCopies() {
    return adCopyService.findAll();
  }

  @DeleteMapping("/ad-copies/{id}")
  public ResponseEntity<Void> deleteAdCopy(@PathVariable("id") Long id) {
    Optional<AdCopy> adCopyOptional = adCopyService.findById(id);
    if (!adCopyOptional.isPresent()) {
      return ResponseEntity.notFound().build();
    }

    adCopyService.deleteOne(id);
    return ResponseEntity.noContent().build();
  }
}

