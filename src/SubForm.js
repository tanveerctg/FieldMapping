import { useState, useEffect } from "react";
//Material Ui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//UUID
import { v4 as uuidv4 } from "uuid";

export default function SubForm({ subformFields }) {
  //return <div>SubForm:{JSON.stringify(subformFields)}</div>;
  const [modulesForSubForm, setModulesForSubForm] = useState([]);
  const [subforms, setSubforms] = useState([]);

  useEffect(() => {
    setModulesForSubForm(subformFields);
  }, []);

  useEffect(() => {
    subforms.forEach((subform) => {
      if (subform.to && subform.from && subform.fieldMapping.length === 0) {
        console.log("HIT API", subform.subform_id);
      }
    });
  }, [subforms]);

  return (
    <>
      {JSON.stringify({ modulesForSubForm })}
      {JSON.stringify({ subforms })}
      {/* <div>SubForm:{JSON.stringify(subformFields)}</div>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={subformFields.to}
          getOptionLabel={(option) => option.module}
          onChange={(event, value) => {
            console.log(value);
          }}
          disableClearable={true}
          // disabled={!!fromModuleName && !!toModuleName}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Select Module" />
          )}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={subformFields.to}
          getOptionLabel={(option) => option.module}
          onChange={(event, value) => {
            console.log(value);
          }}
          disableClearable={true}
          // disabled={!!fromModuleName && !!toModuleName}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Select Module" />
          )}
        />
      </Box>
      <Box sx={{ width: "28px" }} /> */}
      {subforms.map((subform, index) => (
        <Box
          sx={{
            display: "flex",
            maxWidth: "700px",
            width: "100%",
            gap: "15px",
          }}
          mt={2}
          key={index}
        >
          {" "}
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              // options={subformFields.to}
              options={modulesForSubForm.to.filter((subformModule) => {
                // is field is already found in fieldMapping then deduct those fields from options
                const isSelectedForMapping = subforms.find(
                  (mappedField) => mappedField.to === subformModule.module
                );
                if (isSelectedForMapping) {
                  return false;
                } else {
                  return true;
                }
              })}
              value={
                modulesForSubForm.to[
                  modulesForSubForm.to.findIndex(
                    (moduleSubform) => moduleSubform.module === subform.to
                  )
                ] || null
              }
              getOptionLabel={(option) => option.module}
              onChange={(event, value) => {
                console.log(value);

                const updatedSubforms = subforms.map((form) =>
                  form.subform_id === subform.subform_id
                    ? { ...form, to: value.module }
                    : form
                );
                console.log({ updatedSubforms });
                setSubforms(updatedSubforms);
              }}
              disableClearable={true}
              // disabled={!!fromModuleName && !!toModuleName}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Select Module" />
              )}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={modulesForSubForm.from.filter((subformModule) => {
                // is field is already found in fieldMapping then deduct those fields from options
                const isSelectedForMapping = subforms.find(
                  (mappedField) => mappedField.from === subformModule.module
                );
                if (isSelectedForMapping) {
                  return false;
                } else {
                  return true;
                }
              })}
              value={
                modulesForSubForm.from[
                  modulesForSubForm.from.findIndex(
                    (moduleSubform) => moduleSubform.module === subform.from
                  )
                ] || null
              }
              getOptionLabel={(option) => option.module}
              onChange={(event, value) => {
                console.log(value);

                const updatedSubforms = subforms.map((form) =>
                  form.subform_id === subform.subform_id
                    ? { ...form, from: value.module }
                    : form
                );
                console.log({ updatedSubforms });
                setSubforms(updatedSubforms);
              }}
              disableClearable={true}
              // disabled={!!fromModuleName && !!toModuleName}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Select Module" />
              )}
            />
          </Box>
          <Box>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => {
                console.log(subform.subform_id);

                const findSubform = subforms.find(
                  (form) => form.subform_id === subform.subform_id
                );
                // console.log({ findSubform });

                const filterSubforms = subforms.filter(
                  (module) => module.subform_id !== subform.subform_id
                );
                setSubforms(filterSubforms);
                console.log({ filterSubforms });
                // setModulesForSubForm(prev=>prev.filter(module=>module.subform_id!==subform.subform_id))
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          maxWidth: "700px",
          width: "100%",
          gap: "15px",
          justifyContent: "center",
        }}
        mt={2}
      >
        <Button
          onClick={() =>
            setSubforms((prev) => [
              ...prev,
              { subform_id: uuidv4(), fieldMapping: [] },
            ])
          }
          variant="outlined"
          size="small"
        >
          Add Subform
        </Button>
      </Box>
    </>
  );
}

//[{to:'name',from:'name',id:0923498i543298,fieldMapping:[]}]
