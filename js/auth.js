// Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    // Register new user
    register(userData) {
        // Check if email already exists
        if (this.users.find(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }

        // Generate unique student ID
        const studentId = this.generateStudentId();
        
        const newUser = {
            id: Date.now(),
            studentId: studentId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            course: userData.course,
            password: userData.password, // In real app, this would be hashed
            profilePhoto: 'null',
            role: 'student',
            status: 'active',
            lastLogin: new Date().toISOString(),
            lastLogout: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            lastPasswordChange: new Date().toISOString(),
            lastProfileUpdate: new Date().toISOString(),
            lastLoginIP: 'null',
            lastLogoutIP: 'null',
            lastActivityIP: 'null',
            lastPasswordChangeIP: 'null',
            lastProfileUpdateIP: 'null',
            lastLoginDevice: 'null',
            lastLogoutDevice: 'null',
            lastActivityDevice: 'null',
            lastPasswordChangeDevice: 'null',
            lastProfileUpdateDevice: 'null',
            registeredAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
        
        return { success: true, studentId: studentId };
    }

    // Login user
    login(studentId, password) {
        const user = this.users.find(u => u.studentId === studentId && u.password === password);
        
        if (!user) {
            throw new Error('Invalid Student ID or Password');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        return { success: true, user: user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
    }

    // Update user profile
    updateProfile(updatedData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Update user data
        this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
        this.currentUser = this.users[userIndex];

        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        return { success: true };
    }

    // Generate unique student ID
    generateStudentId() {
        // Get the highest existing student ID number
        let maxId = 1100000; // Starting ID
        
        this.users.forEach(user => {
            if (user.studentId && user.studentId.startsWith('11')) {
                const idNum = parseInt(user.studentId);
                if (idNum > maxId) {
                    maxId = idNum;
                }
            }
        });
        
        // Generate next sequential ID
        const nextId = (maxId + 1).toString();
        
        // Ensure it's unique (double check)
        if (this.users.find(user => user.studentId === nextId)) {
            // Fallback to timestamp based ID
            return '11' + Date.now().toString().slice(-5);
        }
        
        return nextId;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.currentUser !== null && localStorage.getItem('isLoggedIn') === 'true';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth system
const auth = new AuthSystem();

// UI Helper functions
function showError(message, elementId = 'errorMessage') {
    const errorDiv = document.getElementById(elementId) || createErrorDiv(elementId);
    errorDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    setTimeout(() => errorDiv.innerHTML = '', 5000);
}

function showSuccess(message, elementId = 'successMessage') {
    const successDiv = document.getElementById(elementId) || createSuccessDiv(elementId);
    successDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
    setTimeout(() => successDiv.innerHTML = '', 5000);
}

function createErrorDiv(id) {
    const div = document.createElement('div');
    div.id = id;
    document.querySelector('form').prepend(div);
    return div;
}

function createSuccessDiv(id) {
    const div = document.createElement('div');
    div.id = id;
    document.querySelector('form').prepend(div);
    return div;
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
}

function validatePassword(password) {
    return password.length >= 6;
}

// Loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }
}

// Show Student ID Popup
function showStudentIdPopup(studentId) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('studentIdPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup overlay
    const popup = document.createElement('div');
    popup.id = 'studentIdPopup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <button class="popup-close" onclick="closeStudentIdPopup()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-body">
                    <i class="fas fa-graduation-cap fa-4x text-primary mb-3"></i>
                    <h2 class="text-success mb-3">Registration Successful!</h2>
                    <p class="mb-2">Your Student ID is:</p>
                    <div class="student-id-display">
                        ${studentId}
                    </div>
                    <p class="text-muted mt-3">Please save this Student ID for future login</p>
                    <div class="popup-buttons mt-4">
                        <button class="btn btn-primary" onclick="copyStudentId('${studentId}')">Copy ID</button>
                        <button class="btn btn-success" onclick="goToLogin()">Go to Login</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

// Close Student ID Popup
function closeStudentIdPopup() {
    const popup = document.getElementById('studentIdPopup');
    if (popup) {
        popup.remove();
    }
}

// Copy Student ID
function copyStudentId(studentId) {
    navigator.clipboard.writeText(studentId).then(() => {
        const copyBtn = document.querySelector('.popup-buttons .btn-primary');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('btn-success');
        copyBtn.classList.remove('btn-primary');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.add('btn-primary');
            copyBtn.classList.remove('btn-success');
        }, 2000);
    });
}

// Go to Login
function goToLogin() {
    closeStudentIdPopup();
    window.location.href = 'login.html';
}