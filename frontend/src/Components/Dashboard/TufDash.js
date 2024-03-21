import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Tag,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { FaStickyNote } from 'react-icons/fa';
import Editor from '@monaco-editor/react';

const StyledTable = chakra(Table, {
  baseStyle: { 
    borderCollapse: "collapse",
    width: "100%",
    textAlign: "left",
    fontWeight: "bold",
  },
});

const StyledTh = chakra(Th, {
  baseStyle: { 
    borderBottom: "2px solid #ccc",
    padding: "8px",
  },
});

const StyledTd = chakra(Td, {
  baseStyle: { 
    borderBottom: "1px solid #ccc",
    padding: "8px",
  },
});

const NotesModal = ({ isOpen, onClose, initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Notes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor
            height="50vh"
            defaultLanguage="plaintext"
            value={notes}
            onChange={(value) => setNotes(value)}
          />
          <Button mt={4} onClick={handleSave} colorScheme="blue">Save</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


const AddCodeTable = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    axios.get('https://task-2zkh.onrender.com/codesnippets')
      .then(response => {
        setCodeSnippets(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // console.log("cs",codeSnippets);
  const handleRowClick = (item) => {
    setSelectedItem(item);
    setSelectedNotes(item.notes);
    onOpen();
  };

  const handleSaveNotes = async (newNotes) => {
    try {
      await axios.post(`https://task-2zkh.onrender.com/savenotes/${selectedItem.id}`, { notes: newNotes });
      console.log('Notes saved successfully');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  const totalPage = Math.ceil(codeSnippets.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, codeSnippets.length);
  const currentData = codeSnippets.slice(startIndex, endIndex);

  return (
    <Box overflowX="auto">
      <div className="go-to-dashboard">
      <button  type="button" onClick={()=>navigate('/addcode')}>
          ADD CODE
        </button>
    </div>
      <StyledTable>
        <Thead>
          <Tr>
            <StyledTh>Username</StyledTh>
            <StyledTh>Language</StyledTh>
            <StyledTh>Timestamp</StyledTh>
            <StyledTh>Notes</StyledTh>
            <StyledTh>Source Code</StyledTh>
            <StyledTh>View Details</StyledTh>
          </Tr>
        </Thead>
        <Tbody>
          {currentData.map((submission, index) => (
            <Tr key={index} >
              <StyledTd>{submission.username}</StyledTd>
              <StyledTd>{submission.language.toUpperCase()}</StyledTd>
              <StyledTd>{new Date(submission.timestamp).toLocaleString()}</StyledTd>
              <StyledTd>
                <FaStickyNote style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleRowClick(submission)}} />
              </StyledTd>
              <StyledTd>{submission.sourcecode?.substring(0, 100)}</StyledTd>
              <StyledTd>
                <Button colorScheme="blue" onClick={()=>navigate(`/addcode/${submission.id}`)}>Run Code</Button>
              </StyledTd>
            </Tr>
          ))}
        </Tbody>
      </StyledTable>
      <NotesModal isOpen={isOpen} onClose={onClose} initialNotes={selectedNotes} onSave={handleSaveNotes} PrevNotes={selectedNotes} />
      <div style={{ display: "flex", gap:'20%', margin:'2%',justifyContent: "space-between", alignItems: "center" }}>
        <Button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        <Button disabled={currentPage === totalPage - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>

    </Box>
  );
};

export default AddCodeTable;
