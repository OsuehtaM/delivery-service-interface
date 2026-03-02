package com.example.DeliveryService.repository;

import com.example.DeliveryService.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
//Implements the JpaRepository Interface, that has all base methods to access a database
public interface ClientRepository extends JpaRepository<Client, Long> {
}
