// src/hooks/useHideOnScroll.ts
import { useEffect } from "react";
import type { RefObject } from "react";

const useHideOnScroll = (ref: RefObject<HTMLElement | null>): void => {
    useEffect(() => {
        let lastScroll = 0;

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (!ref.current) return;

            // Nếu cuộn xuống quá mốc 50px và vị trí hiện tại sâu hơn vị trí trước đó -> Ẩn Header
            if (currentScroll > lastScroll && currentScroll > 50) {
                ref.current.classList.add("hide");
            } else {
                // Nếu cuộn ngược lên trên -> Hiện lại Header
                ref.current.classList.remove("hide");
            }

            lastScroll = currentScroll;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [ref]);
};

export default useHideOnScroll;