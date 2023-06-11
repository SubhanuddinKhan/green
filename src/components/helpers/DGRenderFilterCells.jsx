import React, { useEffect, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";

const RangeSlider = (props) => {
  const [value, setValue] = React.useState([0, 100000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        marginTop: "10px",
      }}
    >
      <Slider
        size="small"
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100000}
        step={100}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.onChangeFunction(value);
        }}
      >
        Confirm
      </Button>
    </div>
  );
};

const RenderFilterCellType = (props) => {
  const [options, setOptions] = useState([]);

  const interUpdateOptions = (value) => {
    setOptions(value);
  };

  if (!props.column) {
    return null;
  }
  if (props.column.filterType === "text") {
    return (
      <Autocomplete
        id="combo-box-demo"
        options={options}
        onChange={(e, value) => {
          if (value) props.onChange(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.column.headerName}
            variant="standard"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                props.onChange(e.target.value);
              }
            }}
            onChange={(e) => {
              if (e.target.value) {
                setOptions([]);
                props.updateOptions(e.target.value, interUpdateOptions);
              }
            }}
          />
        )}
      />
    );
  } else if (props.column.filterType === "number") {
    return <RangeSlider onChangeFunction={props.onChange} />;
  }
  //   else if (props.column.filterType === "list") {
  //     return (
  //       <Autocomplete
  //         multiple
  //         id="tags-standard"
  //         value={value}
  //         options={options}
  //         getOptionLabel={(option) => option.label}
  //         onInputChange={(e, value) => {
  //           onInputChange(e, value);
  //         }}
  //         onChange={(e, value) => {
  //           if (column.field === "article_type") {
  //             onChange(e, value);
  //           }
  //         }}
  //         renderInput={(params) => (
  //           <TextField
  //             {...params}
  //             variant="standard"
  //             label={column.headerName}
  //             placeholder={"..."}
  //           />
  //         )}
  //       />
  //     );
  //   }
  else if (props.column.filterType === "date") {
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={[
          { label: "One", value: 1 },
          { label: "Two", value: 2 },
          { label: "Three", value: 3 },
          { label: "Four", value: 4 },
        ]}
        fullWidth
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    );
  }
};

export default RenderFilterCellType;
