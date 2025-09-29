package com.example.demo.controller;

import java.util.*;

import com.example.demo.model.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.PCPart;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.PCPartService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PCPartService pcPartService;

    @Autowired
    public UserController(UserService userService, PCPartService pcPartService) {
        this.userService = userService;
        this.pcPartService = pcPartService;
    }

  @PostMapping("/{id}")
  ResponseEntity updateUserProfile(@PathVariable("id") Long id, @RequestBody User user) {
    User userToUpdate = userService.findById(id);
    if (user.getUsername() != "") userToUpdate.setUsername(user.getUsername());
    if (user.getPassword() != "") userToUpdate.setPassword(user.getPassword());
    userService.save(userToUpdate);

    return new ResponseEntity(HttpStatus.OK);
  }

  @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            //user.setId((long) 3);

            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("An unexpected error occurred: " + e.getMessage());
        }
    }

  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
      Optional<User> user = userService.getUserById(id);
      return user.map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
      List<User> users = userService.getAllUsers();
      return ResponseEntity.ok(users);
  }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> updatedUser = userService.updateUser(id, userDetails);
        return updatedUser.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("saved-part/{id}")
    public ResponseEntity<Void> deleteSavedPart(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        User userToUpdate = userService.findById(id);
        Long partId = body.get("savedPartId");
        PCPart partToRemove = userToUpdate.getSavedParts()
                                              .stream()
                                              .filter(part -> part.getId().equals(partId))
                                              .findFirst()
                                              .orElse(null);
        userToUpdate.getSavedParts().remove(partToRemove);
        userService.save(userToUpdate);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("saved-build/{id}")
        public ResponseEntity<Void> deleteSavedBuild(@PathVariable Long id, @RequestBody Map<String, Long> body) {
            User userToUpdate = userService.findById(id);
            Long buildId = body.get("savedBuildId");
            PCBuild buildToRemove = userToUpdate.getSavedBuilds()
                                                  .stream()
                                                  .filter(build -> build.getId().equals(buildId))
                                                  .findFirst()
                                                  .orElse(null);
            userToUpdate.getSavedBuilds().remove(buildToRemove);
            userService.save(userToUpdate);
            return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userService.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok(user.getId().toString());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping("/{userId}/saved-parts")
    public ResponseEntity<List<PCPart>> getSavedPartsForUser(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            List<PCPart> savedParts = new ArrayList<>(userOptional.get().getSavedParts());
            return ResponseEntity.ok(savedParts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/save/{pcPartId}")
    public ResponseEntity<String> savePCPartForUser(@PathVariable Long userId, @PathVariable Long pcPartId) {

        Optional<PCPart> pcPartOptional = pcPartService.getPCPartById(pcPartId);
        if (pcPartOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            userService.savePCPartForUser(userId, pcPartOptional.get());
            return ResponseEntity.ok("PC part saved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @DeleteMapping("/{userId}/unsave/{pcPartId}")
    public ResponseEntity<String> unsavePCPartForUser(@PathVariable Long userId, @PathVariable Long pcPartId) {

        Optional<PCPart> pcPartOptional = pcPartService.getPCPartById(pcPartId);
        if (pcPartOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            userService.unsavePCPartForUser(userId, pcPartOptional.get());
            return ResponseEntity.ok("PC part unsaved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/save-ad-copy")
    public ResponseEntity<String> saveAdCopy(@PathVariable Long userId, @RequestBody AdCopy adCopy) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            adCopy.setUser(user);
            userService.saveAdCopyForUser(adCopy);
            return ResponseEntity.ok("Ad copy saved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @GetMapping("/{userId}/ad-copies")
    public ResponseEntity<List<AdCopy>> getAdCopiesForUser(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isPresent()) {
            List<AdCopy> adCopies = userOptional.get().getAdCopies();
            return ResponseEntity.ok(adCopies);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{userId}/delete-ad-copy/{adCopyId}")
    public ResponseEntity<String> deleteAdCopy(@PathVariable Long userId, @PathVariable Long adCopyId) {
        boolean deleted = userService.deleteAdCopyForUser(userId, adCopyId);
        if (deleted) {
            return ResponseEntity.ok("Ad copy deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ad copy not found or not authorized.");
        }
    }

}
