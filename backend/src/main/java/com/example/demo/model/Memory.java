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
@DiscriminatorValue("MEMORY")
public class Memory extends PCPart {

    private String speed; // e.g. DDR5-6000
    private Integer numModules;
    private Integer moduleSize; // in GB
    private String colour;
    private Integer firstWordLatency; // in ns
    private Integer CASLatency;

}
