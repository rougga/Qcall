
package main.modal;

import java.util.UUID;

public class Task {
    UUID id;
    String name;
    String id_service;

    public Task(String name, String id_service) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.id_service = id_service;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getId_service() {
        return id_service;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId_service(String id_service) {
        this.id_service = id_service;
    }
    
}
