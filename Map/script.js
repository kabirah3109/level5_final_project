 // Contact storage
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        let editingContact = null;
        
        // DOM elements
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const addBtn = document.getElementById('addBtn');
        const updateBtn = document.getElementById('updateBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const searchInput = document.getElementById('search');
        const searchBtn = document.querySelector('.search-btn');
        const contactsContainer = document.getElementById('contactsContainer');
        const contactsCount = document.getElementById('contactsCount');
        const emptyState = document.getElementById('emptyState');
        const notification = document.getElementById('notification');
        
        // Initialize the app
        function initApp() {
            renderContacts();
            updateContactsCount();
            
            // Event listeners
            addBtn.addEventListener('click', addContact);
            updateBtn.addEventListener('click', updateContact);
            cancelBtn.addEventListener('click', cancelEdit);
            searchInput.addEventListener('input', filterContacts);
            searchBtn.addEventListener('click', handleSearch);
            
            // Prevent non-numeric characters in phone input (use keydown + allow control keys)
            phoneInput.addEventListener('keydown', function(e) {
                const key = e.key;
                // Allow control/navigation keys
                const controlKeys = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete','Home','End'];
                if (controlKeys.includes(key)) return;
                // Allow only numbers and + (single + at start)
                if (!/^[0-9+]$/.test(key)) {
                    e.preventDefault();
                    return;
                }
                if (key === '+' && this.value.length > 0) {
                    e.preventDefault();
                }
            });
            
            // Remove non-numeric characters on paste
            phoneInput.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const cleaned = pastedText.replace(/[^0-9+]/g, '');
                // Ensure + only at the start
                const final = cleaned.charAt(0) === '+' ? '+' + cleaned.slice(1).replace(/\+/g, '') : cleaned.replace(/\+/g, '');
                this.value = final;
            });
            
            // Remove non-numeric characters on input (for autocomplete, drag-drop, etc.)
            phoneInput.addEventListener('input', function(e) {
                const cursorPos = this.selectionStart;
                const oldLength = this.value.length;
                let cleaned = this.value.replace(/[^0-9+]/g, '');
                // Ensure + only at the start
                cleaned = cleaned.charAt(0) === '+' ? '+' + cleaned.slice(1).replace(/\+/g, '') : cleaned.replace(/\+/g, '');
                this.value = cleaned;
                // Restore cursor position
                const newLength = this.value.length;
                const diff = newLength - oldLength;
                this.setSelectionRange(cursorPos + diff, cursorPos + diff);
            });
        }
        
        // Show notification
        function showNotification(message, type = 'success') {
            notification.textContent = message;
            notification.className = 'notification';
            if (type !== 'success') {
                notification.classList.add(type);
            }
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Add a new contact
        function addContact() {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            
            if (!name || !phone) {
                showNotification('Please fill in both name and phone number', 'error');
                return;
            }
            
            // Validate phone number format
            const phoneRegex = /^[+]?[0-9]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Please enter a valid phone number (10-15 digits, optional + prefix)', 'error');
                return;
            }
            
            // Check if contact already exists (case-insensitive)
            if (contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
                showNotification('Contact with this name already exists!', 'warning');
                return;
            }
            
            const newContact = { name, phone };
            contacts.push(newContact);
            saveContacts();
            
            // Clear form
            nameInput.value = '';
            phoneInput.value = '';
            
            showNotification(`Contact "${name}" added successfully!`);
            renderContacts();
            updateContactsCount();
        }
        
        // Update an existing contact
        function updateContact() {
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            
            if (!name || !phone) {
                showNotification('Please fill in both name and phone number', 'error');
                return;
            }
            
            // Validate phone number format
            const phoneRegex = /^[+]?[0-9]{10,15}$/;
            if (!phoneRegex.test(phone)) {
                showNotification('Please enter a valid phone number (10-15 digits, optional + prefix)', 'error');
                return;
            }
            
            // Check if name is changed to an existing contact (case-insensitive)
            if (name.toLowerCase() !== editingContact.name.toLowerCase() && contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
                showNotification('Contact with this name already exists!', 'warning');
                return;
            }
            
            // Update contact
            const index = contacts.findIndex(contact => contact.name === editingContact.name);
            contacts[index] = { name, phone };
            saveContacts();
            
            // Reset form
            nameInput.value = '';
            phoneInput.value = '';
            editingContact = null;
            addBtn.style.display = 'block';
            updateBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            
            showNotification(`Contact "${name}" updated successfully!`);
            renderContacts();
        }
        
        // Edit contact
        function editContact(contact) {
            editingContact = contact;
            nameInput.value = contact.name;
            phoneInput.value = contact.phone;
            
            addBtn.style.display = 'none';
            updateBtn.style.display = 'block';
            cancelBtn.style.display = 'block';
            
            // Scroll to top
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Cancel editing
        function cancelEdit() {
            editingContact = null;
            nameInput.value = '';
            phoneInput.value = '';
            addBtn.style.display = 'block';
            updateBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        }
        
        // Delete contact
        function deleteContact(name) {
            if (confirm(`Are you sure you want to delete contact "${name}"?`)) {
                contacts = contacts.filter(contact => contact.name !== name);
                saveContacts();
                showNotification(`Contact "${name}" deleted successfully!`);
                renderContacts();
                updateContactsCount();
            }
        }
        
        // Save contacts to localStorage
        function saveContacts() {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }
        
        // Render contacts list
        function renderContacts(filteredContacts = contacts, isSearching = false) {
            if (filteredContacts.length === 0) {
                if (isSearching && contacts.length > 0) {
                    // Show "not found" message when searching
                    emptyState.style.display = 'none';
                    contactsContainer.innerHTML = `
                        <div class="empty-state" style="display: flex;">
                            <i class="fas fa-search"></i>
                            <h3>No Results Found</h3>
                            <p>"${searchInput.value}" is not there</p>
                        </div>
                    `;
                } else {
                    emptyState.style.display = 'flex';
                    contactsContainer.innerHTML = '';
                }
                return;
            }
            
            emptyState.style.display = 'none';
            contactsContainer.innerHTML = '';
            
            filteredContacts.forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.innerHTML = `
                    <div class="contact-info">
                        <div class="contact-name">${contact.name}</div>
                        <div class="contact-phone">${contact.phone}</div>
                    </div>
                    <div class="contact-actions">
                        <button class="action-btn edit" title="Edit contact">Edit</button>
                        <button class="action-btn delete" title="Delete contact">Delete</button>
                    </div>
                `;
                
                // Add event listeners
                contactItem.querySelector('.edit').addEventListener('click', () => editContact(contact));
                contactItem.querySelector('.delete').addEventListener('click', () => deleteContact(contact.name));
                
                contactsContainer.appendChild(contactItem);
            });
        }
        
        // Filter contacts based on search input
        function filterContacts() {
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = contacts.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm) || 
                contact.phone.includes(searchTerm)
            );
            renderContacts(filtered, searchTerm.length > 0);
        }
        
            // Handle search button click
        function handleSearch() {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                showNotification('Please enter a name to search', 'error');
                return;
            }
            filterContacts();
        }
        
        // Update contacts count
        function updateContactsCount() {
            contactsCount.textContent = `${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'}`;
        }
        
        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', initApp);
    