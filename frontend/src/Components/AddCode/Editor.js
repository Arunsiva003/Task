import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './AddCode.css';
import { executeCode } from '../../api';
import { CODE_SNIPPETS } from '../../constants';
import { useNavigate, useParams } from 'react-router-dom';

const AddCodeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('');
  const [output, setOutput] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    preferredCodeLang: '',
    stdInput: '',
    stdOutput: '',
    sourceCode: ''
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/getCode/${id}`)
        .then(response => {
          const data = response.data[0];
          setValue(data.sourcecode);
          setLanguage(data.language);
          setFormData(prevState => ({
            ...prevState,
            preferredCodeLang: data.language
          }));
        })
        .catch(error => {
          console.error('Error fetching code:', error);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    if (e.currentTarget.name === 'preferredCodeLang') {
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
    if (!sourceCode || !formData.preferredCodeLang) {
      alert("Invalid data to Run");
      return;
    }
    try {
      const { run: result } = await executeCode(language, sourceCode, formData.stdInput);
      setOutput(result.output);
      if (result.error) alert(result.error);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value || !formData.username || !formData.preferredCodeLang) {
      alert("Invalid data to save");
      return;
    }

    try {
      await axios.post(' http://localhost:5000/codesnippets', {
        username: formData.username,
        preferredCodeLang: formData.preferredCodeLang,
        sourceCode: value
      });
      alert('Code Saved');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <>
      <div className="go-to-dashboard">
        <button type="button" onClick={() => navigate('/')}>
          Dashboard
        </button>
      </div>
      <div className="add-code-container">
        <div className="left-side">
          <form >
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
                required
              >
                <option value="">Select</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="form-group">
              <label>Standard Input:</label>
              <textarea
                className="input-field"
                type="text"
                name="stdInput"
                value={formData.stdInput}
                onChange={handleChange}
                placeholder="Enter standard input"
              />
            </div>
            <div className="form-group">
              <label>Standard Output:</label>
              <textarea
                className="output-field"
                type="text"
                name="stdOutput"
                value={output || 'Click "Run Code" to see the output here'}
                readOnly
                placeholder="Enter standard output"
              />
            </div>
          </form>
        </div>
        <div className="right-side">
          <div className="form-group">
            <label>Source Code:</label>
            <Editor
              height="80vh"
              language={formData.preferredCodeLang}
              defaultValue={CODE_SNIPPETS[formData.preferredCodeLang]}
              theme="vs-dark"
              value={value}
              onChange={(value) => setValue(value)}
            />
          </div>
          <div style = {{display:"flex", gap:'10%'}}>
          <button className="submit-button" type="button" onClick={runCode}>
            Run Code
          </button>
          <button className="submit-button" type="button" onClick={handleSubmit}>
            Save Code
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCodeForm;
