package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PCBuild {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;
    private Double totalPrice;

    @OneToOne
    private Case pcCase;

    @OneToOne
    private Cooler cooler;

    @OneToOne
    private CPU cpu;

    @OneToOne
    private GPU gpu;

    @OneToOne
    private Memory memory;

    @OneToOne
    private Motherboard motherboard;

    @OneToOne
    private OS os;

    @OneToOne
    private PowerSupply powerSupply;

    @OneToOne
    private Storage storage;

}
