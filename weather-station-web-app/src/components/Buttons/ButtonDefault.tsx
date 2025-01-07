import React from "react";

interface ButtonPropTypes {
    label: string;
    customClasses: string;
    onClick?: () => void; // Optional onClick prop
    children?: React.ReactNode;
}

const ButtonDefault = ({
                           label,
                           customClasses,
                           onClick,
                           children,
                       }: ButtonPropTypes) => {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 ${customClasses}`}
            onClick={onClick}
        >
            {children}
            {label}
        </button>
    );
};

export default ButtonDefault;