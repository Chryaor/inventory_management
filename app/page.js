'use client'

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Stack, Modal, TextField, Button, Autocomplete } from "@mui/material";
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
  const [searchItem, setSearchItem] = useState(null);


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
    setSearchItem(value);
  };

  const handleSearch = () => {
    if (searchItem) {
      const searchedItem = inventory.find(item => item.name === searchItem.name);
      if (searchedItem) {
        alert(`Item found: ${searchedItem.name}, Quantity: ${searchedItem.quantity}`);
      } else {
        alert('Item not found');
      }
    }
  };

  const options = inventory.map(item => ({
    title: item.name,
    firstLetter: item.name[0].toUpperCase()
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
      <Box border={'2px solid grey'} borderRadius= {1}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#00b0ff'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#fff'} textAlign={'center'}>
            Inventory
          </Typography>
          <Autocomplete
            id="search-inventory"
            color="#fff"
            options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.title}
            sx={{ width: 300, pl: 10,pr: 5 }}
            onChange={handleSearchChange}
            renderInput={(params) => <TextField {...params} label="Search Inventory" />}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            >
            Add New Item
          </Button>
        </Box>
        <Stack width="800px" height="400px" spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name)
                  }}
                >
                  Add</Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>

  )
}