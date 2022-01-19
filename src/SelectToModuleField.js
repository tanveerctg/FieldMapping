//Material Ui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export default function SelectField({
  fields,
  label,
  fieldIndex,
  fieldData,
  autoSelect,
}) {
  return (
    <Box mt={2}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={fields}
        {...(fieldData?.["mandatory"] && { value: fields[fieldIndex] })}
        getOptionLabel={(option) => option.to_display_label}
        disabled={fieldData?.["mandatory"]}
        onChange={(event, value) => {
          console.log(value.api_name);
        }}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
}
