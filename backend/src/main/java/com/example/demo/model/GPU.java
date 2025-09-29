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
@DiscriminatorValue("GPU")
public class GPU extends PCPart {

    private String chipset;
    private Integer memory; // in GB
    private Integer coreClock; // in MHz
    private Integer boostClock; // in MHz
    private String colour;
    private Integer length; // in mm

}
