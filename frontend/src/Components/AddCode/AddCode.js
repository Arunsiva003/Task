import React, { useState } from 'react';
import Editor from '@monaco-editor/react'
import './AddCode.css'; // Import CSS file for styling
import {CODE_SNIPPETS} from '../../constants';
import { executeCode } from '../../api';

const AddCodeForm = () => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    preferredCodeLang: '',
    stdInput: '',
    stdOutput: '',
    sourceCode: ''
  });

  const handleChange = (e) => {
    if (e.currentTarget.name === "preferredCodeLang") {
      const selectedLanguage = e.target.value;
      setLanguage(selectedLanguage);
      setValue(CODE_SNIPPETS[selectedLanguage]);
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const runCode = async () => {
    const sourceCode = value;
    console.log("sources",sourceCode);
    if (!sourceCode) return;
    try {
      // setIsLoading(true);
      console.log("loading start")
      const { run: result } = await executeCode(language, sourceCode);
      console.log("dbg",result.output);
      setOutput(result.output);
      console.log("op",output);
      result.stderr ? console.log(result.stderr) :console.log("RES:",result);
      // setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      // toast({
      //   title: "An error occurred.",
      //   description: error.message || "Unable to run code",
      //   status: "error",
      //   duration: 6000,
      // });
    } finally {
      // setIsLoading(false);
      console.log("loading end")

    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="add-code-container">
      <div className="left-side">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label>Preferred Code Language:</label>
          <select
            name="preferredCodeLang"
            value={formData.preferredCodeLang}
            onChange={handleChange}
            // onSelect={setValue(CODE_SNIPPETS[value])}
            required
          >
            <option value="">Select</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="form-group">
          <label>Standard Input:</label>
          <textarea
            class="input-field"
            type="text"
            name="stdInput"
            value={formData.stdInput}
            onChange={handleChange}
            placeholder="Enter standard input"
            required
          />
        </div>
        <div className="form-group">
          <label>Standard Output:</label>
          <textarea
            className='output-field'
            type="text"
            name="stdOutput"
            value={output
              ? output
              : 'Click "Run Code" to see the output here'}
            onChange={handleChange}
            placeholder="Enter standard output"
            required
          />
        </div>
      </div>
      <div className="right-side">
      <div className="form-group">
        <label>Source Code:</label>
        <Editor
          height="80vh" 
          language={language}
          defaultValue={CODE_SNIPPETS[language]} 
          theme='vs-dark'
          value={value}
          onChange={(value) => setValue(value)}
        />
      </div>
      <button className="submit-button" type="submit" onClick={runCode}>
        Run Code
      </button>
</div>

    </div>
  );
};

export default AddCodeForm;