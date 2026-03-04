// --- 1. CONFIGURAÇÕES ---
const API_BASE_URL = 'http://localhost:8080';

// --- 2. SERVIÇOS (Lógica de API) ---
// --- Create Client ---
async function createClient(payload) {
    const response = await fetch(`${API_BASE_URL}/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(error.message || "Request failure");
    }

    return await response.json();
}

async function loadClients() {
    const clientList = document.getElementById('client-list')

    try {
        // Default method is GET
        const response = await fetch (`${API_BASE_URL}/client`)
        const clients = await response.json();

        clientList.innerHTML = '';

        clients.forEach(client => {
            const card = `
                <div class="client-card">
                    <div class="card-header">
                        <h3 class="client-name">${client.name}</h3>
                        <h4 class="client-cpf">${client.cpfCnpj}</h4>
                    </div>
                    <div class="card-localization">
                        <h4 class="client-address">${client.address}</h4>
                        <h4 class="client-city">${client.city}</h4>
                        <h4 class="client-state">${client.state}</h4>
                    </div>
                    <div class="card-footer">
                        <p class="client-id">${client.id}</p>
                        <button class="edit-client" data-id="${client.id}"><i class="fa-solid fa-pencil"></i></button>
                        <button class="delete-client" data-id="${client.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `
            clientList.innerHTML += card;
        });
    }catch (error) {
        console.error("Failed to load clients: ", error)
    }
}

async function readClient(id){
    const response = await fetch (`${API_BASE_URL}/client/${id}`)
    const client = await response.json();

    if (!response.ok){
        const error = await response.json().catch(() => ({message: "Unknown error"}));
        throw new Error(error.message || "Request failure")
    }
    return client
}

function updateEditModal(client) {
    document.getElementById('editId').value = client.id;
    document.getElementById('editName').value = client.name;
    document.getElementById('editCpfCnpj').value = client.cpfCnpj;
    document.getElementById('editAddress').value = client.address;
    document.getElementById('editCity').value = client.city;
    document.getElementById('editState').value = client.state;
}

async function updateClient(payload, id) {
    const response = await fetch (`${API_BASE_URL}/client/${id}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error"}));
        throw new Error(error.message || "Request failure");
    }

    return await response.json();
}

function updateDeleteModal (client) {
    document.getElementById('deleteId').value = client.id;
}

async function deleteClient(name, id) {
    const response = await fetch (`${API_BASE_URL}/client/${id}?nameVerification=${name}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error"}));
        throw new Error(error.message || "Request failure")
    } 
}

// --- 3. UI HANDLERS (Manipulação da Tela) ---
function setupEventListeners() {
    

    // Botões de controle do Modal
    const modal = document.querySelector("#register-modal");

    document.querySelector("#register").onclick = () => modal.showModal();
    document.querySelector("#register-modal .cancel-button").onclick = () => modal.close();

    
    // Envio do Formulário
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(registerForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const result = await createClient(payload);
            alert(`Sucesso! Cliente ${result.name} salvo.`);
            
            registerForm.reset();
            modal.close();
            location.reload();
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message);
        }
    });

    // Load Clients
    loadClients();
    
    // Click on Option for Client
    document.getElementById('client-list').addEventListener('click', async (event) => {

        if (event.target.closest(".edit-client")) {
            const button = event.target.closest(".edit-client")

            const editModal = document.querySelector("#update-modal");
            const client = await readClient(button.dataset.id);
            document.querySelector("#update-modal .cancel-button").onclick = () => editModal.close();

            updateEditModal(client);

            editModal.showModal();

        }else if (event.target.closest(".delete-client")){
            const button = event.target.closest(".delete-client")

            const deleteModal = document.querySelector("#delete-modal");
            const client = await readClient(button.dataset.id);
            document.querySelector("#delete-modal .cancel-button").onclick = () => deleteModal.close();

            updateDeleteModal(client);

            deleteModal.showModal();
        }
    })

    // Send Update Client from modal
    const editForm = document.getElementById('edit-form');
    
    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(editForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const result = await updateClient(payload, formData.get('id'))
            alert (`Sucesso! Client ${result.name} salvo.`);

            document.querySelector("#update-modal").close();
            location.reload();
        }
        catch(error){
            console.error("Erro no cadastro:", error);
            alert(error.message);
        }
    })

    // Send Delete Client from modal
    const deleteForm = document.getElementById('delete-form');

    deleteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(deleteForm);

        try {
            await deleteClient(formData.get('name'), formData.get('id'))
            alert("Success! Client removed!");

            document.querySelector("#delete-modal").close();
            location.reload();
        }
        catch(error){
            console.error("Delete Error", error);
            alert(error.message);
        }
    })
}

// --- 4. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', setupEventListeners);