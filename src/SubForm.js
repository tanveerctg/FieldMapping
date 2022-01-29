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

import getModuleFields from "./getModuleFields";
import SelectToModuleField from "./SelectToModuleField";
import SelectFromModuleFields from "./SelectFromModuleFields";

export default function SubForm({ subformFields }) {
  //return <div>SubForm:{JSON.stringify(subformFields)}</div>;
  const [modulesForSubForm, setModulesForSubForm] = useState([]);
  const [subforms, setSubforms] = useState([]);

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
    <>
      {/* {JSON.stringify({ modulesForSubForm })} */}
      {JSON.stringify({
        subforms: subforms.map((subform) => subform.fieldMapping),
      })}
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
        <Box sx={{ width: "100%" }} key={subform.subform_id}>
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
                    // setFieldMapping((prev) =>
                    //   prev.map((mappedField) => {
                    //     if (mappedField.id !== field.id) {
                    //       return mappedField;
                    //     } else {
                    //       return {
                    //         ...mappedField,
                    //         to: {
                    //           api_name: value.api_name,
                    //           data_type: value.data_type,
                    //           display_label: value.display_label,
                    //         },
                    //       };
                    //     }
                    //   })
                    // );

                    // update fieldMapping of that specific subform
                    // const subformId = subform.subform_id;
                    // const fieldId = mappedField.id;
                    // const field = mappedField;
                    // const fieldMapping = subform.fieldMapping;

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
                            // toModuleName: form.toModuleName,
                            // fromModuleName: form.fromModuleName,
                            // fromModuleFields: form.fromModuleFields,
                            // toModuleFields: form.toModuleFields,
                          };
                        } else {
                          return form;
                        }
                      })
                    );

                    // setFieldMapping((prev) =>
                    //   prev.map((mappedField) => {
                    //     if (mappedField.id !== field.id) {
                    //       return mappedField;
                    //     } else {
                    //       return { ...mappedField, from: textareaValue };
                    //     }
                    //   })
                    // );
                  }}
                />
              </Box>
              {/* {!mappedField.mandatory ? (
                <Box>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setDeleteFieldId(field.id);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ width: "28px" }} />
              )}  */}
            </Box>
          ))}

          {subform?.toModuleName && subform?.fromModuleName && (
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
            >
              Add Field
            </Button>
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
        >
          Add Subform
        </Button>
      </Box>
    </>
  );
}

//[{to:'name',from:'name',id:0923498i543298,fieldMapping:[]}]
