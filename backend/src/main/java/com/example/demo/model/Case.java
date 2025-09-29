package com.example.demo.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cases")
@Data
@EqualsAndHashCode(callSuper = true) // Include superclass fields in equals
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("CASE")
public class Case extends PCPart {

    private String type;
    private String colour;
    private Integer powerSupply; // in watts; can have none
    private String sidePanelMaterial;
    private Double externalVolume; // in L
    private Integer numInternalBays;

}
