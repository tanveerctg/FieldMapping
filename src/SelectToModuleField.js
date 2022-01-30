//Material Ui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function SelectToModuleField({
  fields,
  label,
  fieldIndex,
  fieldData,
  setFieldMapping,
  fieldMapping,
}) {
  return (
    // <Box mt={2}>
    <Autocomplete
      size="small"
      disablePortal
      id="combo-box-demo"
      options={fields.filter((field) => {
        // is field is already found in fieldMapping then deduct those fields from options
        const isSelectedForMapping = fieldMapping.find(
          (mappedField) => mappedField?.to?.api_name === field.api_name
        );
        if (isSelectedForMapping) {
          return false;
        } else {
          return true;
        }
      })}
      value={
        fieldData?.["mandatory"]
          ? fields[
              fieldMapping.findIndex(
                (field) => field.to.api_name === fieldData?.to?.api_name
              )
            ]
          : fields.find((field) => field.api_name === fieldData?.to?.api_name)
          ? fields[
              fields.findIndex(
                (field) => field.api_name === fieldData?.to?.api_name
              )
            ]
          : null
      }
      getOptionLabel={(option) =>
        fieldData?.["mandatory"]
          ? option.to.display_label
          : option.display_label
      }
      disabled={fieldData?.["mandatory"]}
      disableClearable={true}
      onChange={setFieldMapping}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
    // </Box>
  );
}
