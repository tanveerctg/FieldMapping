import { useState, useEffect, useRef, forwardRef } from "react";
//Material Ui
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

//UUID
import { v4 as uuidv4 } from "uuid";

import getModuleFields from "./getModuleFields";
import SelectToModuleField from "./SelectToModuleField";
import SelectFromModuleFields from "./SelectFromModuleFields";
import DialogForDelete from "./DialogForDelete";

const SubForm = forwardRef(({ subformFields }, ref) => {
  //return <div>SubForm:{JSON.stringify(subformFields)}</div>;
  const [modulesForSubForm, setModulesForSubForm] = useState([]);
  const [subforms, setSubforms] = useState([]);
  const [allowedTypes, setAllowedTypes] = useState({ text: true });
  const [dialogForSubform, setDialogForSubform] = useState(false);
  const [dialogForField, setDialogForField] = useState(false);

  // const getSubformFieldData = () => {
  //   return subforms.map((subform) => subform.fieldMapping);
  // };

  ref.current = subforms.map((subform) => ({
    fieldMapping: subform.fieldMapping,
    toModuleName: subform.toModuleName,
    fromModuleName: subform.fromModuleName,
  }));

  useEffect(() => {
    setModulesForSubForm(subformFields);
  }, []);

  useEffect(() => {
    console.log("SUBFORM");
    subforms.forEach(async (subform) => {
      if (
        subform.toModuleName &&
        subform.fromModuleName &&
        subform.fieldMapping.length === 0
      ) {
        console.log("HIT API", subform.subform_id);
        // const [fromModuleFields, setFromModuleFields] = useState([]);
        // const [toModuleFields, setToModuleFields] = useState([]);
        const fromModuleFields = await getModuleFields(subform.fromModuleName);
        const toModuleFields = await getModuleFields(subform.toModuleName);

        //Get To Module Field's mandatory fields
        const mandatoryFields = toModuleFields
          .filter((field) => field.system_mandatory)
          .map((field) => ({
            id: field.id,
            to: {
              api_name: field.api_name,
              data_type: field.data_type,
              display_label: field.display_label,
            },
            from: null,
            mandatory: true,
          }));
        console.log({ mandatoryFields, toModuleFields });

        //add mandatoryFields to fieldMapping
        setSubforms((prevSubform) =>
          prevSubform.map((form) => {
            if (form.subform_id === subform.subform_id) {
              return {
                ...form,
                fieldMapping: [...form.fieldMapping, ...mandatoryFields],
                fromModuleFields,
                toModuleFields,
              };
            } else {
              return form;
            }
          })
        );
      }
    });
  }, [subforms]);

  return (
    <Box mt={4} sx={{ width: "100%" }}>
      {/* {JSON.stringify({ modulesForSubForm })} */}
      {/* {JSON.stringify(ref.current)} */}
      {/* {JSON.stringify({
        subforms: subforms,
      })} */}

      {subforms.map((subform, index) => (
        <Box
          sx={{ width: "100%", background: "#f8f8f8" }}
          mb={3}
          p={2}
          key={subform.subform_id}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" gutterBottom component="div">
              Subform-{index + 1}
            </Typography>
            <Tooltip title="Delete Subform">
              <Box>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => {
                    // console.log(subform.subform_id);

                    // const filterSubforms = subforms.filter(
                    //   (module) => module.subform_id !== subform.subform_id
                    // );
                    // setSubforms(filterSubforms);
                    // console.log({ filterSubforms });
                    setDialogForSubform(true);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
                <DialogForDelete
                  dialog={dialogForSubform}
                  setDialogOpen={setDialogForSubform}
                  text="Do you want to delete this subform?"
                  deleteItem={() => {
                    console.log(subform.subform_id);

                    const filterSubforms = subforms.filter(
                      (module) => module.subform_id !== subform.subform_id
                    );
                    setSubforms(filterSubforms);
                    setDialogForSubform(false);
                    console.log({ filterSubforms });
                  }}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "15px",
            }}
            mt={2}
            key={index}
          >
            {" "}
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                // options={subformFields.to}
                options={modulesForSubForm.to.filter((subformModule) => {
                  // is field is already found in fieldMapping then deduct those fields from options
                  const isSelectedForMapping = subforms.find(
                    (mappedField) =>
                      mappedField.toModuleName === subformModule.module
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
                      (moduleSubform) =>
                        moduleSubform.module === subform.toModuleName
                    )
                  ] || null
                }
                getOptionLabel={(option) => option.module}
                onChange={(event, value) => {
                  const updatedSubforms = subforms.map((form) =>
                    form.subform_id === subform.subform_id
                      ? { ...form, toModuleName: value.module }
                      : form
                  );

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
                size="small"
                disablePortal
                id="combo-box-demo"
                options={modulesForSubForm.from.filter((subformModule) => {
                  // is field is already found in fieldMapping then deduct those fields from options
                  const isSelectedForMapping = subforms.find(
                    (mappedField) =>
                      mappedField.fromModuleName === subformModule.module
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
                      (moduleSubform) =>
                        moduleSubform.module === subform.fromModuleName
                    )
                  ] || null
                }
                getOptionLabel={(option) => option.module}
                onChange={(event, value) => {
                  console.log(value);

                  const updatedSubforms = subforms.map((form) =>
                    form.subform_id === subform.subform_id
                      ? { ...form, fromModuleName: value.module }
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
            <Box sx={{ width: "28px" }} />
          </Box>

          {subform.fieldMapping.map((mappedField, index) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: "700px",
                width: "100%",
                gap: "15px",
              }}
              mt={2}
              key={index}
            >
              <Box sx={{ flex: 1 }}>
                <SelectToModuleField
                  fields={
                    mappedField.mandatory
                      ? subform.fieldMapping
                      : subform.toModuleFields
                  }
                  label="Select Field"
                  fieldIndex={index}
                  fieldData={mappedField}
                  setFieldMapping={(event, value) => {
                    // set text to from fields in fieldmapping

                    const updatedFieldMapping = subform.fieldMapping.map(
                      (field) => {
                        console.log(mappedField.id === field.id);
                        if (mappedField.id === field.id) {
                          mappedField.to = {
                            api_name: value.api_name,
                            data_type: value.data_type,
                            display_label: value.display_label,
                          };
                          return mappedField;
                        } else {
                          return field;
                        }
                      }
                    );

                    console.log({ updatedFieldMapping });

                    setSubforms((prevSubform) =>
                      prevSubform.map((form) => {
                        if (form.subform_id === subform.subform_id) {
                          return {
                            ...form,
                            fieldMapping: updatedFieldMapping,
                            toModuleName: form.toModuleName,
                            fromModuleName: form.fromModuleName,
                            fromModuleFields: form.fromModuleFields,
                            toModuleFields: form.toModuleFields,
                          };
                        } else {
                          return form;
                        }
                      })
                    );

                    console.log({ value });
                  }}
                  fieldMapping={subform.fieldMapping}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <SelectFromModuleFields
                  fields={subform?.fromModuleFields.filter(
                    (moduleField) =>
                      moduleField.data_type === mappedField?.to?.data_type
                  )}
                  fieldData={mappedField}
                  allowedTypes={allowedTypes}
                  setFieldMapping={(textareaValue) => {
                    const updatedFieldMapping = subform.fieldMapping.map(
                      (field) => {
                        console.log(mappedField.id === field.id);
                        if (mappedField.id === field.id) {
                          mappedField.from = textareaValue;
                          return mappedField;
                        } else {
                          return field;
                        }
                      }
                    );

                    console.log({ updatedFieldMapping });

                    setSubforms((prevSubform) =>
                      prevSubform.map((form) => {
                        if (form.subform_id === subform.subform_id) {
                          return {
                            ...form,
                            fieldMapping: updatedFieldMapping,
                          };
                        } else {
                          return form;
                        }
                      })
                    );
                  }}
                />
              </Box>
              {!mappedField.mandatory ? (
                <Box>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setDialogForField(true);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                  <DialogForDelete
                    dialog={dialogForField}
                    setDialogOpen={setDialogForField}
                    text="Do you want to delete this field?"
                    deleteItem={() => {
                      const filteredFieldMapping = subform.fieldMapping.filter(
                        (field) => {
                          return mappedField.id !== field.id;
                        }
                      );

                      setSubforms((prevSubform) =>
                        prevSubform.map((form) => {
                          if (form.subform_id === subform.subform_id) {
                            return {
                              ...form,
                              fieldMapping: filteredFieldMapping,
                            };
                          } else {
                            return form;
                          }
                        })
                      );
                      setDialogForField(false);
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ width: "28px" }} />
              )}
            </Box>
          ))}

          {subform?.toModuleName && subform?.fromModuleName && (
            <Box mt={2}>
              <Button
                onClick={() => {
                  //add field to that specific subform
                  setSubforms((prevSubform) =>
                    prevSubform.map((form) => {
                      if (form.subform_id === subform.subform_id) {
                        return {
                          ...form,
                          fieldMapping: [
                            ...form.fieldMapping,
                            {
                              id: uuidv4(),
                              mandatory: false,
                              to: null,
                              from: "",
                              // fromModuleFields:subform.fieldMapping,
                              // toModuleFields,
                            },
                          ],
                          toModuleName: form.toModuleName,
                          fromModuleName: form.fromModuleName,
                          fromModuleFields: form.fromModuleFields,
                          toModuleFields: form.toModuleFields,
                        };
                      } else {
                        return form;
                      }
                    })
                  );
                }}
                variant="contained"
                size="small"
              >
                Add Field
              </Button>
            </Box>
          )}
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
          color="error"
        >
          Add Subform
        </Button>
      </Box>
    </Box>
  );
});
//[{to:'name',from:'name',id:0923498i543298,fieldMapping:[]}]
export default SubForm;
