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
@DiscriminatorValue("POWER_SUPPLY")
public class PowerSupply extends PCPart {

    private String type;
    private String efficiencyRating; // e.g. 80+ Gold
    private Integer wattage; // in W
    private String modular; // e.g. Full, Semi, No
    private String colour;

}
