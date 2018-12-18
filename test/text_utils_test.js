const assert = require("assert");
const {
  getLinesFromHead,
  getCharsFromHead,
  read,
  head,
  createHeading,
  runHead,
  getLinesFromTail,
  getCharsFromTail,
  newFileNotFoundMsg,
  createCommandData,
  tail,
  runTail
} = require("../src/libs/text_utils.js");
const { newFile } = require("../src/libs/file.js");

describe("getLinesFromHead", function() {
  it("should return no lines when any number of lines are required of an empty file", function() {
    let file = newFile("testFile", "", true);
    assert.deepEqual(getLinesFromHead(file, 1), "");
  });

  it("should return 10 lines from top by default when number of lines is not specified", function() {
    let fileContents =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    let file = newFile("testFile", fileContents, true);

    let expectedOutput =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10";

    assert.deepEqual(getLinesFromHead(file), expectedOutput);
  });

  it("should return lines from top when number of lines is specified for a file", function() {
    let fileContents =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    let file = newFile("testFile", fileContents, true);

    let expectedOutput =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5";

    assert.deepEqual(getLinesFromHead(file, 5), expectedOutput);
  });
});

describe("getCharsFromHead", function() {
  it("Should return empty string when an empty file is given", function() {
    let file = newFile("testFile", "", true);
    assert.deepEqual(getCharsFromHead(file, 4), "");
  });

  it("Should return first N characters of one liner file", function() {
    let file = newFile("testFile", "This is one liner file", true);
    assert.deepEqual(getCharsFromHead(file, 4), "This");
  });

  it("Should return first N characters of a multi liner file including \\n", function() {
    let fileContents =
      "This is file \n contains multiple lines\n" +
      "so that I can test my function.";
    let file = newFile("testFile", fileContents, true);
    assert.deepEqual(getCharsFromHead(file, 14), "This is file \n");
  });
});

const mockReader = function(expectedFile, expectedEncoding, expectedContent) {
  return function(actualFile, actualencoding) {
    const isFileValid = function() {
      return actualFile === expectedFile;
    };

    const isEncodingValid = function() {
      return actualencoding === expectedEncoding;
    };

    const areArgsValid = function() {
      return isFileValid() && isEncodingValid();
    };

    if (areArgsValid()) {
      return expectedContent;
    }
  };
};

describe("read", function() {
  it("should return the content of provided file when file and encoding is valid", function() {
    const readHelloWorld = mockReader(
      "../helloworld.txt",
      "utf-8",
      "Hello World"
    );
    assert.deepEqual(
      read(readHelloWorld, "../helloworld.txt", "utf-8"),
      "Hello World"
    );
  });

  it("should return empty string when empty file is provided", function() {
    const readEmptyFile = mockReader("../emptyFile.txt", "utf-8", "");
    assert.deepEqual(read(readEmptyFile, "../emptyFile.txt", "utf-8"), "");
  });
});

