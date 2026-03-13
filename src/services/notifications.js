// ===== NOTIFICATION SYSTEM =====
class Notification {
    constructor(message, type = 'success', duration = 3000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.show();
    }

    show() {
        const container = this.getContainer();
        const notif = document.createElement('div');
        notif.className = `notification notification-${this.type} animate-slide-in`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notif.innerHTML = `
            <div class="flex items-center gap-3 p-4 rounded-lg text-white shadow-lg">
                <span class="text-xl">${icons[this.type]}</span>
                <span class="flex-1">${this.message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-lg hover:opacity-70">×</button>
            </div>
        `;

        container.appendChild(notif);

        if (this.duration > 0) {
            setTimeout(() => {
                notif.classList.add('animate-slide-out');
                setTimeout(() => notif.remove(), 300);
            }, this.duration);
        }

        return notif;
    }

    getContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-3 pointer-events-none';
            document.body.appendChild(container);
        }
        return container;
    }
}

// Helper functions
function showSuccess(message) {
    return new Notification(message, 'success', 3000);
}

function showError(message) {
    return new Notification(message, 'error', 4000);
}

function showWarning(message) {
    return new Notification(message, 'warning', 3500);
}

function showInfo(message) {
    return new Notification(message, 'info', 3000);
}

// Export to window
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
window.Notification = Notification;