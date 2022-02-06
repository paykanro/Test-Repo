const NAMESPACE = 'Logger-Tool';

const logger = {};
 
logger.getTimeStamp = () => {
    return new Date().toISOString();
};
logger.info = (namespace, message, object) => {
    if (object) {
        console.info(`[${this.getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
    } else {
        console.info(`[${this.getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }
};
logger.warn = (namespace, message, object) => {
    if (object) {
        console.warn(`[${this.getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    } else {
        console.warn(`[${this.getTimeStamp()}] [WARN] [${namespace}] ${message}`);
    }
};

logger.error = (namespace, message, object) => {
    if (object) {
        console.error(`[${this.getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
    } else {
        console.error(`[${this.getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
    }
};
logger.debug = (namespace, message, object) => {
    if (object) {
        console.debug(`[${this.getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    } else {
        console.debug(`[${this.getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};

module.export = logger;