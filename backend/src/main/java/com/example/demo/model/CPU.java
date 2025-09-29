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
@DiscriminatorValue("CPU")
public class CPU extends PCPart {

    private Integer coreCount;
    private Double performanceCoreClock; // in GHz
    private Double performanceCoreBoostClock; // in GHz
    private String microArchitecture;
    private Integer tdp; // in W (Watts)
    private String integratedGraphics; // can be None

}
