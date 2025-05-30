import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`p-6 pb-0 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div 
            className={`p-6 pt-0 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export { Card, CardHeader, CardContent, CardFooter };