describe("head", function() {
  it("should return headed content when only one file is provided for -c option", function() {
    let file = newFile("testFile", "this is test file contents", true);
    let input = { option: "-c", files: [file], optionValue: 4 };
    let expectedOutput = "this";
    assert.deepEqual(head(input), expectedOutput);
  });

  it("should return headed content when multiple files are provided for -c option", function() {
    let file1 = newFile("testFile1", "this is test file1 contents", true);
    let file2 = newFile("testFile2", "And this is test file2 contents", true);
    let file3 = newFile("testFile3", "I think this is the last file", true);
    let input = { option: "-c", files: [file1, file2, file3], optionValue: 4 };
    let expectedOutput =
      "==> testFile1 <==\n" +
      "this\n" +
      "==> testFile2 <==\n" +
      "And \n" +
      "==> testFile3 <==\n" +
      "I th";
    assert.deepEqual(head(input), expectedOutput);
  });

  it("should return headed content when only one file is provided for -n option", function() {
    let fileContents =
      "This is first line of file\n" +
      "and this seems to be second line\n" +
      "this is third line\n" +
      "I think this is fourth line\n" +
      "And this seems to be last";
    let file = newFile("testFile", fileContents, true);
    let input = { option: "-n", files: [file], optionValue: 3 };
    let expectedOutput =
      "This is first line of file\n" +
      "and this seems to be second line\n" +
      "this is third line";
    assert.deepEqual(head(input), expectedOutput);
  });

  it("should return headed content when mulitiple files are provided for -n option", function() {
    let file1Contents =
      "This is first line of file 1\n" +
      "and this seems to be second line 1\n" +
      "this is third line 1\n" +
      "I think this is fourth line 1\n" +
      "And this seems to be last 1";

    let file2Contents =
      "This is first line of file 2\n" +
      "and this seems to be second line 2\n" +
      "this is third line 2\n" +
      "I think this is fourth line 2\n" +
      "And this seems to be last 2";

    let file3Contents =
      "This is first line of file 3\n" +
      "and this seems to be second line 3\n" +
      "this is third line 3\n" +
      "I think this is fourth line 3\n" +
      "And this seems to be last 3";

    let file1 = newFile("testFile1", file1Contents, true);
    let file2 = newFile("testFile2", file2Contents, true);
    let file3 = newFile("testFile3", file3Contents, true);

    let input = { option: "-n", files: [file1, file2, file3], optionValue: 3 };
    let expectedOutput =
      "==> testFile1 <==\n" +
      "This is first line of file 1\n" +
      "and this seems to be second line 1\n" +
      "this is third line 1\n\n" +
      "==> testFile2 <==\n" +
      "This is first line of file 2\n" +
      "and this seems to be second line 2\n" +
      "this is third line 2\n\n" +
      "==> testFile3 <==\n" +
      "This is first line of file 3\n" +
      "and this seems to be second line 3\n" +
      "this is third line 3";

    assert.deepEqual(head(input), expectedOutput);
  });
});

describe("createHeading", function() {
  it("Should surround given text with '==> ' and ' <==' ", function() {
    assert.equal(createHeading("sampleFile.txt"), "==> sampleFile.txt <==");
  });
});

const doesFileExists = function(fileName) {
  if (fileName.startsWith("existing")) {
    return true;
  }
  return false;
};

describe("runHead", function() {
  const readHelloWorld = mockReader(
    "existing_helloWorldTest",
    "utf-8",
    "Hello World"
  );
  it("should head characters of a single hello world file", function() {
    let inputs = ["-c", "2", "existing_helloWorldTest"];
    assert.equal(runHead(inputs, readHelloWorld, doesFileExists), "He");
  });

  it("should head lines of a single hello world file", function() {
    let inputs = ["-n", "2", "existing_helloWorldTest"];
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      "Hello World"
    );
  });

  it("should head characters of a multiple hello world files", function() {
    let inputs = [
      "-c",
      "2",
      "existing_helloWorldTest",
      "existing_helloWorldTest"
    ];
    let expectedOutput =
      "==> existing_helloWorldTest <==\n" +
      "He\n" +
      "==> existing_helloWorldTest <==\n" +
      "He";
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      expectedOutput
    );
  });

  it("should throw illegal line count error for invalid options", function() {
    let inputs = ["-0", "helloWorldfile1", "helloWorldfile2"];
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      "head: illegal line count -- 0"
    );
  });

  it("should throw illegal byte count error for invalid options", function() {
    let inputs = ["-c0", "helloWorldfile1", "helloWorldfile2"];
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      "head: illegal byte count -- 0"
    );
  });

  it("should provide an error for a single missing file", function() {
    let inputs = ["-c3", "helloWorldfile1"];
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      "head: helloWorldfile1: No such file or directory"
    );
  });

  it("should provide the error message for a missing file but list other files that are present", function() {
    let inputs = ["-c3", "helloWorldfile1", "existing_helloWorldTest"];
    let expectedOutput =
      "head: helloWorldfile1: No such file or directory\n" +
      "==> existing_helloWorldTest <==\n" +
      "Hel";
    assert.equal(
      runHead(inputs, readHelloWorld, doesFileExists),
      expectedOutput
    );
  });
});

