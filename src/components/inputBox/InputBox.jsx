import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const InputBox = ({
  width = '25ch',
  label = 'Outlined secondary',
  color = 'secondary',
  boxColor = '#ffffff',
  height = 'auto',
  multiline = true,
  minRows = 1,
  maxRows = 10,
  value,
  onChange
}) => {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': {
          m: 1,
          width: width,
          minHeight: height,
          backgroundColor: boxColor,
          borderRadius: '4px',
          padding: '16px',
          overflow: 'hidden',
        }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label={label}
        color={color}
        focused
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        fullWidth
        value={value}
        onChange={onChange}
        sx={{
          backgroundColor: 'transparent',
          width: '100%',
          padding: '8px',
          '& .MuiInputLabel-root': {
            position: 'absolute',
            top: '10px',
            left: '8px',
            backgroundColor: boxColor,
            padding: '0 4px',
          },
          '& .MuiInputBase-root': {
            height: multiline ? 'auto' : '100%',
          },
        }}
      />
    </Box>
  );
};

export default InputBox;
