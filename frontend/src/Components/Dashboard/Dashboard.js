import React, { useState } from 'react';
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
import { data } from './Data';
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
            defaultValue={notes}
            onChange={(value) => setNotes(value)}
          />
          <Button mt={4} onClick={handleSave} colorScheme="blue">Save</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const AddCodeTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState('');

  const handleRowClick = (item) => {
    console.log("helooo")
    setSelectedItem(item);
    console.log("item",item);
    setSelectedNotes(item.notes);
    onOpen();
  };
  const handleSaveNotes = (newNotes) => {
      // Handle saving notes here, e.g., update the data with newNotes
      console.log('Saved notes:', newNotes);
      setSelectedItem(null);
    };
    
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const totalPage = Math.ceil(data.length / pageSize);
    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const currentData = data.slice(startIndex, endIndex);
    
    console.log(currentPage);
    return (
    <Box overflowX="auto">
      <StyledTable>
        <Thead>
          <Tr>
            <StyledTh>Title</StyledTh>
            <StyledTh>Language</StyledTh>
            <StyledTh>Difficulty</StyledTh>
            <StyledTh>Timestamp</StyledTh>
            <StyledTh>Notes</StyledTh>
            <StyledTh>Tags</StyledTh>
            <StyledTh>Source Code</StyledTh>
            <StyledTh>View Details</StyledTh>
          </Tr>
        </Thead>
        <Tbody>
          {currentData.map((submission, index) => (
            <Tr key={index} >
              <StyledTd>{submission.title}</StyledTd>
              <StyledTd>{submission.preferredCodeLang}</StyledTd>
              <StyledTd>{submission.difficulty}</StyledTd>
              <StyledTd>{new Date(submission.timestamp).toLocaleString()}</StyledTd>
              <StyledTd>
                <FaStickyNote style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); handleRowClick(submission)}} />
              </StyledTd>
              <StyledTd>
                {submission.tags.map((tag, index) => (
                  <Tag key={index} colorScheme="blue" mr={2}>{tag}</Tag>
                ))}
              </StyledTd>
              <StyledTd>{submission.sourceCode.substring(0, 100)}</StyledTd>
              <StyledTd>
                <Button colorScheme="blue">View Details</Button>
              </StyledTd>
            </Tr>
          ))}
        </Tbody>
      </StyledTable>
      <NotesModal isOpen={isOpen} onClose={onClose} initialNotes={selectedNotes} onSave={handleSaveNotes} />
      <div>
        <Button disabled={currentPage === 0} onClick={() => {currentPage!=0 && setCurrentPage(currentPage - 1)}}>Previous</Button>
        <Button disabled={currentPage === totalPage - 1} onClick={() => {currentPage !=totalPage-1 && setCurrentPage(currentPage + 1)}}>Next</Button>
      </div>
    </Box>
  );
};

export default AddCodeTable;
