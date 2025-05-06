function showTab(tabId, clickedTab) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.querySelectorAll('.tab-header').forEach(tab => tab.classList.remove('active'));
  clickedTab.classList.add('active');

  if (tabId === 'historial') {
    mostrarHistorial();
  }
}

function guardarRegistro(tipo) {
  const cantidadInput = document.getElementById('ml');
  const cantidad = parseInt(cantidadInput.value, 10);

  if (!cantidad || cantidad <= 0) {
    showModal('Por favor ingresa un valor válido en mililitros.');
    return;
  }

  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  const fechaHora = new Date().toLocaleString();
  registros.push({ tipo, cantidad, fechaHora });
  localStorage.setItem('registros', JSON.stringify(registros));

  cantidadInput.value = '';
  showModal(`Registro de ${tipo} guardado correctamente.`);
}

function mostrarHistorial() {
  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  const tablaAgua = document.getElementById('tablaAgua');
  const tablaOrina = document.getElementById('tablaOrina');

  tablaAgua.innerHTML = '';
  tablaOrina.innerHTML = '';

  let totalAgua = 0;
  let totalOrina = 0;

  registros
    .slice()
    .reverse()
    .forEach((reg, i) => {
      const index = registros.length - 1 - i;
      const row = document.createElement('tr');
      row.className = `row-${reg.tipo}`;

      row.innerHTML = `
        <td>${reg.fechaHora}</td>
        <td>
          <span id="ml-display-${index}">${reg.cantidad}</span>
          <input type="number" id="ml-input-${index}" value="${reg.cantidad}" style="display:none; width:60px;" />
        </td>
        <td>
          <button onclick="editarRegistro(${index})"><i class="fa-solid fa-pencil"></i></button>
          <button onclick="borrarRegistro(${index})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;

      if (reg.tipo === 'agua') {
        tablaAgua.appendChild(row);
        totalAgua += reg.cantidad;
      } else if (reg.tipo === 'orina') {
        tablaOrina.appendChild(row);
        totalOrina += reg.cantidad;
      }
    });

  // Agregar fila de totales
  const filaTotalAgua = document.createElement('tr');
  filaTotalAgua.innerHTML = `
    <td><strong>Total</strong></td>
    <td colspan="2"><strong>${totalAgua} ml</strong></td>
  `;
  tablaAgua.appendChild(filaTotalAgua);

  const filaTotalOrina = document.createElement('tr');
  filaTotalOrina.innerHTML = `
    <td><strong>Total</strong></td>
    <td colspan="2"><strong>${totalOrina} ml</strong></td>
  `;
  tablaOrina.appendChild(filaTotalOrina);
}

function editarRegistro(index) {
  const displaySpan = document.getElementById(`ml-display-${index}`);
  const inputField = document.getElementById(`ml-input-${index}`);

  if (displaySpan.style.display === 'none') {
    const nuevaCantidad = parseInt(inputField.value, 10);
    if (!nuevaCantidad || nuevaCantidad <= 0) {
      showModal('Valor inválido.');
      return;
    }

    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros[index].cantidad = nuevaCantidad;
    localStorage.setItem('registros', JSON.stringify(registros));
    mostrarHistorial();
  } else {
    displaySpan.style.display = 'none';
    inputField.style.display = 'inline-block';
    inputField.focus();
  }
}

function borrarRegistro(index) {
  const registros = JSON.parse(localStorage.getItem('registros')) || [];
  registros.splice(index, 1);
  localStorage.setItem('registros', JSON.stringify(registros));
  mostrarHistorial();
  showModal("Registro eliminado.");
}

function confirmarBorrarHistorial() {
  showModal("¿Estás seguro de que quieres borrar todos los registros?");
  const modalButton = document.querySelector('#modal button');
  modalButton.textContent = 'Confirmar';
  modalButton.onclick = function () {
    borrarHistorial();
    closeModal();
  };
}

function borrarHistorial() {
  localStorage.removeItem('registros');
  mostrarHistorial();
  showModal("Registros eliminados.");
}

function showModal(message) {
  document.getElementById('modal-message').textContent = message;
  document.getElementById('modal').style.display = 'block';
  document.querySelector('#modal button').textContent = 'Cerrar';
  document.querySelector('#modal button').onclick = closeModal;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
