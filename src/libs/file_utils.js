const { createFile } = require("./file.js");
const { parseInputs, validateOffsetHead, validateOffsetTail } = require("./process_input.js");
const { 
  getHeadOffsetError,
  getTailOffsetError,
  getFileNotFoundError
} = require('./error.js');

const getLinesFromHead = function(file, numberOfLines = 10) {
  return file.getLines().slice(0, numberOfLines).join("\n");
};

const getCharsFromHead = function(file, numberOfCharacters) {
  return file.contents.substr(0, numberOfCharacters);
};

const getLinesFromTail = function(file, numberOfLines = 10) {
  const lines = file.getLines();
  if (file.contents.endsWith("\n")) {
    lines.pop();
  }

  const tailedLines = lines.slice(-numberOfLines);
  return tailedLines.join("\n");
};

const getCharsFromTail = function(file, numberOfCharacters) {
  return file.contents.substr(-numberOfCharacters);
};

const read = function(reader, filepath, encoding) {
  return reader(filepath, encoding);
};

const createHeading = function(text) {
  return "==> " + text + " <==";
};

const runCommand = function(commandData, fileNotFoundMsgProvider, commandOperations) {
  const { option, files, optionValue } = commandData;
  const commandOperation = commandOperations[option];
  const contentJoiners = { "-n": "\n\n", "-c": "\n" };

  const resultedContents = files.map(file => {
    if (!file.doesExists) {
      return fileNotFoundMsgProvider(file.name);
    }

    if (files.length == 1) {
      return commandOperation(files[0], optionValue);
    }

    const header = createHeading(file.name);
    const resultedFileContents = commandOperation(file, optionValue);
    return header + "\n" + resultedFileContents;
  });

  return resultedContents.join(contentJoiners[option]);
};

const head = function(commandData) {
  const headOperations = { "-n": getLinesFromHead, "-c": getCharsFromHead };
  const fileNotFoundProvider = getFileNotFoundError.bind(null, "head");
  return runCommand(commandData, fileNotFoundProvider, headOperations);
};

const tail = function(commandData) {
  const headOperations = { "-n": getLinesFromTail, "-c": getCharsFromTail };
  const fileNotFoundProvider = getFileNotFoundError.bind(null, "tail");
  return runCommand(commandData, fileNotFoundProvider, headOperations);
};

const createCommandData = function(userInputs, reader, doesFileExists) {
  const fileNames = userInputs.fileNames;
  const files = fileNames.map(fileName => {
    if (doesFileExists(fileName)) {
      return createFile(fileName, read(reader, fileName, "utf-8"), true);
    }
    return createFile(fileName, "", false);
  });

  let headData = {
    option: userInputs.option,
    optionValue: userInputs.optionValue,
    files
  };
  return headData;
};

const getOffsetValidator = function(command){
  const validators = {"head": validateOffsetHead, "tail": validateOffsetTail};
  return validators[command];
}

const getOffsetErrorProvider = function(command){
  const offsetErrorProviders = {"head": getHeadOffsetError, "tail": getTailOffsetError};
  return offsetErrorProviders[command];
}

const getFinalOutput = function(inputs, reader, doesFileExists, command){
  const userInputs = parseInputs(inputs);
  const offsetValidator = getOffsetValidator(command);
  const offsetErrorProvider = getOffsetErrorProvider(command);

  const validatedOffset = offsetValidator(userInputs.optionValue, offsetErrorProvider,userInputs.option);
  if (!validatedOffset.isValid) {
    return validatedOffset.error;
  }

  const commandData = createCommandData(userInputs, reader, doesFileExists);
  const commandExecutor = {head, tail};

  return commandExecutor[command](commandData);
}

const runHead = function(inputs, reader, doesFileExists) {
  return getFinalOutput(inputs, reader, doesFileExists, "head");
};

const runTail = function(inputs, reader, doesFileExists) {
  return getFinalOutput(inputs, reader, doesFileExists, "tail");
};

module.exports = {
  getLinesFromHead,
  getCharsFromHead,
  read,
  head,
  createHeading,
  runHead,
  getLinesFromTail,
  getCharsFromTail,
  createCommandData,
  tail,
  runTail
}
