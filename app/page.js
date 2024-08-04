'use client'
import Image from 'next/image';
import Icon from '../public/inventory.svg';
import bgi from '../public/colorful-stingrayss.svg';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box, Typography, Stack, Modal, TextField, Button, Autocomplete, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('');


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }
  const handleSearchChange = (event, value) => {
    if (value) {
      const selectedItem = inventory.find((item) => item.name === value.title);
      if (selectedItem) {
        alert(`Item found: ${selectedItem.name}, Quantity: ${selectedItem.quantity}`);
      } else {
        alert('Item not found');
      }
    }
  };

  const options = inventory.map((item) => ({
    title: item.name,
    firstLetter: item.name[0].toUpperCase(),
    quantity: item.quantity,
  }));
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (

    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      sx={{
        background: `url(${bgi.src}) center / cover`
      }}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button> */}
      <Box border={'2.2px solid grey'} height={'500px'} bgcolor={'#fffcfc'} borderRadius={1}>
        <Box
          width="1000px"
          height="100px"
          bgcolor={'#90caf9'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        ><Image src={Icon} alt="Inventory shop" width={50} height={50} />
          <Typography variant={'h2'} color={'#333'} textAlign={'center'} sx={{ pl: 2 }}>
            Inventory List
          </Typography>
          <Autocomplete
            id="search-inventory"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 350, pl: 8, pr: 2 }}
            onChange={(event, value) => handleSearchChange(event, value)}
            renderInput={(params) => <TextField {...params} label="Search Inventory" />}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1.75rem', fontWeight: 'bold' }}  align="center">Item Name</TableCell>
                <TableCell sx={{ fontSize: '1.75rem' , fontWeight: 'bold', }} align="center">Quantity</TableCell>
                <TableCell sx={{ fontSize: '1.75rem' , fontWeight: 'bold',}} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map(({ name, quantity }) => (
                <TableRow key={name}>
                  <TableCell sx={{ fontSize: '1.50rem' }} align="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.50rem' }} align="center">{quantity}</TableCell>
                  <TableCell sx={{ fontSize: '1.50rem' }} align="center">
                    <Box display="flex" justifyContent="center" gap={2}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          addItem(name);
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          removeItem(name);
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>

  )
}