package com.example.demo.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@EqualsAndHashCode(callSuper = true) // Include superclass fields in equals
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("MOTHERBOARD")
public class Motherboard extends PCPart {

    private String socket;
    private String formFactor;
    private Integer memoryMax; // in GB
    private Integer memorySlots;
    private String colour;

}
