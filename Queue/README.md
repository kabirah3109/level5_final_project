Task Scheduler (Queue-Based)
A simple, responsive web application that simulates a FIFO (First-In, First-Out) task scheduler. Tasks—such as sending an email, uploading a file, or delivering a message—are added to a queue and processed one by one.

Features:
-Add Tasks: Enter a title, select a type (Email, File Upload, Message, or Other), and optionally add a description.
-View Queue: Tasks appear in FIFO order with their type, date, and time of creation.
-Mark as Done: Process the oldest task with one click—moves it to the Recently Completed section.
-Recently Completed: Shows the last 5 completed tasks for reference.
-Clear All: Remove all pending tasks at once (with confirmation).
-Fully Responsive: Works beautifully on mobile, tablet, and desktop.


How It Works
The task queue is implemented using a JavaScript array:
-queue.push(task) → adds a new task to the end.
-queue.shift() → removes the first (oldest) task when marked as done.

Each task stores:
-Title
-Type (with emoji icon)
-Optional description
-Timestamp (formatted as Jun 10, 2025, 2:30 PM)
-Completed tasks are stored separately (up to 5) for visibility.
-No external libraries — built with vanilla HTML, CSS, and JavaScript.
-Input is safely escaped to prevent XSS.


How to Use
-Open the HTML file in any modern browser.
-Fill out the "Add New Task" form and click Add Task.
-See your task appear in the queue with its type and timestamp.
-Click Mark as Done to process the next task (oldest first).
-Completed tasks automatically appear in the Recently Completed section below.
💡 Tip: Press Enter in the title field to quickly add a task!

Mobile Support
Single-column layout on screens ≤600px.
Touch-friendly buttons and inputs.
Adaptive spacing and readable typography.


