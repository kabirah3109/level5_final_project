
        class TaskScheduler {
            constructor() {
                this.queue = [];
                this.completed = [];
                this.init();
            }

            init() {
                this.titleInput = document.getElementById('title');
                this.typeSelect = document.getElementById('type');
                this.descInput = document.getElementById('desc');
                this.addBtn = document.getElementById('addBtn');
                this.clearBtn = document.getElementById('clearBtn');
                this.markDoneBtn = document.getElementById('markDoneBtn');
                this.taskQueueContainer = document.getElementById('taskQueueContainer');
                this.completedContainer = document.getElementById('completedContainer');
                this.countBadge = document.getElementById('countBadge');

                this.addBtn.addEventListener('click', () => this.addTask());
                this.clearBtn.addEventListener('click', () => this.clearAll());
                this.markDoneBtn.addEventListener('click', () => this.markAsDone());

                this.titleInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });

                this.updateUI();
            }

            addTask() {
                const title = this.titleInput.value.trim();
                if (!title) {
                    alert('Please enter a task title.');
                    return;
                }

                const task = {
                    id: Date.now(),
                    title: title,
                    type: this.typeSelect.value,
                    description: this.descInput.value.trim(), 
                    timestamp: new Date()
                };

                this.queue.push(task);
                this.resetForm();
                this.updateUI();
            }

            markAsDone() {
                if (this.queue.length > 0) {
                    const completedTask = this.queue.shift();
                    this.completed.unshift(completedTask);
                    if (this.completed.length > 5) {
                        this.completed.pop();
                    }
                    this.updateUI();
                }
            }

            clearAll() {
                if (this.queue.length === 0) {
                    alert('Queue is already empty.');
                    return;
                }
                if (confirm('Are you sure you want to clear all tasks?')) {
                    this.queue = [];
                    this.updateUI();
                }
            }

            resetForm() {
                this.titleInput.value = '';
                this.descInput.value = '';
                this.typeSelect.value = 'email';
                this.titleInput.focus();
            }

            formatDate(date) {
                return date.toLocaleString([], {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(',', '');
            }

            getTypeLabel(type) {
                const labels = {
                    email: 'Email',
                    file: 'File Upload',
                    message: 'Message',
                    other: 'Other'
                };
                return labels[type] || type;
            }

            updateUI() {
                // Update count
                this.countBadge.textContent = `${this.queue.length} tasks`;

                // Update task queue
                if (this.queue.length === 0) {
                    this.taskQueueContainer.innerHTML = '<div class="empty-message">Queue is empty. Add a task!</div>';
                } else {
                    this.taskQueueContainer.innerHTML = this.queue.map(task => {
                        let html = `<div class="task-entry">`;
                        html += `<div class="task-header">`;
                        html += `<span class="task-title">${this.escapeHtml(task.title)}</span>`;
                        html += ` <span class="task-type">(${this.getTypeLabel(task.type)})</span>`;
                        html += `</div>`;

                        // Only show description if it exists
                        if (task.description) {
                            html += `<div class="task-description">`;
                            html += `<span class="description-label">Description:</span> ${this.escapeHtml(task.description)}`;
                            html += `</div>`;
                        }

                        html += `<div class="task-timestamp">Added at ${this.formatDate(task.timestamp)}</div>`;
                        html += `</div>`;
                        return html;
                    }).join('');
                }

                // Update completed tasks
                if (this.completed.length === 0) {
                    this.completedContainer.innerHTML = '<div class="empty-message">No completed tasks yet.</div>';
                } else {
                    this.completedContainer.innerHTML = this.completed.map(task => {
                        let descPart = '';
                        if (task.description) {
                            descPart = ` • Description: ${this.escapeHtml(task.description)}`;
                        }

                        return `
                            <div class="completed-item">
                                <span class="completed-icon">✓</span>
                                <span class="completed-text">Task Completed!</span><br>
                                <span class="completed-details">
                                    ${this.escapeHtml(task.title)} (${this.getTypeLabel(task.type)})${descPart} - Finished at ${this.formatDate(task.timestamp)}
                                </span>
                            </div>
                        `;
                    }).join('');
                }

                this.markDoneBtn.disabled = this.queue.length === 0;
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new TaskScheduler();
        });
