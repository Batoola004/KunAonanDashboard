import React from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const SendBottun = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      endIcon={<SendIcon />}
      onClick={onClick}  
      sx={{
        background: 'linear-gradient(45deg, #155E5D 30%, #2CC4C2 90%)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(45deg, #D2B48C  30%, #ffffff 90%)',
        },
      }}
    >
      Send
    </Button>
  )
}

export default SendBottun;
