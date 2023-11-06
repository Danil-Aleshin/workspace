/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn } = require("child_process");

const didSucceed = (code) => `${code}` === "0";

function gitInit(answers, config) {
  const rootSpawnOptions = config.verbose
    ? {
      cwd: config.rootPath,
      shell: true,
      stdio: "inherit",
    }
    : {
      cwd: config.path,
    };

  const moduleSpawnOptions = config.verbose
    ? {
      cwd: config.modulePath,
      shell: true,
      stdio: "inherit",
    }
    : {
      cwd: config.path,
    };

  const gitInitLocal = () =>
    new Promise((resolve, reject) => {
      const gitInit = spawn("git", ["init"], moduleSpawnOptions);

      gitInit.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`git init успешно`);
        } else {
          reject(`git init завершился с кодом ${code}`);
        }
      });
    });

  const gitCheckoutDev = () =>
    new Promise((resolve, reject) => {
      const gitInit = spawn("git", ["checkout", "-b", "develop"], moduleSpawnOptions);

      gitInit.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`git checkout develop успешно`);
        } else {
          reject(`git checkout develop завершился с кодом ${code}`);
        }
      });
    });

  const gitAdd = () =>
    new Promise((resolve, reject) => {
      const gitAdd = spawn("git", ["add", "-A"], moduleSpawnOptions);

      gitAdd.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`git add успешно`);
        } else {
          reject(`git add завершился с кодом ${code}`);
        }
      });
    });

  const gitSync = () =>
    new Promise((resolve, reject) => {
      const gitSync = spawn("git", ["submodule", "sync"], rootSpawnOptions);

      gitSync.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`Подмодули успешно синхронизированы`);
        } else {
          reject(`При попытке синхронизации подмодулей произошла ошибка с кодом ${code}`);
        }
      });
    });

  const gitSetDefaultBranch = () =>
    new Promise((resolve, reject) => {
      const gitSetBranch = spawn(
        "git",
        ["submodule", "set-branch", "-b", "develop", "--", `packages/${answers.name}`],
        rootSpawnOptions
      );

      gitSetBranch.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`Успешно изменена ветка по умолчанию на develop`);
        } else {
          reject(`При изменении ветки по умолчанию произошла ошибка с кодом ${code}`);
        }
      });
    });

  const gitSetURLSubmodule = () =>
    new Promise((resolve, reject) => {
      const gitSetURL = spawn(
        "git",
        ["submodule", "set-url", "--", `packages/${answers.name}`, `../${answers.name}-pkg.git`],
        rootSpawnOptions
      );

      gitSetURL.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`URL подмодуля успешно изменен`);
        } else {
          reject(`При изменении URL подмодуля произошла ошибка с кодом ${code}`);
        }
      });
    });

  const gitModulesAdd = () =>
    new Promise((resolve, reject) => {
      const gitModulesAdd = spawn("git", ["add", ".gitmodules"], rootSpawnOptions);

      gitModulesAdd.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`.gitmodules добавлен в индекс`);
        } else {
          reject(`При добавлении .gitmodules в индекс произошла ошибка с кодом ${code}`);
        }
      });
    });

  const gitMoveModuleDirectory = () =>
    new Promise((resolve, reject) => {
      const gitAbsorbgitdirs = spawn("git", ["submodule", "absorbgitdirs"], rootSpawnOptions);

      gitAbsorbgitdirs.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`.git директория модуля перенесена`);
        } else {
          reject(`При переносе директории .git возникла ошибка с кодом ${code}`);
        }
      });
    });

  const installDependencies = () =>
    new Promise((resolve, reject) => {
      const install = spawn("yarn", rootSpawnOptions);

      install.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`Зависимости успешно установлены`);
        } else {
          reject(`При установке зависимостей произошла ошибка с кодом ${code}`);
        }
      });
    });

  const gitCommit = () =>
    new Promise((resolve, reject) => {
      const gitAdd = spawn("git", ["commit", '-m "Initial commit"'], moduleSpawnOptions);

      gitAdd.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`git commit успешно`);
        } else {
          reject(`git commit завершился с кодом ${code}`);
        }
      });
    });

  const gitInitialSubmodule = () =>
    new Promise((resolve, reject) => {
      const gitAdd = spawn(
        "git",
        [
          "submodule",
          "add",
          "-b",
          "develop",
          "--",
          `${answers.repositoryURL}`,
          `modules/${answers.name}`,
        ],
        rootSpawnOptions
      );

      gitAdd.on("close", (code) => {
        if (didSucceed(code)) {
          resolve(`Подмодуль '${answers.name}' успешно инициализирован!`);
        } else {
          reject(`Инициализация модуля '${answers.name}' завершилась с кодом ${code}`);
        }
      });
    });

  return gitInitLocal()
    .then(() => gitCheckoutDev())
    .then(() => gitAdd())
    .then(() => gitCommit())
    .then(() => gitInitialSubmodule())
    .then(() => gitSync())
    .then(() => gitMoveModuleDirectory())
    .then(() => gitSetDefaultBranch())
    .then(() => gitSetURLSubmodule())
    .then(() => gitModulesAdd())
    .then(() => installDependencies());
}

module.exports = function (
  /** @type {import('node-plop').NodePlopAPI} */
  plop
) {
  plop.setDefaultInclude({ actionTypes: true });
  plop.setActionType("gitInit", gitInit);
};
