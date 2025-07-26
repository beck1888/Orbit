// Main Application Logic
class AssignmentTracker {
    constructor() {
        this.db = new AssignmentDatabase();
        this.currentClassId = null;
        this.currentClassName = '';
        this.init();
    }

    async init() {
        try {
            await this.db.init();
            this.setupEventListeners();
            await this.loadClasses();
            console.log('Assignment Tracker initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Assignment Tracker:', error);
        }
    }

    setupEventListeners() {
        // Add class button and modal
        const addClassBtn = document.getElementById('add-class-btn');
        const addClassModal = document.getElementById('add-class-modal');
        const addClassForm = document.getElementById('add-class-form');
        const classCloseBtn = addClassModal.querySelector('.close');

        addClassBtn.addEventListener('click', () => {
            addClassModal.style.display = 'block';
            document.getElementById('class-name').focus();
        });

        classCloseBtn.addEventListener('click', () => {
            addClassModal.style.display = 'none';
        });

        addClassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddClass();
        });

        // Add assignment button and modal
        const addAssignmentBtn = document.getElementById('add-assignment-btn');
        const addAssignmentModal = document.getElementById('add-assignment-modal');
        const addAssignmentForm = document.getElementById('add-assignment-form');
        const assignmentCloseBtn = addAssignmentModal.querySelector('.close');

        addAssignmentBtn.addEventListener('click', () => {
            addAssignmentModal.style.display = 'block';
            document.getElementById('assignment-title').focus();
        });

        assignmentCloseBtn.addEventListener('click', () => {
            addAssignmentModal.style.display = 'none';
        });

        addAssignmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAssignment();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === addClassModal) {
                addClassModal.style.display = 'none';
            }
            if (e.target === addAssignmentModal) {
                addAssignmentModal.style.display = 'none';
            }
        });

        // Set default date to today
        const dateInput = document.getElementById('assignment-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    async loadClasses() {
        try {
            const classes = await this.db.getAllClasses();
            this.renderClasses(classes);
        } catch (error) {
            console.error('Failed to load classes:', error);
        }
    }

    renderClasses(classes) {
        const classList = document.getElementById('class-list');
        classList.innerHTML = '';

        if (classes.length === 0) {
            classList.innerHTML = '<div class="no-classes" style="padding: 20px; text-align: center; color: #86868b;">No classes yet. Add your first class!</div>';
            return;
        }

        classes.forEach(classItem => {
            const classElement = document.createElement('div');
            classElement.className = 'class-item';
            classElement.innerHTML = `
                <span class="class-name">${this.escapeHtml(classItem.name)}</span>
                <button class="delete-class-btn" data-class-id="${classItem.id}" title="Delete class">×</button>
            `;

            classElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-class-btn')) {
                    this.handleDeleteClass(classItem.id, classItem.name);
                } else {
                    this.selectClass(classItem.id, classItem.name);
                }
            });

            classList.appendChild(classElement);
        });
    }

    async handleAddClass() {
        const classNameInput = document.getElementById('class-name');
        const className = classNameInput.value.trim();

        if (!className) {
            alert('Please enter a class name');
            return;
        }

        try {
            await this.db.addClass(className);
            classNameInput.value = '';
            document.getElementById('add-class-modal').style.display = 'none';
            await this.loadClasses();
        } catch (error) {
            if (error.name === 'ConstraintError') {
                alert('A class with this name already exists');
            } else {
                console.error('Failed to add class:', error);
                alert('Failed to add class. Please try again.');
            }
        }
    }

    async handleDeleteClass(classId, className) {
        if (confirm(`Are you sure you want to delete "${className}" and all its assignments?`)) {
            try {
                await this.db.deleteClass(classId);
                if (this.currentClassId === classId) {
                    this.currentClassId = null;
                    this.currentClassName = '';
                    this.renderWelcomeMessage();
                }
                await this.loadClasses();
            } catch (error) {
                console.error('Failed to delete class:', error);
                alert('Failed to delete class. Please try again.');
            }
        }
    }

    async selectClass(classId, className) {
        // Update active class styling
        document.querySelectorAll('.class-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        this.currentClassId = classId;
        this.currentClassName = className;

        // Update header
        document.getElementById('current-class').textContent = className;
        document.getElementById('add-assignment-btn').style.display = 'block';

        // Load assignments for this class
        await this.loadAssignments();
    }

    async loadAssignments() {
        if (!this.currentClassId) return;

        try {
            const assignments = await this.db.getAssignmentsByClass(this.currentClassId);
            this.renderAssignments(assignments);
        } catch (error) {
            console.error('Failed to load assignments:', error);
        }
    }

    renderAssignments(assignments) {
        const container = document.getElementById('assignments-container');
        
        if (assignments.length === 0) {
            container.innerHTML = `
                <div class="no-assignments">
                    <p>No assignments yet for ${this.escapeHtml(this.currentClassName)}</p>
                    <p>Click "Add Assignment" to create your first assignment!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = assignments.map(assignment => this.createAssignmentCard(assignment)).join('');

        // Add event listeners for checkboxes and delete buttons
        container.querySelectorAll('.assignment-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const assignmentId = parseInt(e.target.dataset.assignmentId);
                this.toggleAssignmentCompletion(assignmentId, e.target.checked);
            });
        });

        container.querySelectorAll('.delete-assignment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assignmentId = parseInt(e.target.dataset.assignmentId);
                this.handleDeleteAssignment(assignmentId);
            });
        });
    }

    createAssignmentCard(assignment) {
        const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
        const now = new Date();
        let dueDateClass = '';
        let dueDateText = 'No due date';

        if (dueDate) {
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (timeDiff < 0) {
                dueDateClass = 'overdue';
                dueDateText = `Overdue (${this.formatDate(dueDate)})`;
            } else if (daysDiff <= 1) {
                dueDateClass = 'due-soon';
                dueDateText = `Due ${this.formatDate(dueDate)}`;
            } else {
                dueDateText = `Due ${this.formatDate(dueDate)}`;
            }
        }

        return `
            <div class="assignment-card ${assignment.completed ? 'completed' : ''}">
                <div class="assignment-header">
                    <div class="checkbox-container">
                        <input type="checkbox" class="assignment-checkbox" 
                               data-assignment-id="${assignment.id}" 
                               ${assignment.completed ? 'checked' : ''}>
                        <label class="assignment-title ${assignment.completed ? 'assignment-completed' : ''}">
                            ${this.escapeHtml(assignment.title)}
                        </label>
                    </div>
                    <button class="delete-assignment-btn delete-btn" 
                            data-assignment-id="${assignment.id}">Delete</button>
                </div>
                ${assignment.description ? `<div class="assignment-description">${this.escapeHtml(assignment.description)}</div>` : ''}
                <div class="assignment-due ${dueDateClass}">${dueDateText}</div>
            </div>
        `;
    }

    async handleAddAssignment() {
        const title = document.getElementById('assignment-title').value.trim();
        const description = document.getElementById('assignment-description').value.trim();
        const date = document.getElementById('assignment-date').value;
        const time = document.getElementById('assignment-time').value;

        if (!title) {
            alert('Please enter an assignment title');
            return;
        }

        let dueDate = null;
        if (date) {
            dueDate = time ? `${date}T${time}` : `${date}T23:59`;
        }

        const assignmentData = {
            classId: this.currentClassId,
            title,
            description: description || null,
            dueDate
        };

        try {
            await this.db.addAssignment(assignmentData);
            
            // Clear form
            document.getElementById('assignment-title').value = '';
            document.getElementById('assignment-description').value = '';
            document.getElementById('assignment-time').value = '';
            
            // Close modal
            document.getElementById('add-assignment-modal').style.display = 'none';
            
            // Reload assignments
            await this.loadAssignments();
        } catch (error) {
            console.error('Failed to add assignment:', error);
            alert('Failed to add assignment. Please try again.');
        }
    }

    async toggleAssignmentCompletion(assignmentId, completed) {
        try {
            await this.db.updateAssignment(assignmentId, { completed });
            await this.loadAssignments();
        } catch (error) {
            console.error('Failed to update assignment:', error);
        }
    }

    async handleDeleteAssignment(assignmentId) {
        if (confirm('Are you sure you want to delete this assignment?')) {
            try {
                await this.db.deleteAssignment(assignmentId);
                await this.loadAssignments();
            } catch (error) {
                console.error('Failed to delete assignment:', error);
                alert('Failed to delete assignment. Please try again.');
            }
        }
    }

    renderWelcomeMessage() {
        const container = document.getElementById('assignments-container');
        container.innerHTML = `
            <div class="welcome-message">
                <p>Select a class from the sidebar to view assignments, or add a new class to get started.</p>
            </div>
        `;
        document.getElementById('current-class').textContent = 'Select a class to view assignments';
        document.getElementById('add-assignment-btn').style.display = 'none';
    }

    formatDate(date) {
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AssignmentTracker();
});
