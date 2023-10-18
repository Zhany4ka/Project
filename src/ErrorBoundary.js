import './App.css';
import React from 'react';
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null, errorInfo: null };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    closeModal = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">Что-то пошло не так!</span>
                            <button onClick={this.closeModal}>✖</button>
                        </div>
                        <div className="modal-body">
                            {this.state.error && this.state.error.toString()}
                            <details style={{ whiteSpace: 'pre-wrap' }}>
                                {this.state.errorInfo.componentStack}
                            </details> 
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
export default ErrorBoundary;