describe("getLinesFromTail", function() {
  it("should return no lines when any number of lines are required of an empty file", function() {
    let file = newFile("testFile", "", true);
    assert.deepEqual(getLinesFromTail(file, 1), "");
  });

  it("should return 10 lines from bottom by default when number of lines is not specified", function() {
    let fileContents =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    let file = newFile("testFile", fileContents, true);

    let expectedOutput =
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    assert.deepEqual(getLinesFromTail(file), expectedOutput);
  });

  it("should return lines from bottom when number of lines is specified for a file", function() {
    let fileContents =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    let file = newFile("testFile", fileContents, true);

    let expectedOutput =
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    assert.deepEqual(getLinesFromTail(file, 5), expectedOutput);
  });

  it("should return lines from bottom ignoring last empty line when number of lines is specified for a file", function() {
    let fileContents =
      "This is line 1\n" +
      "This is line 2\n" +
      "This is line 3\n" +
      "This is line 4\n" +
      "This is line 5\n" +
      "This is line 6\n" +
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11\n";

    let file = newFile("testFile", fileContents, true);

    let expectedOutput =
      "This is line 7\n" +
      "This is line 8\n" +
      "This is line 9\n" +
      "This is line 10\n" +
      "This is line 11";

    assert.deepEqual(getLinesFromTail(file, 5), expectedOutput);
  });
});

describe("getCharsFromTail", function() {
  it("Should return empty string when an empty file is given", function() {
    let file = newFile("testFile", "", true);
    assert.deepEqual(getCharsFromTail(file, 4), "");
  });

  it("Should return last N characters of one liner file", function() {
    let file = newFile("testFile", "This is one liner file", true);
    assert.deepEqual(getCharsFromTail(file, 4), "file");
  });

  it("Should return last N characters of a multi liner file", function() {
    let fileContents =
      "This is file \n contains multiple lines\n" +
      "so that I can test my function.";
    let file = newFile("testFile", fileContents, true);
    assert.deepEqual(getCharsFromTail(file, 14), "t my function.");
  });
});

xdescribe("createCommandData", function() {
  it("should return command data containing file objects when user gives input with existing files", function() {
    const userInputs = {
      option: "-n",
      optionValue: 10,
      fileNames: ["existing_helloWorldFile"]
    };
    const helloWorldReader = mockReader(
      "existing_helloWorldFile",
      "utf-8",
      "Hello World"
    );
    const helloWorldFile = newFile(
      "existing_helloWorldFile",
      "Hello World",
      true
    );
    const expectedOutput = {
      option: "-n",
      optionValue: 10,
      files: [helloWorldFile]
    };
    assert.deepEqual(
      createCommandData(userInputs, helloWorldReader, doesFileExists),
      expectedOutput
    );
  });
});

