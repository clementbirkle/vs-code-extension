import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { config } from "./config";

export const projectPath = (path = "", forCode = false): string => {
    if (path[0] === "/") {
        path = path.substring(1);
    }

    let basePath = config<string>("basePath", "");

    if (forCode === false && basePath.length > 0) {
        return resolvePath(basePath, path);
    }

    let basePathForCode = config<string>("basePathForCode", "");

    if (forCode && basePathForCode.length > 0) {
        return resolvePath(basePathForCode, path);
    }

    for (let workspaceFolder of getWorkspaceFolders()) {
        if (fs.existsSync(`${workspaceFolder.uri.fsPath}/artisan`)) {
            return `${workspaceFolder.uri.fsPath}/${path}`;
        }
    }

    return "";
};

const resolvePath = (basePath: string, relativePath: string): string => {
    if (basePath.startsWith(".") && hasWorkspace()) {
        basePath = path.resolve(getWorkspaceFolders()[0].uri.fsPath, basePath);
    }

    return `${basePath.replace(/[\/\\]$/, "")}/${relativePath}`;
};

export const hasWorkspace = (): boolean => {
    return (
        vscode.workspace.workspaceFolders instanceof Array &&
        vscode.workspace.workspaceFolders.length > 0
    );
};

export const getWorkspaceFolders = () =>
    vscode.workspace.workspaceFolders || [];

export const projectPathExists = (path: string): boolean => {
    return fs.existsSync(projectPath(path));
};

export const readFileInProject = (path: string): string => {
    return fs.readFileSync(projectPath(path), "utf8");
};
