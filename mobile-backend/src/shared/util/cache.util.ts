import * as fs from "fs";

const cacheDir = `../files/`;

export const checkCacheDirectoryExistence = () => {
    if (fs.existsSync(cacheDir)) {
        return;
    }

    fs.mkdirSync(cacheDir);
}

export const getContentFromCache = (contentId: string) => {
    const contentPath = `${cacheDir}${contentId}`;
    if (!fs.existsSync(contentPath)) {
        return;
    }

    return fs.readFileSync(contentPath);
}

export const createFileContentCache = (contentId: string, data: Buffer) => {
    fs.writeFileSync(`${cacheDir}${contentId}`, data);
}

export const removeFileContentCache = (contentId: string) => {
    const contentPath = `${cacheDir}${contentId}`;

    if (fs.existsSync(contentPath)) {
        fs.unlinkSync(contentPath);
    }
}