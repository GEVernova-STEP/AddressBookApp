// API URL
const API_URL = 'http://localhost:3000/persons';

// Global variables
let contacts = [];
let editingId = null;

// DOM Elements
const modal = document.getElementById('modal');
const deleteModal = document.getElementById('deleteModal');
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const addBtn = document.getElementById('addBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const resetBtn = document.getElementById('resetBtn');
const noContacts = document.getElementById('noContacts');
const totalCount = document.getElementById('totalCount');
const displayCount = document.getElementById('displayCount');

// Initialize app
function init() {
    loadContacts();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', deleteContact);
    contactForm.addEventListener('submit', saveContact);
    searchInput.addEventListener('input', filterContacts);
    sortSelect.addEventListener('change', filterContacts);
    resetBtn.addEventListener('click', resetFilters);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// Load contacts from server
async function loadContacts() {
    try {
        const response = await fetch(API_URL);
        contacts = await response.json();
        filterContacts();
    } catch (error) {
        showToast('Error loading contacts!', 'error');
        console.error(error);
    }
}

// Display contacts
function displayContacts(contactsToShow) {
    // Update counts
    totalCount.textContent = contacts.length;
    displayCount.textContent = contactsToShow.length;
    
    // Show/hide no contacts message
    if (contactsToShow.length === 0) {
        contactsList.innerHTML = '';
        noContacts.style.display = 'block';
        return;
    }
    
    noContacts.style.display = 'none';
    
    // Create contact cards
    contactsList.innerHTML = contactsToShow.map(contact => `
        <div class="contact-card">
            <div class="contact-header">
                <div class="contact-avatar">${getInitials(contact.firstName, contact.lastName)}</div>
                <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
            </div>
            <div class="contact-body">
                <div class="contact-info">
                    <label>Email</label>
                    <span>${contact.email}</span>
                </div>
                <div class="contact-info">
                    <label>Phone</label>
                    <span>${contact.phone}</span>
                </div>
                ${contact.address ? `
                    <div class="contact-info">
                        <label>Address</label>
                        <span>${contact.address}</span>
                    </div>
                ` : ''}
                ${contact.city ? `
                    <div class="contact-info">
                        <label>City</label>
                        <span>${contact.city}</span>
                    </div>
                ` : ''}
            </div>
            <div class="contact-actions">
                <button class="btn" onclick="openEditModal('${contact.id}')">Edit</button>
                <button class="btn btn-danger" onclick="openDeleteModal('${contact.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Get initials from name
function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

// Filter and sort contacts
function filterContacts() {
    let filtered = [...contacts];
    
    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(contact => 
            contact.firstName.toLowerCase().includes(searchTerm) ||
            contact.lastName.toLowerCase().includes(searchTerm) ||
            contact.email.toLowerCase().includes(searchTerm) ||
            contact.phone.includes(searchTerm)
        );
    }
    
    // Sort
    const sortBy = sortSelect.value;
    if (sortBy) {
        filtered.sort((a, b) => {
            const aVal = a[sortBy].toLowerCase();
            const bVal = b[sortBy].toLowerCase();
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        });
    }
    
    displayContacts(filtered);
}

// Reset filters
function resetFilters() {
    searchInput.value = '';
    sortSelect.value = '';
    filterContacts();
}

// Open add modal
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Contact';
    contactForm.reset();
    clearErrors();
    modal.classList.add('show');
}

// Open edit modal
function openEditModal(id) {
    editingId = id;
    const contact = contacts.find(c => c.id === id);
    
    if (!contact) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Contact';
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('email').value = contact.email;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('address').value = contact.address || '';
    document.getElementById('city').value = contact.city || '';
    
    clearErrors();
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
    contactForm.reset();
    clearErrors();
}

// Open delete modal
function openDeleteModal(id) {
    editingId = id;
    const contact = contacts.find(c => c.id === id);
    
    if (!contact) return;
    
    document.getElementById('deleteName').textContent = `${contact.firstName} ${contact.lastName}`;
    deleteModal.classList.add('show');
}

// Close delete modal
function closeDeleteModal() {
    deleteModal.classList.remove('show');
}

// Save contact (add or edit)
async function saveContact(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim()
    };
    
    // Validate
    if (!validateForm(formData)) {
        return;
    }
    
    // Check for duplicate email
    const isDuplicate = contacts.some(c => 
        c.email.toLowerCase() === formData.email.toLowerCase() && 
        c.id !== editingId
    );
    
    if (isDuplicate) {
        showError('email', 'This email already exists!');
        return;
    }
    
    try {
        if (editingId) {
            // Update existing contact
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id: editingId })
            });
            showToast('Contact updated successfully!', 'success');
        } else {
            // Add new contact
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            showToast('Contact added successfully!', 'success');
        }
        
        closeModal();
        loadContacts();
    } catch (error) {
        showToast('Error saving contact!', 'error');
        console.error(error);
    }
}

// Delete contact
async function deleteContact() {
    if (!editingId) return;
    
    try {
        await fetch(`${API_URL}/${editingId}`, {
            method: 'DELETE'
        });
        
        showToast('Contact deleted successfully!', 'success');
        closeDeleteModal();
        loadContacts();
    } catch (error) {
        showToast('Error deleting contact!', 'error');
        console.error(error);
    }
}

// Validate form
function validateForm(data) {
    clearErrors();
    let isValid = true;
    
    // First name
    if (!data.firstName || data.firstName.length < 2) {
        showError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    // Last name
    if (!data.lastName || data.lastName.length < 2) {
        showError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    // Phone
    if (!data.phone || data.phone.length < 10) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

// Show error
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    input.classList.add('invalid');
    error.textContent = message;
}

// Clear errors
function clearErrors() {
    const inputs = contactForm.querySelectorAll('input');
    const errors = contactForm.querySelectorAll('.error');
    
    inputs.forEach(input => input.classList.remove('invalid'));
    errors.forEach(error => error.textContent = '');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `show ${type}`;
    
    setTimeout(() => {
        toast.className = '';
    }, 3000);
}

// Start the app
init();
