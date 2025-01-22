
  /* TABN TRIP DETAILS */

  function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // Open Lightbox
function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  setActiveImage(index);
}

// Close Lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
}

// Change Lightbox Image
function changeImage(index) {
  setActiveImage(index);
}

// Set Active Image
function setActiveImage(index) {
  const images = document.querySelectorAll('.lightbox-image');
  images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
  });
}


/* ABA TRIP DETAILS  */
function openTab(evt, tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tabcontent");
  tabContents.forEach(content => content.classList.remove("active"));

  // Remove active class from all buttons
  const tabLinks = document.querySelectorAll(".tablinks");
  tabLinks.forEach(button => button.classList.remove("active"));

  // Show the clicked tab and mark the button as active
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Set the default active tab on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tablinks").click();
});


/* ENVIO DADOS DE EMAIL PARA O NOTION */
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('submitBtn');
  const closeModalBtn = document.querySelector('[data-bs-dismiss="modal"]');
  const responseMessage = document.getElementById('responseMessage');
  const form = document.getElementById('tourForm');
  const modalElement = document.getElementById('exampleModal');
  const modal = new bootstrap.Modal(modalElement);

  async function submitForm() {
      const formData = new FormData(form);
      const data = {
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          country: formData.get('country'),
          tour: formData.get('tour'),
      };

      // Reseta mensagens anteriores
      responseMessage.textContent = '';
      responseMessage.className = 'w-100 text-center';

      if (!data.name || !data.phone || !data.email || !data.country || !data.tour) {
          responseMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
          responseMessage.classList.add('text-danger');
          return;
      }

      try {
          submitBtn.disabled = true; // Desativa o botão enquanto a requisição é processada

          const response = await fetch('http://localhost:3000/api/submit-form', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          });

          if (response.ok) {
              // Exibe mensagem de sucesso
              responseMessage.textContent = 'Dados enviados com sucesso!';
              responseMessage.classList.add('text-success');
              form.style.display = 'none'; // Oculta o formulário
          } else {
              throw new Error('Erro ao enviar os dados.');
          }
      } catch (error) {
          responseMessage.textContent = error.message;
          responseMessage.classList.add('text-danger');
      } finally {
          submitBtn.disabled = false; // Reativa o botão para futuras interações
      }
  }

  function resetFormAndModal() {
      // Reseta o formulário e as mensagens
      form.reset();
      form.style.display = 'block'; // Reexibe o formulário para interações futuras
      responseMessage.textContent = '';
      responseMessage.className = 'w-100 text-center';
  }

  closeModalBtn.addEventListener('click', () => {
      resetFormAndModal(); // Reseta o modal ao fechar
  });

  submitBtn.addEventListener('click', submitForm);
});


/* PLAN YOUR TRIP CODE */
// server.js - Node.js com Notion API
document.querySelector("#tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();  // Impede que o formulário seja submetido de forma tradicional e o modal feche

  // Pegando os valores dos campos
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const targetBird = document.getElementById("targetBird").value.trim();
  const preferredMonth = document.getElementById("preferredMonth").value;
  const groupSize = parseInt(document.getElementById("groupSize").value, 10);

  // Desabilitar o formulário enquanto o envio está em andamento
  const formElements = document.querySelectorAll("#tripForm input, #tripForm select, #tripForm button");
  formElements.forEach(el => el.disabled = true);

  // Limpar mensagens de resultado anteriores
  const resultContainer = document.getElementById("formResult");
  resultContainer.innerHTML = "";

  try {
      // Enviar dados para o backend (que se conecta ao Notion)
      const response = await fetch("/PlanYourTrip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              fullName,
              email,
              targetBird,
              preferredMonth,
              groupSize
          })
      });

      const result = await response.json();

      // Exibir mensagem de sucesso ou erro
      if (response.ok) {
          resultContainer.innerHTML = `
              <div class="alert alert-success">
                  <strong>Success!</strong> ${result.message}
              </div>
          `;
          // Esconder o formulário
          document.querySelector("#tripForm").style.display = "none";
      } else {
          throw new Error(result.message || "Something went wrong.");
      }
  } catch (error) {
      resultContainer.innerHTML = `
          <div class="alert alert-danger">
              <strong>Error!</strong> ${error.message}
          </div>
      `;
  } finally {
      // Reabilitar os campos do formulário
      formElements.forEach(el => el.disabled = false);
  }
});

