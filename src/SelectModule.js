import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Module({
  modules,
  fromModuleName,
  toModuleName,
  setModuleName,
  label,
  forToModule,
}) {
  // console.log("FORTOMODULE", forToModule);
  // console.log("FROMMODULENAME", fromModuleName);
  // console.log("TOMODULENAME", toModuleName);
  return (
    <Autocomplete
      size="small"
      disablePortal
      id="combo-box-demo"
      options={modules.filter((module) => module.api_supported)}
      getOptionLabel={(option) => option.plural_label}
      onChange={(event, value) => {
        setModuleName(value.api_name);
      }}
      value={
        forToModule
          ? toModuleName &&
            modules[
              modules.findIndex((field) => field.api_name === toModuleName)
            ]
          : fromModuleName &&
            modules[
              modules.findIndex((field) => field.api_name === fromModuleName)
            ]
      }
      disableClearable={true}
      disabled={!!fromModuleName && !!toModuleName}
      sx={{ width: "100%" }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
