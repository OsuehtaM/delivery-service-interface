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
        const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(error.message || "Falha na requisição");
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
        const error = await response.json().catch(() => ({message: "Erro desconhico"}));
        throw new Error(error.message || "Falha na requisição")
    }
    return client
}

function updateEditModal(client) {
    document.getElementById('editName').value = client.name;
    document.getElementById('editCpfCnpj').value = client.cpfCnpj;
    document.getElementById('editAddress').value = client.address;
    document.getElementById('editCity').value = client.city;
    document.getElementById('editState').value = client.state;
}

async function updateClient(payload) {
    const response = await fetch (`${API_BASE_URL}/client`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Erro desconhecido"}));
        throw new Error(error.message || "Falha na requisição");
    }
    
}

// --- 3. UI HANDLERS (Manipulação da Tela) ---
function setupEventListeners() {
    

    // Botões de controle do Modal
    const modal = document.querySelector("#register-modal");

    document.querySelector("#register").onclick = () => modal.showModal();
    document.querySelector("#cancel-button").onclick = () => modal.close();

    
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
    
    // Update Client

    document.getElementById('client-list').addEventListener('click', (event) => {

        if (event.target.classList.contains('edit-client')) {
            const editModal = document.querySelector("#update-modal");

            const client = readClient(event.target.dataset.id);

            updateEditModal(client);

            editModal.showModal();

        }
    })

    const editForm = document.getElementById('edit-form');

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(editForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const result = await updateClient(payload)
        }
        catch{
            
        }
    })
}

// --- 4. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', setupEventListeners);