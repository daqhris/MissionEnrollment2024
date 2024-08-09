"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs/promises");
const task_names = require("hardhat/builtin-tasks/task-names");
const config = require("hardhat/config");
const path = require("path");
config
    .subtask(task_names.TASK_COMPILE_SOLIDITY)
    .setAction(async (_, { config }, runSuper) => {
    const superRes = await runSuper();
    try {
        await fs.writeFile(path.join(config.paths.artifacts, 'package.json'), '{ "type": "commonjs" }');
    }
    catch (error) {
        console.error('Error writing package.json: ', error);
    }
    return superRes;
});
