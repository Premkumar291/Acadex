import React from 'react';
import { toast } from 'react-hot-toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class FacultyErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Show the requested toaster message
        toast.error('An error happened please contact your admin', {
            duration: 5000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                border: '1px solid #b91c1c'
            }
        });

        // Log error to console only in development
        if (import.meta.env.DEV) {
            console.error('Faculty Error Boundary caught:', error);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <AlertTriangle className="h-16 w-16 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Something went wrong
                        </h1>

                        <p className="text-gray-600 mb-6">
                            An error happened please contact your admin.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh Page</span>
                            </button>

                            <button
                                onClick={() => window.history.back()}
                                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default FacultyErrorBoundary;
