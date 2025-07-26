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

        // Setup smart date and time formatting
        this.setupDateTimeFormatting();
    }

    setupDateTimeFormatting() {
        const dateInput = document.getElementById('assignment-date');
        const timeInput = document.getElementById('assignment-time');

        // Date formatting
        dateInput.addEventListener('blur', (e) => {
            this.formatDateInput(e.target);
        });

        dateInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter') {
                this.formatDateInput(e.target);
            }
        });

        // Time formatting
        timeInput.addEventListener('blur', (e) => {
            this.formatTimeInput(e.target);
        });

        timeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter') {
                this.formatTimeInput(e.target);
            }
        });
    }

    formatDateInput(input) {
        const value = input.value.trim();
        if (!value) return;

        const currentYear = new Date().getFullYear();
        let parsedDate = null;

        // Try various date formats
        const datePatterns = [
            // M/D, M/DD, MM/D, MM/DD
            /^(\d{1,2})\/(\d{1,2})$/,
            // M/D/YY, M/D/YYYY, MM/DD/YY, MM/DD/YYYY
            /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/,
            // Month DD, Month D
            /^([a-zA-Z]+)\s+(\d{1,2})$/,
            // Month DD, YYYY
            /^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/,
        ];

        // Pattern 1: M/D or MM/DD (assume current year)
        if (datePatterns[0].test(value)) {
            const [, month, day] = value.match(datePatterns[0]);
            parsedDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        }
        // Pattern 2: M/D/YY or M/D/YYYY
        else if (datePatterns[1].test(value)) {
            const [, month, day, year] = value.match(datePatterns[1]);
            let fullYear = parseInt(year);
            if (fullYear < 100) {
                fullYear += fullYear < 50 ? 2000 : 1900;
            }
            parsedDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
        }
        // Pattern 3: Month DD (assume current year)
        else if (datePatterns[2].test(value)) {
            const [, monthName, day] = value.match(datePatterns[2]);
            const monthIndex = this.getMonthIndex(monthName);
            if (monthIndex !== -1) {
                parsedDate = new Date(currentYear, monthIndex, parseInt(day));
            }
        }
        // Pattern 4: Month DD, YYYY
        else if (datePatterns[3].test(value)) {
            const [, monthName, day, year] = value.match(datePatterns[3]);
            const monthIndex = this.getMonthIndex(monthName);
            if (monthIndex !== -1) {
                parsedDate = new Date(parseInt(year), monthIndex, parseInt(day));
            }
        }

        if (parsedDate && !isNaN(parsedDate.getTime())) {
            // Format as "Month DDth, YYYY"
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            const formatted = parsedDate.toLocaleDateString('en-US', options);
            input.value = formatted;
            input.dataset.isoDate = parsedDate.toISOString().split('T')[0];
            
            // Show success feedback
            input.classList.remove('error');
            input.classList.add('success');
            setTimeout(() => {
                input.classList.remove('success');
            }, 2000);
        } else {
            // If parsing failed, show an error style briefly
            input.classList.remove('success');
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error');
            }, 2000);
        }
    }

    formatTimeInput(input) {
        const value = input.value.trim();
        if (!value) return;

        let parsedTime = null;
        const timePatterns = [
            // H:MM, HH:MM
            /^(\d{1,2}):(\d{2})$/,
            // H:MMam/pm, HH:MMam/pm, H:MM am/pm, HH:MM am/pm
            /^(\d{1,2}):(\d{2})\s*(am|pm)$/i,
            // Ham/pm, HHam/pm, H am/pm, HH am/pm
            /^(\d{1,2})\s*(am|pm)$/i,
            // Just numbers like 330, 1430 (military time)
            /^(\d{3,4})$/,
        ];

        // Pattern 1: H:MM or HH:MM (24-hour format)
        if (timePatterns[0].test(value)) {
            const [, hours, minutes] = value.match(timePatterns[0]);
            const h = parseInt(hours);
            const m = parseInt(minutes);
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                parsedTime = { hours: h, minutes: m };
            }
        }
        // Pattern 2: H:MM am/pm
        else if (timePatterns[1].test(value)) {
            const [, hours, minutes, period] = value.match(timePatterns[1]);
            let h = parseInt(hours);
            const m = parseInt(minutes);
            
            if (period.toLowerCase() === 'pm' && h !== 12) h += 12;
            if (period.toLowerCase() === 'am' && h === 12) h = 0;
            
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                parsedTime = { hours: h, minutes: m };
            }
        }
        // Pattern 3: H am/pm (assume :00 minutes)
        else if (timePatterns[2].test(value)) {
            const [, hours, period] = value.match(timePatterns[2]);
            let h = parseInt(hours);
            
            if (period.toLowerCase() === 'pm' && h !== 12) h += 12;
            if (period.toLowerCase() === 'am' && h === 12) h = 0;
            
            if (h >= 0 && h <= 23) {
                parsedTime = { hours: h, minutes: 0 };
            }
        }
        // Pattern 4: Military time like 1430, 330
        else if (timePatterns[3].test(value)) {
            const timeStr = value.padStart(4, '0');
            const h = parseInt(timeStr.substring(0, 2));
            const m = parseInt(timeStr.substring(2));
            
            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                parsedTime = { hours: h, minutes: m };
            }
        }

        if (parsedTime) {
            // Format as 12-hour time with am/pm
            const formatted = this.formatTime12Hour(parsedTime.hours, parsedTime.minutes);
            input.value = formatted;
            input.dataset.isoTime = `${parsedTime.hours.toString().padStart(2, '0')}:${parsedTime.minutes.toString().padStart(2, '0')}`;
            
            // Show success feedback
            input.classList.remove('error');
            input.classList.add('success');
            setTimeout(() => {
                input.classList.remove('success');
            }, 2000);
        } else {
            // If parsing failed, show an error style briefly
            input.classList.remove('success');
            input.classList.add('error');
            setTimeout(() => {
                input.classList.remove('error');
            }, 2000);
        }
    }

    getMonthIndex(monthName) {
        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        const shortMonths = [
            'jan', 'feb', 'mar', 'apr', 'may', 'jun',
            'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
        ];
        
        const lowerMonth = monthName.toLowerCase();
        let index = months.findIndex(month => month.startsWith(lowerMonth));
        if (index === -1) {
            index = shortMonths.findIndex(month => month.startsWith(lowerMonth));
        }
        return index;
    }

    formatTime12Hour(hours, minutes) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
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
        const dateInput = document.getElementById('assignment-date');
        const timeInput = document.getElementById('assignment-time');

        if (!title) {
            alert('Please enter an assignment title');
            return;
        }

        let dueDate = null;
        if (dateInput.value) {
            // Use the ISO date if it was parsed, otherwise try to parse the current value
            const isoDate = dateInput.dataset.isoDate;
            if (isoDate) {
                // If we have a time, use it; otherwise default to end of day
                if (timeInput.value && timeInput.dataset.isoTime) {
                    dueDate = `${isoDate}T${timeInput.dataset.isoTime}`;
                } else {
                    dueDate = `${isoDate}T23:59`;
                }
            } else {
                // Try to parse the date one more time
                this.formatDateInput(dateInput);
                const newIsoDate = dateInput.dataset.isoDate;
                if (newIsoDate) {
                    if (timeInput.value && timeInput.dataset.isoTime) {
                        dueDate = `${newIsoDate}T${timeInput.dataset.isoTime}`;
                    } else {
                        dueDate = `${newIsoDate}T23:59`;
                    }
                } else {
                    alert('Please enter a valid date format (e.g., 4/24 or April 24)');
                    return;
                }
            }
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
            dateInput.value = '';
            timeInput.value = '';
            delete dateInput.dataset.isoDate;
            delete timeInput.dataset.isoTime;
            
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
