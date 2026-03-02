package com.example.DeliveryService.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="clients")
public class Client {

    @Id
    //Defines the way that the java will generate the id, IDENTIFY generates a sequential id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150) //Ensures that name is not null and limits max length
    private String name;

    @Column(name="cpf_cnpj", nullable = false, unique = true) //Change name to convention and make certain that cpf is unique
    private String cpfCnpj;

    private String address;
    private String city;

    @Column(length = 2)
    private String state;
}
