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
@DiscriminatorValue("STORAGE")
public class Storage extends PCPart {

    private Integer capacity; // in GB
    private String type; // e.g. SSD
    private Integer cache; // in MB
    private String formFactor;
    private String connectionInterface; // e.g. PCIe

}
