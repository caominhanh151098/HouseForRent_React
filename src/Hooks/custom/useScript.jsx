import { useEffect } from "react";

const useScript = (url, integrity, crossorigin = "anonymous") => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = url;
        script.integrity = integrity;
        script.crossorigin = crossorigin;
        // script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url, integrity, crossorigin])
}

export default useScript;