describe("tail", function() {
  it("should return tailed content when only one file is provided for -c option", function() {
    let file = newFile("testFile", "this is test file contents", true);
    let input = { option: "-c", files: [file], optionValue: 4 };
    let expectedOutput = "ents";
    assert.deepEqual(tail(input), expectedOutput);
  });

  it("should return tailed content when multiple files are provided for -c option", function() {
    let file1 = newFile("testFile1", "this is test file1 contents", true);
    let file2 = newFile("testFile2", "And this is test file2 contents", true);
    let file3 = newFile("testFile3", "I think this is the last file", true);
    let input = { option: "-c", files: [file1, file2, file3], optionValue: 4 };
    let expectedOutput =
      "==> testFile1 <==\n" +
      "ents\n" +
      "==> testFile2 <==\n" +
      "ents\n" +
      "==> testFile3 <==\n" +
      "file";
    assert.deepEqual(tail(input), expectedOutput);
  });

  it("should return tailed content when only one file is provided for -n option", function() {
    let fileContents =
      "This is first line of file\n" +
      "and this seems to be second line\n" +
      "this is third line\n" +
      "I think this is fourth line\n" +
      "And this seems to be last";
    let file = newFile("testFile", fileContents, true);
    let input = { option: "-n", files: [file], optionValue: 3 };
    let expectedOutput =
      "this is third line\n" +
      "I think this is fourth line\n" +
      "And this seems to be last";
    assert.deepEqual(tail(input), expectedOutput);
  });

  it("should return tailed content when mulitiple files are provided for -n option", function() {
    let file1Contents =
      "This is first line of file 1\n" +
      "and this seems to be second line 1\n" +
      "this is third line 1\n" +
      "I think this is fourth line 1\n" +
      "And this seems to be last 1";

    let file2Contents =
      "This is first line of file 2\n" +
      "and this seems to be second line 2\n" +
      "this is third line 2\n" +
      "I think this is fourth line 2\n" +
      "And this seems to be last 2";

    let file3Contents =
      "This is first line of file 3\n" +
      "and this seems to be second line 3\n" +
      "this is third line 3\n" +
      "I think this is fourth line 3\n" +
      "And this seems to be last 3";

    let file1 = newFile("testFile1", file1Contents, true);
    let file2 = newFile("testFile2", file2Contents, true);
    let file3 = newFile("testFile3", file3Contents, true);

    let input = { option: "-n", files: [file1, file2, file3], optionValue: 3 };
    let expectedOutput =
      "==> testFile1 <==\n" +
      "this is third line 1\n" +
      "I think this is fourth line 1\n" +
      "And this seems to be last 1\n\n" +
      "==> testFile2 <==\n" +
      "this is third line 2\n" +
      "I think this is fourth line 2\n" +
      "And this seems to be last 2\n\n" +
      "==> testFile3 <==\n" +
      "this is third line 3\n" +
      "I think this is fourth line 3\n" +
      "And this seems to be last 3";

    assert.deepEqual(tail(input), expectedOutput);
  });
});

describe("runTail", function() {
  const readHelloWorld = mockReader(
    "existing_helloWorldTest",
    "utf-8",
    "Hello World"
  );
  it("should tail characters of a single hello world file", function() {
    let inputs = ["-c", "2", "existing_helloWorldTest"];
    assert.equal(runTail(inputs, readHelloWorld, doesFileExists), "ld");
  });

  it("should tail lines of a single hello world file", function() {
    let inputs = ["-n", "2", "existing_helloWorldTest"];
    assert.equal(
      runTail(inputs, readHelloWorld, doesFileExists),
      "Hello World"
    );
  });

  it("should tail characters of a multiple hello world files", function() {
    let inputs = [
      "-c",
      "2",
      "existing_helloWorldTest",
      "existing_helloWorldTest"
    ];
    let expectedOutput =
      "==> existing_helloWorldTest <==\n" +
      "ld\n" +
      "==> existing_helloWorldTest <==\n" +
      "ld";
    assert.equal(
      runTail(inputs, readHelloWorld, doesFileExists),
      expectedOutput
    );
  });

  it("should provide an error for a single missing file", function() {
    let inputs = ["-c3", "helloWorldfile1"];
    assert.equal(
      runTail(inputs, readHelloWorld, doesFileExists),
      "tail: helloWorldfile1: No such file or directory"
    );
  });

  it("should provide the error message for a missing file but list other files that are present", function() {
    let inputs = ["-c3", "helloWorldfile1", "existing_helloWorldTest"];
    let expectedOutput =
      "tail: helloWorldfile1: No such file or directory\n" +
      "==> existing_helloWorldTest <==\n" +
      "rld";
    assert.equal(
      runTail(inputs, readHelloWorld, doesFileExists),
      expectedOutput
    );
  });

  it("should provide an error for a illegal offset", function() {
    let inputs = ["-cdsf", "helloWorldfile1"];
    assert.equal(
      runTail(inputs, readHelloWorld, doesFileExists),
      "tail: illegal offset -- dsf"
    );
  });

  it("should return empty string for offset 0", function() {
    let inputs = ["-0", "helloWorldfile1"];
    assert.equal(runTail(inputs, readHelloWorld, doesFileExists), "");
  });
});
