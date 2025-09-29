package com.example.demo.service;

import com.example.demo.model.AdCopy;
import com.example.demo.model.PCPart;
import com.example.demo.model.User;
import com.example.demo.repository.AdCopyRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AdCopyRepository adCopyRepository;

    @Autowired
    public UserService(UserRepository userRepository, AdCopyRepository adCopyRepository) {

        this.userRepository = userRepository;
        this.adCopyRepository = adCopyRepository;
    }

    public User createUser(User user) {
        // Validate that required fields are present
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.getReferenceById(id);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword());
            user.setEmail(userDetails.getEmail());
            user.setFirstname(userDetails.getFirstname());
            user.setLastname(userDetails.getLastname());
            user.setProfilePicURL(userDetails.getProfilePicURL());
            return userRepository.save(user);
        });
    }

    public void deleteOne(Long id) {
        userRepository.deleteById(id);
    }

    public boolean deleteUserById(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public User findByUsername(String username) {  // New method
        return userRepository.findByUsername(username);
    }

    public void savePCPartForUser(Long userId, PCPart pcPart) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getSavedParts().add(pcPart);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }


    public void unsavePCPartForUser(Long userId, PCPart pcPart) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.getSavedParts().remove(pcPart);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }


    public void saveAdCopyForUser(AdCopy adCopy) {
        adCopyRepository.save(adCopy);
    }

    public boolean deleteAdCopyForUser(Long userId, Long adCopyId) {
        Optional<AdCopy> adCopyOptional = adCopyRepository.findById(adCopyId);
        if (adCopyOptional.isPresent() && adCopyOptional.get().getUser().getId().equals(userId)) {
            adCopyRepository.deleteById(adCopyId);
            return true;
        }
        return false;
    }


}
