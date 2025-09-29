package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    private String firstname;
    private String lastname;
    private String profilePicURL;

    @ManyToMany
    private List<PCPart> savedParts;

    @ManyToMany
    private List<PCBuild> savedBuilds;


    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<AdCopy> adCopies;

}
