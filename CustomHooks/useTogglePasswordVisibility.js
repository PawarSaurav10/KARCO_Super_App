import React, { useState } from "react"
import images from "../Constants/images";

export const useTogglePasswordVisibility = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState(images.view_icon);

    const handlePasswordVisibility = () => {
        if (rightIcon === images.view_icon) {
            setRightIcon(images.hide_icon);
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === images.hide_icon) {
            setRightIcon(images.view_icon);
            setPasswordVisibility(!passwordVisibility);
        }
    };
    return {
        passwordVisibility,
        rightIcon,
        handlePasswordVisibility
    };
};