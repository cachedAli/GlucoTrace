import { useEffect } from "react";


export const useCloseOnClick = (ref: React.RefObject<HTMLElement>, item: boolean, setItem: (value: boolean) => void) => {

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                ref.current &&
                e.target instanceof Node &&
                !ref.current.contains(e.target)
            ) {
                setItem(false);
            }
            
        };

        if (item) document.addEventListener("click", handleClickOutside);
        
        return () => document.removeEventListener("click", handleClickOutside);
    }, [item]);

}