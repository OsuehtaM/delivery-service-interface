package com.example.DeliveryService.service;

import com.example.DeliveryService.model.Client;
import com.example.DeliveryService.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // Don't have the need to return an exception case found anything, just an empty list
    public List<Client> findAll(){
        return clientRepository.findAll();
    }

    public List<Client> findAllByIdOrderAsc() {
        return clientRepository.findAllByOrderByIdAsc();
    }

    // Get clients by id, "findById" is used 'cause can return an exception to be handled
    public Client findById(Long id){
        return clientRepository.findById(id)
                // Case not found the client, throws an exception
                .orElseThrow(() -> new EntityNotFoundException("Client not found!"));
    }

    public Client save(Client client){
        return clientRepository.save(client);
    }

    public void delete(Long id){
        clientRepository.deleteById(id);
    }
}
