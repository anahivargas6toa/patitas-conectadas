

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
declare var jsQR: any;

// Fix: Renamed 'Comment' to 'PetComment' to avoid conflict with the global DOM 'Comment' type.
interface PetComment {
  id: number;
  petId: number;
  userId: number;
  username: string;
  userProfilePic: string;
  text: string;
  timestamp: number;
}

interface Pet {
  id: number;
  ownerId: number;
  name: string;
  breed: string;
  age: string;
  photo: string;
  status: string;
  description: string;
  isPublished: boolean;
  publicationDate?: number | null;
  comments: PetComment[];
  qrCode: string;
}

interface User {
  id: number;
  fullname: string;
  username: string;
  password?: string; // Password is optional when receiving data
  phone: string;
  email: string;
  address: string;
  profilePic: string;
  pets: Pet[];
}


document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURACIÓN DE API ---
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWHrNza5bPe-mu2aqCkKl2TbCFCbNOcY533Ca0CaCwWy8w4A6RHeqUT4pganTikn0/exec'; // <-- ¡¡¡IMPORTANTE!!! Pega aquí la URL de tu NUEVO Google Apps Script que acabas de implementar.

  // --- STATE ---
  const defaultUserPic = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAxMy41QzE1LjA5NTMgMTMuNSAxNy42MjUgMTEuMDQ0MyAxNy42MjUgOEExLjUgMS41IDAgMCAwIDE3LjYyNSA1QzE3LjYyNSA2LjA0NDI5IDE1LjA5NTMgMy41IDEyIDMuNUM4LjkwNDcyIDMuNSAzLjA5NDM3IDYuMDQ0MjkgMy4wOTQzNyA4QTEuNSAxLjUgMCAwIDAgMy4wOTQzNyAxMUMzLjA5NDM3IDkuOTU1NzEgOC45MDQ3MiAxMy41IDEyIDEzLjVaTTE5LjUgMjAuNUMxOS41IDIwLjUgMjEgMjAgMjEgMTcuNUMyMSAxNC41IDE1LjUgMTQuNSAxMiAxNC41QzguNSAxNC41IDMgMTQuNSAzIDE3LjVDMyAyMCA0LjUgMjAuNSA0LjUgMjAuNUgxOS41WiIgZmlsbD0iI2NkY2RjZCIvPgo8L3N2Zz4K';
  const defaultPetPic = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1Ljg2NCA4LjM2Mzk1QzE1Ljg2NCA5LjQxNDMyIDE1LjAyMzMgMTAuMjU1IDE0IDEwLjI1NUMxMi45NzY3IDEwLjI1NSAxMi4xMzYgOS40MTQzMiAxMi4xMzYgOC4zNjM5NUMxMi4xMzYgNy4zMTM1OCAxMi45NzY3IDYuNDcyOSAxNCA2LjQ3MjlDMTUuMDIzMyA2LjQ3MjkgMTUuODY0IDcuMzEzNTggMTUuODY0IDguMzYzOTVaTTguMTgxNTIgMTMuOTc3NEM5LjIwNDg4IDEzLjk3NzQgMTAuMDQ1NSA5LjQxNDMyIDEwLjA0NTUgMTIuMDg2M0MxMC4wNDU1IDExLjAzNiA5LjIwNDg4IDEwLjE5NTMgOC4xODE1MiAxMC4xOTUzQzcuMTU4MTYgMTAuMTOTUzIDYuMzE3NDkgMTEuMDM2IDYuMzE3NDkgMTIuMDg2M0M2LjMxNzQ5IDEzLjEzNjcgNy4xNTgxNiAxMy45Nzc0IDguMTgxNTIgMTMuOTc3NFoiIGZpbGw9IiM4RDVCNEMiLz4KPHBhdGggZD0iTTEwLjA0NTUgMTAuMjU1QzExLjA2ODggMTAuMjU1IDExLjkwOTUgOS40MTQzMiAxMS45MDk1IDguMzYzOTVDMTEuOTA5NSA3LjMxMzU4IDExLjA2ODggNi44NzI5IDEwLjA0NTUgNi40NzI5QzkuMDIyMTkgNi44NzI5IDguMTgxNTIgNy4zMTM1OCA4LjE4MTUyIDguMzYzOTVDOC4xODE1MiA5LjQxNDMyIDkuMDIyMTkgMTAuMjU1IDEwLjA0NTUgMTAuMjU1WiIgZmlsbD0iIzVEQUVDMyIvPgo8cGF0aCBkPSJNMTUuODY0IDEzLjk3NzRDMTYuODg3NCAxMy45Nzc0IDE3LjcyOCAxMy4xMzY3IDE3LjcyOCAxMi4wODYzQzE3LjcyOCAxMS4wMzYgMTYuODg3NCAxMC4xOTUzIDE1Ljg2NCAxMC4xOTUzQzE4LjQ4MDYgMTAuMTOTUzIDE0IDExLjAzNiAxNCAxMi4wODYzQzE0IDEzLjEzNjcgMTQuODQwNiAxMy45Nzc0IDE1Ljg2NCAxMy45Nzc0WiIgZmlsbD0iIzVEQUVDMyIvPgo8cGF0aCBkPSJNMTIgMThDMTQuMzUyMyAxOCAxNi4yNzI3IDE2LjIxNjIgMTYuMjcyNyAxNC4wNDU1QzE2LjI3MjcgMTEuODc0NyAxNC4zNTIzIDEwLjA5MDkgMTIgMTAuMDkwOUM5LjY4NzcyIDEwLjA5MDkgNy43MjcyNyAxMS44NzQ3IDcuNzI3MjcgMTQuMDQ1NUM3LjcyNzI3IDE2LjIxNjIgOS42NDc3MiAxOCAxMiAxOFoiIGZpbGw9IiM4RDVCNEMiLz4KPC9zdmc+Cg==';
  
  let allUsers: User[] = [];
  let allPets: Pet[] = [];
  let currentUser: User | null = null;
  let currentPage = 1;
  let currentFilter = 'all';
  const publicationsPerPage = 6;

  // --- API HELPER ---
  const apiCall = async (action: string, payload: any) => {
    // Aquí puedes añadir un spinner de carga
    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action, payload }),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Apps Script web apps a menudo funcionan mejor con text/plain
        },
    });

    if (!response.ok) { // handle HTTP errors
        throw new Error(`Error de red: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Error desconocido en la API');
    }
    // Aquí puedes quitar el spinner de carga
    return result.data;
  };

  // --- FUNCIÓN PARA GUARDAR ESTADO ---
  const saveCurrentUserState = async () => {
    if (!currentUser) return null;
    try {
      return await apiCall('saveUserData', currentUser);
    } catch (error) {
      console.error('Failed to save user state:', error);
      alert(`Error al guardar estado: ${(error as Error).message}`);
      return null;
    }
  };

  // --- VIEWS ---
  const splashScreen = document.getElementById('splash-screen');
  const mainView = document.getElementById('main-view');
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const profileView = document.getElementById('profile-view');
  const editProfileView = document.getElementById('edit-profile-view');
  const registerPetView = document.getElementById('register-pet-view');
  const editPetView = document.getElementById('edit-pet-view');
  const publicationsView = document.getElementById('publications-view');
  const qrScannerView = document.getElementById('qr-scanner-view');

  const views: HTMLElement[] = [mainView, loginView, registerView, profileView, editProfileView, registerPetView, editPetView, publicationsView].filter(v => v !== null) as HTMLElement[];
  let currentView: HTMLElement | null = null;
  
  // --- BUTTONS ---
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const registerFromLoginButton = document.getElementById('register-from-login');
  const backToMainButton = document.getElementById('back-to-main');
  const backToMainFromRegisterButton = document.getElementById('back-to-main-from-register');
  const loginFromRegisterButton = document.getElementById('login-from-register');
  const logoutButton = document.getElementById('logout-button');
  const editProfileButton = document.getElementById('edit-profile-button');
  const cancelEditButton = document.getElementById('cancel-edit-button');
  const registerPetButton = document.getElementById('register-pet-button');
  const cancelRegisterPetButton = document.getElementById('cancel-register-pet-button');
  const cancelEditPetButton = document.getElementById('cancel-edit-pet-button');
  const publicationsButton = document.getElementById('publications-button');
  const backToProfileFromPublications = document.getElementById('back-to-profile-from-publications');
  const scanQrButton = document.getElementById('scan-qr-button');
  const cancelScanBtn = document.getElementById('cancel-scan-btn');


  // --- USER FORM ELEMENTS ---
  const loginForm = document.getElementById('login-form');
  const loginUsernameInput = document.getElementById('login-username') as HTMLInputElement;
  const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
  const loginError = document.getElementById('login-error');
  const loginPasswordError = document.getElementById('login-password-error');
  const loginSubmitButton = loginForm?.querySelector('button[type="submit"]') as HTMLButtonElement;
  
  const registerForm = document.getElementById('register-form');
  const profilePicInput = document.getElementById('reg-profile-pic') as HTMLInputElement;
  const profilePicPreview = document.getElementById('profile-pic-preview') as HTMLImageElement;
  const regFullnameInput = document.getElementById('reg-fullname') as HTMLInputElement;
  const regUsernameInput = document.getElementById('reg-username') as HTMLInputElement;
  const regPasswordInput = document.getElementById('reg-password') as HTMLInputElement;
  const regPhoneInput = document.getElementById('reg-phone') as HTMLInputElement;
  const regEmailInput = document.getElementById('reg-email') as HTMLInputElement;
  const regAddressInput = document.getElementById('reg-address') as HTMLInputElement;
  const regPasswordError = document.getElementById('register-password-error');
  const registerSubmitButton = document.getElementById('submit-register') as HTMLButtonElement;

  const editProfileForm = document.getElementById('edit-profile-form');
  const editProfilePicInput = document.getElementById('edit-profile-pic') as HTMLInputElement;
  const editProfilePicPreview = document.getElementById('edit-profile-pic-preview') as HTMLImageElement;
  const editFullnameInput = document.getElementById('edit-fullname') as HTMLInputElement;
  const editUsernameInput = document.getElementById('edit-username') as HTMLInputElement;
  const editPasswordInput = document.getElementById('edit-password') as HTMLInputElement;
  const editPhoneInput = document.getElementById('edit-phone') as HTMLInputElement;
  const editEmailInput = document.getElementById('edit-email') as HTMLInputElement;
  const editAddressInput = document.getElementById('edit-address') as HTMLInputElement;

  // --- PET FORM ELEMENTS ---
  const registerPetForm = document.getElementById('register-pet-form');
  const registerPetPicInput = document.getElementById('register-pet-pic') as HTMLInputElement;
  const registerPetPicPreview = document.getElementById('register-pet-pic-preview') as HTMLImageElement;
  const registerPetNameInput = document.getElementById('register-pet-name') as HTMLInputElement;
  const registerPetBreedInput = document.getElementById('register-pet-breed') as HTMLInputElement;
  const registerPetAgeInput = document.getElementById('register-pet-age') as HTMLInputElement;
  const registerPetStatusInput = document.getElementById('register-pet-status') as HTMLSelectElement;
  const registerPetDescriptionInput = document.getElementById('register-pet-description') as HTMLTextAreaElement;
  
  const editPetForm = document.getElementById('edit-pet-form');
  const editPetIdInput = document.getElementById('edit-pet-id') as HTMLInputElement;
  const editPetPicInput = document.getElementById('edit-pet-pic') as HTMLInputElement;
  const editPetPicPreview = document.getElementById('edit-pet-pic-preview') as HTMLImageElement;
  const editPetNameInput = document.getElementById('edit-pet-name') as HTMLInputElement;
  const editPetBreedInput = document.getElementById('edit-pet-breed') as HTMLInputElement;
  const editPetAgeInput = document.getElementById('edit-pet-age') as HTMLInputElement;
  const editPetStatusInput = document.getElementById('edit-pet-status') as HTMLSelectElement;
  const editPetDescriptionInput = document.getElementById('edit-pet-description') as HTMLTextAreaElement;
  const editPetOwnerName = document.getElementById('edit-pet-owner-name');
  const editPetOwnerPhone = document.getElementById('edit-pet-owner-phone');

  // --- PROFILE ELEMENTS ---
  const profileCardPic = document.getElementById('profile-card-pic') as HTMLImageElement;
  const profileCardName = document.getElementById('profile-card-name');
  const profileCardUsername = document.getElementById('profile-card-username');
  const profileCardPhone = document.getElementById('profile-card-phone');
  const profileCardEmail = document.getElementById('profile-card-email');
  const profileCardAddress = document.getElementById('profile-card-address');
  const petsListContainer = document.getElementById('pets-list-container');

  // --- PUBLICATIONS ELEMENTS ---
  const publicationsContainer = document.getElementById('publications-container');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const paginationControls = document.getElementById('pagination-controls');
  const filterControls = document.getElementById('filter-controls');

  // --- QR MODAL ELEMENTS ---
  const qrCodeModal = document.getElementById('qr-code-modal');
  const qrModalCloseBtn = document.getElementById('qr-modal-close-btn');
  const qrModalTitle = document.getElementById('qr-modal-title');
  const qrModalImage = document.getElementById('qr-modal-image') as HTMLImageElement;
  const qrDownloadBtn = document.getElementById('qr-download-btn') as HTMLAnchorElement;

  // --- QR SCANNER ELEMENTS ---
  const qrVideo = document.getElementById('qr-video') as HTMLVideoElement;
  const qrCanvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
  const scannedInfoModal = document.getElementById('scanned-info-modal');
  const scannedInfoCloseBtn = document.getElementById('scanned-info-close-btn');
  const scannedPetName = document.getElementById('scanned-pet-name');
  const scannedOwnerName = document.getElementById('scanned-owner-name');
  const scannedOwnerPhone = document.getElementById('scanned-owner-phone');
  const callOwnerBtn = document.getElementById('call-owner-btn') as HTMLAnchorElement;
  let videoStream: MediaStream | null = null;
  let animationFrameId: number | null = null;

  // --- CONFIRMATION MODAL ELEMENTS ---
  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  
  // --- USER PROFILE MODAL ELEMENTS ---
  const userProfileModal = document.getElementById('user-profile-modal');
  const userProfileModalCloseBtn = document.getElementById('user-profile-modal-close-btn');
  const userProfileModalPic = document.getElementById('user-profile-modal-pic') as HTMLImageElement;
  const userProfileModalName = document.getElementById('user-profile-modal-name');
  const userProfileModalUsername = document.getElementById('user-profile-modal-username');
  const userProfileModalPhone = document.getElementById('user-profile-modal-phone');
  const userProfileModalEmail = document.getElementById('user-profile-modal-email');
  const userProfileModalAddress = document.getElementById('user-profile-modal-address');
  const userProfileModalCallBtn = document.getElementById('user-profile-modal-call-btn') as HTMLAnchorElement;

  // --- VIEW NAVIGATION ---
  const navigateTo = (targetView: HTMLElement | null) => {
    if (!targetView || targetView === currentView) return;
    const transitionOut = () => {
        currentView?.classList.add('hidden');
        targetView.classList.remove('hidden');
        setTimeout(() => targetView.classList.add('fade-in'), 20);
        currentView = targetView;
    };
    if (currentView) {
      currentView.classList.remove('fade-in');
      setTimeout(transitionOut, 300);
    } else {
        views.forEach(v => v.classList.add('hidden'));
        targetView.classList.remove('hidden');
        setTimeout(() => targetView.classList.add('fade-in'), 20);
        currentView = targetView;
    }
  };
  
  // --- DATA HANDLING ---
  const populateProfileCard = (user: User) => {
    if (!user) return;
    if (profileCardPic) profileCardPic.src = user.profilePic;
    if (profileCardName) profileCardName.textContent = user.fullname;
    if (profileCardUsername) profileCardUsername.textContent = `@${user.username}`;
    if (profileCardPhone) profileCardPhone.textContent = user.phone;
    if (profileCardEmail) profileCardEmail.textContent = user.email;
    if (profileCardAddress) profileCardAddress.textContent = user.address || 'No especificada';
    renderPets();
  };

  const populateEditForm = (user: User) => {
    if (!user) return;
    if (editProfilePicPreview) editProfilePicPreview.src = user.profilePic;
    if (editFullnameInput) editFullnameInput.value = user.fullname;
    if (editUsernameInput) editUsernameInput.value = user.username;
    if (editPhoneInput) editPhoneInput.value = user.phone;
    if (editEmailInput) editEmailInput.value = user.email;
    if (editAddressInput) editAddressInput.value = user.address;
    if (editPasswordInput) editPasswordInput.value = '';
  };
  
  const resetAllForms = () => {
      if (loginForm) {
          (loginForm as HTMLFormElement).reset();
          if (loginSubmitButton) loginSubmitButton.disabled = true;
          if (loginPasswordError) loginPasswordError.textContent = '';
      }
      if (registerForm) {
        (registerForm as HTMLFormElement).reset();
        if (registerSubmitButton) registerSubmitButton.disabled = true;
        if (regPasswordError) regPasswordError.textContent = '';
      }
      if (editProfileForm) (editProfileForm as HTMLFormElement).reset();
      if (registerPetForm) (registerPetForm as HTMLFormElement).reset();
      if (editPetForm) (editPetForm as HTMLFormElement).reset();
      if (profilePicPreview) profilePicPreview.src = defaultUserPic;
      if (registerPetPicPreview) registerPetPicPreview.src = defaultPetPic;
  };

  // --- RENDER PETS ---
  const renderPets = () => {
    if (!petsListContainer || !currentUser) return;
    petsListContainer.innerHTML = ''; // Clear existing pets
    
    const userPets = allPets.filter(p => p.ownerId === currentUser.id);

    userPets.forEach((pet: Pet) => {
      const petCard = document.createElement('div');
      petCard.className = 'pet-card';
      petCard.dataset.petId = pet.id.toString();

      const statusClass = `status-${pet.status.toLowerCase().replace(' ', '-')}`;
      
      let publicationAction = '';
      const isPublishable = ['Perdido', 'En adopción', 'Encontrado'].includes(pet.status);
      if (isPublishable) {
          if (pet.isPublished) {
              publicationAction = `<div class="publication-status-badge published">✓ Publicado</div>`;
          } else {
              publicationAction = `
                <button class="pet-action-btn publish-pet-btn" aria-label="Publicar Mascota">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="#337AB7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
              `;
          }
      }

      petCard.innerHTML = `
        <img src="${pet.photo}" alt="${pet.name}" class="pet-card-photo">
        <div class="pet-card-info">
          <span class="pet-status-badge ${statusClass}">${pet.status}</span>
          <div class="pet-card-header">
            <h3>${pet.name}</h3>
            <p class="pet-breed">${pet.breed}</p>
          </div>
          <p class="pet-card-description">${pet.description}</p>
        </div>
        <div class="pet-card-actions">
          ${publicationAction}
          <button class="pet-action-btn qr-pet-btn" aria-label="Mostrar Código QR">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 11H11V3H3V11ZM5 5H9V9H5V5Z" fill="#6C757D"/>
                  <path d="M3 21H11V13H3V21ZM5 15H9V19H5V15Z" fill="#6C757D"/>
                  <path d="M13 3V11H21V3H13ZM19 9H15V5H19V9Z" fill="#6C757D"/>
                  <path d="M13 13H15V15H13V13Z" fill="#6C757D"/><path d="M15 15H17V17H15V15Z" fill="#6C757D"/>
                  <path d="M17 17H19V19H17V17Z" fill="#6C757D"/><path d="M19 19H21V21H19V19Z" fill="#6C757D"/>
                  <path d="M19 13H21V15H19V13Z" fill="#6C757D"/><path d="M17 13H19V15H17V13Z" fill="#6C757D"/>
                  <path d="M15 17H17V19H15V17Z" fill="#6C757D"/><path d="M13 19H15V21H13V19Z" fill="#6C757D"/>
              </svg>
          </button>
          <button class="pet-action-btn edit-pet-btn" aria-label="Editar Mascota">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#8D5B4C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
          <button class="pet-action-btn delete-pet-btn" aria-label="Eliminar Mascota">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#D9534F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </div>
      `;
      petsListContainer.appendChild(petCard);
    });
  };

  // --- RENDER PAGINATION CONTROLS ---
  const renderPaginationControls = (totalItems: number, page: number) => {
    if (!paginationControls) return;
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(totalItems / publicationsPerPage);

    if (totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.className = 'btn pagination-btn';
    prevButton.id = 'prev-page-btn';
    if (page === 1) {
        prevButton.disabled = true;
    }

    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Página ${page} de ${totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.className = 'btn pagination-btn';
    nextButton.id = 'next-page-btn';
    if (page === totalPages) {
        nextButton.disabled = true;
    }
    
    paginationControls.appendChild(prevButton);
    paginationControls.appendChild(pageInfo);
    paginationControls.appendChild(nextButton);
  };

  // --- RENDER PUBLICATIONS ---
  const renderPublications = (searchTerm = '', page = 1) => {
    if (!publicationsContainer) return;
    publicationsContainer.innerHTML = 'Cargando publicaciones...';
    const normalizedSearch = searchTerm.toLowerCase().trim();

    // 1. Get all publishable pets
    const allPublishablePets = allPets.filter(pet => 
        ['Perdido', 'En adopción', 'Encontrado', 'Adoptado'].includes(pet.status) && pet.isPublished
    );

    // 2. Filter by status or ownership
    const statusFilteredPets = (() => {
        if (currentFilter === 'mine') {
            return currentUser ? allPublishablePets.filter(pet => pet.ownerId === currentUser.id) : [];
        }
        if (currentFilter === 'all') {
            return allPublishablePets;
        }
        return allPublishablePets.filter(pet => pet.status === currentFilter);
    })();

    // 3. Filter by search term
    const finalFilteredPets = statusFilteredPets.filter((pet) => {
      const owner = allUsers.find(u => u.id === pet.ownerId);
      return normalizedSearch === '' ||
        pet.name.toLowerCase().includes(normalizedSearch) ||
        (owner && owner.username.toLowerCase().includes(normalizedSearch));
    });
    
    // 4. Paginate the results
    const startIndex = (page - 1) * publicationsPerPage;
    const paginatedPets = finalFilteredPets.slice(startIndex, startIndex + publicationsPerPage);

    // 5. Render pets for the current page
    publicationsContainer.innerHTML = ''; // Clear loading message
    if (paginatedPets.length === 0) {
        publicationsContainer.innerHTML = '<p>No se encontraron publicaciones con estos criterios.</p>';
    }
    
    paginatedPets.forEach((pet) => {
      const user = allUsers.find(u => u.id === pet.ownerId);
      if (!user) return; // Skip if owner not found

      const pubCard = document.createElement('div');
      pubCard.className = 'publication-card';
      pubCard.dataset.petId = pet.id.toString();
      pubCard.dataset.ownerId = user.id.toString();
      
      const statusClass = `status-${pet.status.toLowerCase().replace(' ', '-')}`;

      const commentsHtml = pet.comments.map(comment => `
        <li class="comment-item">
          <img src="${comment.userProfilePic}" alt="${comment.username}" class="commenter-pic">
          <div class="comment-content">
            <strong>${comment.username}</strong>
            <p>${comment.text}</p>
          </div>
        </li>
      `).join('');

      let deleteButtonHtml = '';
      if (currentUser && currentUser.id === user.id) {
        deleteButtonHtml = `
          <button class="pet-action-btn delete-pet-btn" aria-label="Eliminar Mascota y Publicación">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#D9534F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        `;
      }
      
      const publicationDate = pet.publicationDate ? new Date(pet.publicationDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric'}) : '';

      pubCard.innerHTML = `
          <div class="owner-info">
              <img src="${user.profilePic}" alt="${user.fullname}">
              <div class="owner-details">
                  <p>${user.fullname} (@${user.username})</p>
                  <p class="publication-meta">📞 ${user.phone} ${publicationDate ? `&bull; Publicado: ${publicationDate}` : ''}</p>
              </div>
              ${deleteButtonHtml}
          </div>
          <img src="${pet.photo}" alt="${pet.name}" class="pet-card-photo">
          <div class="pet-card-info">
              <span class="pet-status-badge ${statusClass}">${pet.status}</span>
              <h3>${pet.name}</h3>
              <p>${pet.breed} - ${pet.age}</p>
              <p class="pet-card-description">${pet.description}</p>
          </div>
          <div class="comments-section">
              <ul class="comments-list">${commentsHtml}</ul>
              <form class="comment-form">
                  <input type="text" name="commentText" placeholder="Añade un comentario..." required autocomplete="off">
                  <button type="submit" aria-label="Enviar comentario">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </button>
              </form>
          </div>
      `;
      publicationsContainer.appendChild(pubCard);
    });
    
    // 6. Render pagination controls
    renderPaginationControls(finalFilteredPets.length, page);
  };
  
  // --- PET DELETION ---
  const deletePet = async (petId: number, ownerId: number) => {
    if (!currentUser || currentUser.id !== ownerId) {
        alert('No tienes permiso para eliminar esta mascota.');
        return;
    }
    
    try {
        await apiCall('deletePet', { id: petId });
        // Actualizar el estado local
        allPets = allPets.filter(p => p.id !== petId);
        renderPets(); 
        renderPublications(searchInput.value, currentPage); 
    } catch (error) {
         alert(`Error al eliminar la mascota: ${(error as Error).message}`);
    }
  };

  // --- QR SCANNER LOGIC ---
  const stopScanner = () => {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (qrScannerView) qrScannerView.classList.add('hidden');
    videoStream = null;
    animationFrameId = null;
  };

  const handleScannedData = (data: string) => {
    const lines = data.split('\n');
    if (lines.length < 3 || !data.includes('Nombre:') || !data.includes('Dueño/a:') || !data.includes('Contacto:')) {
      alert('Código QR no válido para esta aplicación.');
      return;
    }

    try {
        const petName = lines[0].split(':')[1].trim();
        const ownerName = lines[1].split(':')[1].trim();
        const ownerPhone = lines[2].split(':')[1].trim();
        
        if (scannedPetName) scannedPetName.textContent = petName;
        if (scannedOwnerName) scannedOwnerName.textContent = ownerName;
        if (scannedOwnerPhone) scannedOwnerPhone.textContent = ownerPhone;
        if (callOwnerBtn) callOwnerBtn.href = `tel:${ownerPhone.replace(/\s+/g, '')}`;
        
        scannedInfoModal?.classList.remove('hidden');

    } catch (e) {
        alert('Formato de código QR incorrecto.');
    }
  };

  const scanFrame = () => {
    if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
        const qrCanvasContext = qrCanvas.getContext('2d');
        if (qrCanvasContext) {
            qrCanvas.height = qrVideo.videoHeight;
            qrCanvas.width = qrVideo.videoWidth;
            qrCanvasContext.drawImage(qrVideo, 0, 0, qrCanvas.width, qrCanvas.height);
            const imageData = qrCanvasContext.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                stopScanner();
                handleScannedData(code.data);
                return; 
            }
        }
    }
    animationFrameId = requestAnimationFrame(scanFrame);
  };
  
  const startScanner = async () => {
    if (!qrScannerView || !qrVideo) return;
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      qrVideo.srcObject = videoStream;
      qrVideo.setAttribute("playsinline", "true"); 
      qrVideo.play();
      qrScannerView.classList.remove('hidden');
      animationFrameId = requestAnimationFrame(scanFrame);
    } catch (error) {
// Fix: Renamed catch variable from 'err' to 'error' to resolve "Cannot find name" issue and improve clarity.
      console.error("Error accessing camera: ", error);
      alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios en tu navegador.");
    }
  };

  // --- FORM VALIDATION ---
  const validateLoginForm = () => {
      if (!loginUsernameInput || !loginPasswordInput || !loginSubmitButton || !loginPasswordError) return;

      const isUsernameValid = loginUsernameInput.value.trim() !== '';
      const password = loginPasswordInput.value;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);

      if (password.length > 0 && (!hasLetter || !hasNumber)) {
          if (!hasLetter) {
              loginPasswordError.textContent = 'Debe incluir al menos una letra.';
          } else { // !hasNumber
              loginPasswordError.textContent = 'Debe incluir al menos un número.';
          }
      } else {
          loginPasswordError.textContent = ''; // Clear error message
      }

      loginSubmitButton.disabled = !(isUsernameValid && hasLetter && hasNumber);
  };
  
  const validateRegisterForm = () => {
    if (!regFullnameInput || !regUsernameInput || !regPasswordInput || !regPhoneInput || !regEmailInput || !registerSubmitButton || !regPasswordError) return;

    const areFieldsFilled = regFullnameInput.value.trim() !== '' &&
                           regUsernameInput.value.trim() !== '' &&
                           regPhoneInput.value.trim() !== '' &&
                           regEmailInput.value.trim() !== '';

    const password = regPasswordInput.value;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isPasswordValid = hasLetter && hasNumber;

    if (password.length > 0 && !isPasswordValid) {
        if (!hasLetter) {
            regPasswordError.textContent = 'Debe incluir al menos una letra.';
        } else {
            regPasswordError.textContent = 'Debe incluir al menos un número.';
        }
    } else {
        regPasswordError.textContent = '';
    }

    registerSubmitButton.disabled = !(areFieldsFilled && isPasswordValid);
  };

  loginUsernameInput?.addEventListener('input', validateLoginForm);
  loginPasswordInput?.addEventListener('input', validateLoginForm);

  [regFullnameInput, regUsernameInput, regPasswordInput, regPhoneInput, regEmailInput].forEach(input => {
      input?.addEventListener('input', validateRegisterForm);
  });

  // --- EVENT LISTENERS ---
  loginButton?.addEventListener('click', () => navigateTo(loginView));
  registerButton?.addEventListener('click', () => navigateTo(registerView));
  registerFromLoginButton?.addEventListener('click', () => navigateTo(registerView));
  loginFromRegisterButton?.addEventListener('click', () => navigateTo(loginView));
  backToMainButton?.addEventListener('click', () => navigateTo(mainView));
  backToMainFromRegisterButton?.addEventListener('click', () => navigateTo(mainView));
  logoutButton?.addEventListener('click', () => {
    currentUser = null;
    allUsers = [];
    allPets = [];
    resetAllForms();
    navigateTo(mainView);
  });
  editProfileButton?.addEventListener('click', () => {
    populateEditForm(currentUser);
    navigateTo(editProfileView);
  });
  cancelEditButton?.addEventListener('click', () => navigateTo(profileView));
  registerPetButton?.addEventListener('click', () => {
    if (registerPetForm) (registerPetForm as HTMLFormElement).reset();
    if(registerPetPicPreview) registerPetPicPreview.src = defaultPetPic;
    navigateTo(registerPetView);
  });
  cancelRegisterPetButton?.addEventListener('click', () => navigateTo(profileView));
  cancelEditPetButton?.addEventListener('click', () => navigateTo(profileView));
  
  publicationsButton?.addEventListener('click', async () => {
    currentPage = 1;
    currentFilter = 'all';
    searchInput.value = '';
    filterControls?.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.filter === 'all');
    });

    try {
        // Cargar todos los datos públicos desde la API
        const publicData = await apiCall('getPublicData', {});
        // Sanitize user data to ensure phone is always a string
        allUsers = publicData.users.map((u: User) => ({ ...u, phone: String(u.phone) }));
        allPets = publicData.pets;
        renderPublications('', currentPage);
    } catch (error) {
        alert(`No se pudo cargar la información de la comunidad: ${(error as Error).message}`);
        publicationsContainer.innerHTML = '<p>No se pudo cargar la información de la comunidad. Intenta de nuevo más tarde.</p>';
    } finally {
        navigateTo(publicationsView);
    }
  });
  
  backToProfileFromPublications?.addEventListener('click', () => navigateTo(profileView));

  // Picture preview handlers with image resizing
  const handleImageUpload = (input: HTMLInputElement, preview: HTMLImageElement, maxWidth: number, maxHeight: number) => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') return;

        const img = new Image();
        img.src = result;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                preview.src = result; // Fallback to original if canvas fails
                return;
            }

            let { width, height } = img;

            // Calculate aspect-ratio preserved dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Use JPEG for better compression of photos, with a quality setting.
            preview.src = canvas.toDataURL('image/jpeg', 0.85);
        };

        img.onerror = () => {
            console.error("Failed to load image for resizing.");
        };
    };
    
    reader.onerror = () => {
        console.error("Failed to read the file.");
    };

    reader.readAsDataURL(file);
  };
  
  const resetFileInputOnClick = (input: HTMLInputElement | null) => {
    if (!input) return;
    input.addEventListener('click', (e) => {
        // Reset the value to allow re-selecting the same file, triggering the 'change' event.
        (e.target as HTMLInputElement).value = '';
    });
  };

  resetFileInputOnClick(profilePicInput);
  resetFileInputOnClick(editProfilePicInput);
  resetFileInputOnClick(registerPetPicInput);
  resetFileInputOnClick(editPetPicInput);

  const USER_PIC_MAX_DIMENSION = 512;
  const PET_PIC_MAX_DIMENSION = 800;

  profilePicInput?.addEventListener('change', () => handleImageUpload(profilePicInput, profilePicPreview, USER_PIC_MAX_DIMENSION, USER_PIC_MAX_DIMENSION));
  editProfilePicInput?.addEventListener('change', () => handleImageUpload(editProfilePicInput, editProfilePicPreview, USER_PIC_MAX_DIMENSION, USER_PIC_MAX_DIMENSION));
  registerPetPicInput?.addEventListener('change', () => handleImageUpload(registerPetPicInput, registerPetPicPreview, PET_PIC_MAX_DIMENSION, PET_PIC_MAX_DIMENSION));
  editPetPicInput?.addEventListener('change', () => handleImageUpload(editPetPicInput, editPetPicPreview, PET_PIC_MAX_DIMENSION, PET_PIC_MAX_DIMENSION));

  // Handle registration form submission
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUserPayload = {
      id: Date.now(),
      fullname: regFullnameInput.value.trim(),
      username: regUsernameInput.value.trim().toLowerCase(),
      password: regPasswordInput.value.trim(),
      phone: regPhoneInput.value.trim(),
      email: regEmailInput.value.trim(),
      address: regAddressInput.value.trim(),
      profilePic: profilePicPreview.src
    };
    
    try {
        const registeredUser = await apiCall('register', newUserPayload);
        await apiCall('logEvent', {
            type: 'USER_REGISTRATION',
            timestamp: new Date().toISOString(),
            details: `User '${registeredUser.username}' (ID: ${registeredUser.id}) registered.`
        });
        // Sanitize the new user's phone number
        registeredUser.phone = String(registeredUser.phone);
        currentUser = { ...registeredUser, pets: [] };
        populateProfileCard(currentUser);
        resetAllForms();
        navigateTo(profileView);
    } catch (error) {
        alert(`Error en el registro: ${(error as Error).message}`);
    }
  });

  // Handle login form submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (loginSubmitButton) {
      loginSubmitButton.textContent = 'Verificando...';
      loginSubmitButton.disabled = true;
    }
    if (loginError) loginError.classList.add('hidden');

    setTimeout(async () => {
        try {
          // Convert username to lowercase to prevent case-sensitivity issues on the backend.
          const credentials = {
            username: loginUsernameInput.value.trim().toLowerCase(),
            password: loginPasswordInput.value.trim(),
          };
          console.log(`Intentando iniciar sesión con el usuario: "${credentials.username}"`);

          const user = await apiCall('login', credentials);
          // Sanitize the logged-in user's phone number
          user.phone = String(user.phone);
          currentUser = user;
          
          try {
              // After successful login, fetch all public data to have the full app state.
              const publicData = await apiCall('getPublicData', {});
              // Sanitize user data to ensure phone is always a string
              allUsers = publicData.users.map((u: User) => ({ ...u, phone: String(u.phone) }));
              allPets = publicData.pets;
          } catch (dataError) {
              alert('Inicio de sesión correcto, pero no se pudo cargar la información de la comunidad.');
              allUsers = [currentUser]; // At least add the current user to the list
              allPets = [];
          }

          populateProfileCard(currentUser);
          navigateTo(profileView);
          (loginForm as HTMLFormElement).reset();

        } catch (error) {
            const apiErrorMessage = (error as Error).message || 'Usuario o contraseña incorrectos.';
            console.error('Login attempt failed:', error); 

            if (loginError) {
                let displayMessage = `Error: ${apiErrorMessage}`;
                if (apiErrorMessage.includes('Usuario o contraseña incorrectos')) {
                    displayMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus datos. Nota: El nombre de usuario no distingue mayúsculas de minúsculas.';
                }
                loginError.textContent = displayMessage;
                loginError.classList.remove('hidden');
            } else {
                alert(`Error: ${apiErrorMessage}`);
            }
            loginPasswordInput.value = '';
        } finally {
            if (loginSubmitButton) {
              loginSubmitButton.textContent = 'Ingresar';
              validateLoginForm();
            }
        }
    }, 2000); // 2-second delay
  });

  // Handle Edit Profile form submission
  editProfileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    // This object contains the data that will be used to update the local state.
    const updatedLocalData = {
        fullname: editFullnameInput.value,
        username: editUsernameInput.value.trim().toLowerCase(),
        phone: editPhoneInput.value,
        email: editEmailInput.value,
        address: editAddressInput.value,
        profilePic: editProfilePicPreview.src,
    };
    
    // This object is what we send to the backend. It includes the ID and optional new password.
    const apiPayload = {
        id: currentUser.id,
        ...updatedLocalData,
        password: editPasswordInput.value.trim() || undefined
    };

    try {
        // Send the update to the server. We don't need to use the return value
        // because we are performing an optimistic UI update.
        await apiCall('saveUserData', apiPayload);
        
        // --- 1. Update the main currentUser state object ---
        currentUser = { ...currentUser, ...updatedLocalData };
        
        // --- 2. Update the user's record in the allUsers array for consistency ---
        const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            // We merge with the existing user object in the array to preserve any other properties
            allUsers[userIndex] = { ...allUsers[userIndex], ...updatedLocalData };
        }

        // --- 3. Refresh the UI with the new data and navigate back ---
        populateProfileCard(currentUser);
        navigateTo(profileView);

    } catch (error) {
        alert(`Hubo un error al guardar los cambios: ${(error as Error).message}`);
    }
  });

  // --- PET MANAGEMENT EVENTS ---
  registerPetForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const petName = registerPetNameInput.value;
    const qrData = `Nombre: ${petName}\nDueño/a: ${currentUser.fullname}\nContacto: ${currentUser.phone}`;

    const newPetPayload = {
      id: Date.now(),
      ownerId: currentUser.id,
      name: petName,
      breed: registerPetBreedInput.value,
      age: registerPetAgeInput.value,
      photo: registerPetPicPreview.src,
      status: registerPetStatusInput.value,
      description: registerPetDescriptionInput.value,
      isPublished: false,
      publicationDate: null,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`,
    };

    try {
        const addedPet = await apiCall('addPet', newPetPayload);
        allPets.push({ ...addedPet, comments: [] }); // Añadir al estado local
        await apiCall('logEvent', {
            type: 'PET_REGISTRATION',
            timestamp: new Date().toISOString(),
            details: `Pet '${addedPet.name}' (ID: ${addedPet.id}) was registered by user '${currentUser.username}' (ID: ${currentUser.id}).`
        });
        renderPets();
        navigateTo(profileView);
    } catch (error) {
        alert(`Error al registrar la mascota: ${(error as Error).message}`);
    }
  });

  editPetForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const petId = parseInt(editPetIdInput.value, 10);
    const petIndex = allPets.findIndex((p: Pet) => p.id === petId);

    if (petIndex > -1) {
      const oldPet = allPets[petIndex];
      const newStatus = editPetStatusInput.value;
      const newName = editPetNameInput.value;
      const isNoLongerPublishable = !['Perdido', 'En adopción', 'Encontrado', 'Adoptado'].includes(newStatus);
      
      let newQrCode = oldPet.qrCode;
      if (oldPet.name !== newName) {
        const qrData = `Nombre: ${newName}\nDueño/a: ${currentUser.fullname}\nContacto: ${currentUser.phone}`;
        newQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      }

      const updatedPetPayload = {
        ...oldPet,
        name: newName,
        breed: editPetBreedInput.value,
        age: editPetAgeInput.value,
        photo: editPetPicPreview.src,
        status: newStatus,
        description: editPetDescriptionInput.value,
        isPublished: isNoLongerPublishable ? false : oldPet.isPublished,
        publicationDate: isNoLongerPublishable ? null : oldPet.publicationDate,
        qrCode: newQrCode,
      };
      
      try {
        const updatedPet = await apiCall('updatePet', updatedPetPayload);
        allPets[petIndex] = { ...allPets[petIndex], ...updatedPet };
        renderPets();
        navigateTo(profileView);
      } catch (error) {
        alert(`Error al actualizar la mascota: ${(error as Error).message}`);
      }
    }
  });

  petsListContainer?.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const editButton = target.closest('.edit-pet-btn');
    const publishButton = target.closest('.publish-pet-btn');
    const deleteButton = target.closest('.delete-pet-btn');
    const qrButton = target.closest('.qr-pet-btn');
    const petCard = target.closest('.pet-card') as HTMLElement;

    if (!petCard || !currentUser) return;
    const petId = parseInt(petCard.dataset.petId || '0', 10);
    const pet = allPets.find((p: Pet) => p.id === petId);

    if (editButton && pet) {
      editPetIdInput.value = pet.id.toString();
      editPetPicPreview.src = pet.photo;
      editPetNameInput.value = pet.name;
      editPetBreedInput.value = pet.breed;
      editPetAgeInput.value = pet.age;
      editPetStatusInput.value = pet.status;
      editPetDescriptionInput.value = pet.description;
      if (editPetOwnerName) editPetOwnerName.textContent = currentUser.fullname;
      if (editPetOwnerPhone) editPetOwnerPhone.textContent = currentUser.phone;
      navigateTo(editPetView);
    }

    if (publishButton && pet) {
      const updatedPetPayload = { ...pet, isPublished: true, publicationDate: Date.now() };
      try {
        const updatedPet = await apiCall('updatePet', updatedPetPayload);
        pet.isPublished = true;
        pet.publicationDate = updatedPet.publicationDate;
        renderPets();
      } catch (error) {
          alert(`Error al publicar la mascota: ${(error as Error).message}`);
      }
    }
    
    if (deleteButton && pet) {
      if (deleteConfirmModal) {
        deleteConfirmModal.dataset.petId = pet.id.toString();
        deleteConfirmModal.dataset.ownerId = currentUser.id.toString();
        deleteConfirmModal.classList.remove('hidden');
      }
    }

    if (qrButton && pet && pet.qrCode) {
      if (qrModalTitle) qrModalTitle.textContent = `Código QR de ${pet.name}`;
      if (qrModalImage) qrModalImage.src = pet.qrCode;
      if (qrDownloadBtn) {
          qrDownloadBtn.href = pet.qrCode;
          qrDownloadBtn.download = `QR_${pet.name.replace(/\s+/g, '_')}.png`;
      }
      qrCodeModal?.classList.remove('hidden');
    }
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    renderPublications(searchInput.value, currentPage);
  });

  filterControls?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('.filter-btn')) {
      currentFilter = target.dataset.filter || 'all';
      currentPage = 1;
      filterControls.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');
      renderPublications(searchInput.value, currentPage);
    }
  });

  publicationsContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const deleteButton = target.closest('.delete-pet-btn');
    
    if (deleteButton) {
      const card = deleteButton.closest('.publication-card') as HTMLElement;
      if (!card) return;

      const petId = card.dataset.petId;
      const ownerId = card.dataset.ownerId;
      
      if (petId && ownerId && currentUser && currentUser.id === parseInt(ownerId, 10)) {
        if (deleteConfirmModal) {
            deleteConfirmModal.dataset.petId = petId;
            deleteConfirmModal.dataset.ownerId = ownerId;
            deleteConfirmModal.classList.remove('hidden');
        }
      }
    } else {
        const ownerInfo = target.closest('.owner-info');
        if (ownerInfo) {
            const card = ownerInfo.closest('.publication-card') as HTMLElement;
            if (!card) return;

            const ownerId = parseInt(card.dataset.ownerId || '0', 10);
            const owner = allUsers.find(u => u.id === ownerId);

            if (owner) {
                if (userProfileModalPic) userProfileModalPic.src = owner.profilePic;
                if (userProfileModalName) userProfileModalName.textContent = owner.fullname;
                if (userProfileModalUsername) userProfileModalUsername.textContent = `@${owner.username}`;
                if (userProfileModalPhone) userProfileModalPhone.textContent = owner.phone;
                if (userProfileModalEmail) userProfileModalEmail.textContent = owner.email;
                if (userProfileModalAddress) userProfileModalAddress.textContent = owner.address || 'No especificada';
                if (userProfileModalCallBtn) userProfileModalCallBtn.href = `tel:${String(owner.phone).replace(/\s+/g, '')}`;
                
                userProfileModal?.classList.remove('hidden');
            }
        }
    }
  });

  publicationsContainer?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      if (!form.classList.contains('comment-form')) return;
      
      const card = form.closest('.publication-card') as HTMLElement;
      const petId = parseInt(card.dataset.petId || '0', 10);
      const commentInput = form.querySelector('input[name="commentText"]') as HTMLInputElement;
      const text = commentInput.value.trim();

      if (text && petId && currentUser) {
          const newCommentPayload: Omit<PetComment, 'id'> = {
              petId: petId,
              userId: currentUser.id,
              username: currentUser.username,
              userProfilePic: currentUser.profilePic,
              text: text,
              timestamp: Date.now()
          };
          
          try {
            const addedComment = await apiCall('addComment', newCommentPayload);
            const pet = allPets.find(p => p.id === petId);
            if (pet) {
                pet.comments.push(addedComment);
            }
            await apiCall('logEvent', {
                type: 'COMMENT_POSTED',
                timestamp: new Date().toISOString(),
                details: `User '${currentUser.username}' (ID: ${currentUser.id}) commented on pet (ID: ${petId}).`
            });
            
            // Re-render to show the new comment immediately
            renderPublications(searchInput.value, currentPage);
          } catch (error) {
              alert(`Error al enviar el comentario: ${(error as Error).message}`);
          }
      }
  });

  paginationControls?.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (target.id === 'prev-page-btn' && currentPage > 1) {
        currentPage--;
        renderPublications(searchInput.value, currentPage);
    } else if (target.id === 'next-page-btn') {
        currentPage++;
        renderPublications(searchInput.value, currentPage);
    }
  });

  // --- MODAL AND SCANNER EVENTS ---
  scanQrButton?.addEventListener('click', startScanner);
  cancelScanBtn?.addEventListener('click', stopScanner);

  qrModalCloseBtn?.addEventListener('click', () => {
    qrCodeModal?.classList.add('hidden');
  });

  qrCodeModal?.addEventListener('click', (e) => {
    if (e.target === qrCodeModal) {
      qrCodeModal.classList.add('hidden');
    }
  });
  
  scannedInfoCloseBtn?.addEventListener('click', () => {
    scannedInfoModal?.classList.add('hidden');
  });

  scannedInfoModal?.addEventListener('click', (e) => {
    if (e.target === scannedInfoModal) {
        scannedInfoModal.classList.add('hidden');
    }
  });

  const closeUserProfileModal = () => {
    userProfileModal?.classList.add('hidden');
  };
  userProfileModalCloseBtn?.addEventListener('click', closeUserProfileModal);
  userProfileModal?.addEventListener('click', (e) => {
      if (e.target === userProfileModal) {
          closeUserProfileModal();
      }
  });

  // --- CONFIRMATION MODAL EVENTS ---
  confirmDeleteBtn?.addEventListener('click', async () => {
      if (deleteConfirmModal) {
          const petId = parseInt(deleteConfirmModal.dataset.petId || '0', 10);
          const ownerId = parseInt(deleteConfirmModal.dataset.ownerId || '0', 10);

          if (petId && ownerId) {
              await deletePet(petId, ownerId);
          }
          
          deleteConfirmModal.classList.add('hidden');
          delete deleteConfirmModal.dataset.petId;
          delete deleteConfirmModal.dataset.ownerId;
      }
  });

  const closeDeleteModal = () => {
      if (deleteConfirmModal) {
          deleteConfirmModal.classList.add('hidden');
          delete deleteConfirmModal.dataset.petId;
          delete deleteConfirmModal.dataset.ownerId;
      }
  };

  cancelDeleteBtn?.addEventListener('click', closeDeleteModal);
  deleteConfirmModal?.addEventListener('click', (e) => {
      if (e.target === deleteConfirmModal) {
          closeDeleteModal();
      }
  });

  // --- INITIALIZATION ---
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none'; 
        navigateTo(mainView);
      }, { once: true });
    }, 2000);
  } else {
    navigateTo(mainView);
  }
});