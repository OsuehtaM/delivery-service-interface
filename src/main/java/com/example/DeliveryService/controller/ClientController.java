package com.example.DeliveryService.controller;

import com.example.DeliveryService.model.Client;
import com.example.DeliveryService.service.ClientService;
import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> getAll () {
        return clientService.findAllByIdOrderAsc();
    }

    //Passes the id after the "/" ,through the path, this is called "PathVariable"
    @GetMapping("/{id}")
    public Client getById (@PathVariable Long id){
        return clientService.findById(id);
    }

    @PostMapping
    public Client save (@RequestBody Client client){
        return clientService.save(client);
    }

    @PutMapping("/{id}")
    public Client update (@PathVariable Long id, @RequestBody Client clientDetails){
        Client client = clientService.findById(id);

        client.setName(clientDetails.getName());
        client.setCpfCnpj(clientDetails.getCpfCnpj());
        client.setAddress(clientDetails.getAddress());
        client.setCity(clientDetails.getCity());
        client.setState(client.getState());
        return clientService.save(client);
    }

    @DeleteMapping("/{id}?nameVerification={name}")
    public void delete (@PathVariable Long id, @RequestParam String name){
        Client client = clientService.findById(id);

        if (client.getName().equalsIgnoreCase(name)){
            clientService.delete(id);
        }else{
            ResponseEntity.badRequest();
        }

    }
}
