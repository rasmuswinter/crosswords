import path from 'path';
import fs from 'fs';
import _ from 'lodash';

// cribbed from node-config package, but without the conditional `require`s for non-JSON formats

const config = {
    configFiles: []
};

function initParam(paramName, defaultValue) {
    return process.env[paramName] || defaultValue;
}

const NODE_ENV = initParam('NODE_ENV', 'development');
const APP_INSTANCE = initParam('NODE_APP_INSTANCE');

let baseNames = ['default', NODE_ENV, 'local', 'local-' + NODE_ENV];
if (APP_INSTANCE) {
    let newBaseNames = [];
    baseNames.forEach(baseName => {
        newBaseNames.push(baseName);
        newBaseNames.push(baseName + '-' + APP_INSTANCE);
    });
    baseNames = newBaseNames;
}

const extNames = ['json'];
const configDir = __dirname;
baseNames.forEach(baseName => {
    extNames.forEach(extName => {
        const fullFilename = path.join(configDir, baseName + '.' + extName);
        const configObj = parseFile(fullFilename);
        if (configObj) {
            if (!configObj.name) {
                configObj.name = baseName;
            }
            _.merge(config, configObj);
            config.configFiles.push(config.name);
        }
    });
});

function parseFile(fullFilename) {

    // Initialize
    let configObject = null;
    let fileContent = null;

    try {
        const stat = fs.statSync(fullFilename);
        if (!stat || stat.size < 1) {
            return null;
        }
    } catch (e1) {
        return null
    }

    // Try loading the file.
    try {
        fileContent = fs.readFileSync(fullFilename, 'UTF-8');
        fileContent = fileContent.replace(/^\uFEFF/, '');
    }
    catch (e2) {
        throw new Error('Config file ' + fullFilename + ' cannot be read');
    }

    // Parse the file based on extension
    try {
        configObject = JSON.parse(fileContent);
    } catch (e3) {
        throw new Error("Cannot parse config file: '" + fullFilename + "': " + e3);
    }

    return configObject;
}

module.exports = config;
