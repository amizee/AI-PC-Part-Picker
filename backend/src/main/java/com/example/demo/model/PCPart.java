package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "part_type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CPU.class, name = "CPU"),
        @JsonSubTypes.Type(value = GPU.class, name = "GPU"),
        @JsonSubTypes.Type(value = Cooler.class, name = "Cooler"),
        @JsonSubTypes.Type(value = Case.class, name = "Case"),
        @JsonSubTypes.Type(value = Memory.class, name = "Memory"),
        @JsonSubTypes.Type(value = Motherboard.class, name = "Motherboard"),
        @JsonSubTypes.Type(value = OS.class, name = "OS"),
        @JsonSubTypes.Type(value = PowerSupply.class, name = "PowerSupply"),
        @JsonSubTypes.Type(value = Storage.class, name = "Storage")
})
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
//@DiscriminatorColumn(name = "part_type", discriminatorType = DiscriminatorType.STRING)
public abstract class PCPart {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column (nullable = false)
    private Double price;

    private String imageURL;

    @Column(name = "part_type", nullable = false)
    private String partType;

    @OneToMany(mappedBy = "pcPart")
    @JsonIgnore // Prevents recursive nesting when serializing
    private List<AdCopy> adCopies;

}
