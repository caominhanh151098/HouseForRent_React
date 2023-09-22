import { useEffect } from "react";

const useScriptNoInte = (url) => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        
        // script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url])
}

export default useScriptNoInte;