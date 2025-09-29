package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdCopy {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JsonIgnore
    private PCPart pcPart;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String title;

    @Column(columnDefinition="TEXT")
    private String content;

    private boolean used;
    private boolean boxed;
    private int ageInMonths;

}
