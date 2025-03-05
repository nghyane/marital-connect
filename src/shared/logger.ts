import log from "encore.dev/log";

export const logger = {
    info: (message: string, data?: Record<string, any>) => {
        log.info(message, data);
    },
    
    error: (errorOrMessage: Error | unknown | string, messageOrData?: string | Record<string, any>, data?: Record<string, any>) => {
        if (typeof errorOrMessage === 'string') {
            // Called with string message as first parameter
            log.error(errorOrMessage, messageOrData as Record<string, any>);
        } else {
            // Called with Error object as first parameter
            log.error(errorOrMessage, messageOrData as string || "An error occurred", data);
        }
    },
    
    warn: (message: string, data?: Record<string, any>) => {
        log.warn(message, data);
    },
    
    debug: (message: string, data?: Record<string, any>) => {
        log.debug(message, data);
    }
}; 