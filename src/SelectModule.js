import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Module({
  modules,
  fromModuleName,
  toModuleName,
  setModuleName,
  label,
}) {
  return (
    <Autocomplete
      size="small"
      disablePortal
      id="combo-box-demo"
      options={modules.filter((module) => module.api_supported)}
      getOptionLabel={(option) => option.plural_label}
      onChange={(event, value) => {
        console.log(value.api_name);
        setModuleName(value.api_name);
      }}
      disableClearable={true}
      disabled={!!fromModuleName && !!toModuleName}
      sx={{ width: "100%" }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
