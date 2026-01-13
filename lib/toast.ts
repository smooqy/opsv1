// Simple toast notification system

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
}

class ToastManager {
    private container: HTMLDivElement | null = null;

    private getContainer(): HTMLDivElement {
        if (!this.container) {
            this.container = document.getElementById('toast-container') as HTMLDivElement;

            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            }
        }
        return this.container;
    }

    show(options: ToastOptions) {
        const { message, type = 'info', duration = 3000 } = options;

        const toast = document.createElement('div');
        toast.style.cssText = `
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: auto;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        `;

        // Colors based on type
        const colors = {
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };

        toast.style.background = colors[type];
        toast.textContent = message;

        const container = this.getContainer();
        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, duration);
    }

    success(message: string, duration?: number) {
        this.show({ message, type: 'success', duration });
    }

    error(message: string, duration?: number) {
        this.show({ message, type: 'error', duration });
    }

    warning(message: string, duration?: number) {
        this.show({ message, type: 'warning', duration });
    }

    info(message: string, duration?: number) {
        this.show({ message, type: 'info', duration });
    }
}

// Add animations to document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

export const toast = new ToastManager();
