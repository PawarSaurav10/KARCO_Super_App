import React, { useState } from "react"
import showIcon from "../Images/show.png"
import hideIcon from "../Images/hide.png"

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState(showIcon);

    const handlePasswordVisibility = () => {
        if (rightIcon === showIcon) {
            setRightIcon(hideIcon);
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === hideIcon) {
            setRightIcon(showIcon);
            setPasswordVisibility(!passwordVisibility);
        }
    };
    return {
        passwordVisibility,
        rightIcon,
        handlePasswordVisibility
    };
};