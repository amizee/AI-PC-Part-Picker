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
@DiscriminatorValue("OS")
public class OS extends PCPart {

    private String mode; // e.g. 64-bit, 32/64-bit
    private Integer maxSupportedMem; // in GB

}
