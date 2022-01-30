import { useEffect, useState, createRef, useMemo } from "react";

//Material Ui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
//UUID
import { v4 as uuidv4 } from "uuid";

import getAllModules from "./getAllModules";
import getModuleFields from "./getModuleFields";
import SelectModule from "./SelectModule";
import SelectToModuleField from "./SelectToModuleField";
import SelectFromModuleFields from "./SelectFromModuleFields";
import SubForm from "./SubForm";
import handleAutoMapping from "./handleAutoMapping";
import { prettyPrintJson } from "pretty-print-json";

import "./App.css";
import DialogForDelete from "./DialogForDelete";

function App() {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [fromModuleName, setFromModuleName] = useState(null);
  const [toModuleName, setToModuleName] = useState(null);
  const [error, setError] = useState("");
  const [fromModuleFields, setFromModuleFields] = useState([]);
  const [toModuleFields, setToModuleFields] = useState([]);
  const [fieldMapping, setFieldMapping] = useState([]);
  const [deleteFieldId, setDeleteFieldId] = useState(null);
  const [shouldSubformAdd, setShouldSubformAdd] = useState(false);
  const [subformFields, setSubformFields] = useState({ to: [], from: [] });
  const [allowedTypes, setAllowedTypes] = useState({ text: true });
  const [dialogForField, setDialogForField] = useState(false);
  const [formattedJson, setFormattedJson] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const ZOHO = await window.ZOHO;
        /*
         * Subscribe to the EmbeddedApp onPageLoad event before initializing
         */
        await ZOHO.embeddedApp.on("PageLoad");
        /*
         * initializing the widget.
         */
        await ZOHO.embeddedApp.init();

        setLoading(true);
        const modules = await getAllModules();
        // const getContactFields = await getModuleFields("Contacts");
        console.log({ modules });
        setModules(modules);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (fromModuleName && toModuleName) {
      //Fetch module fields
      (async () => {
        const fromModuleFields = await getModuleFields(fromModuleName);
        const toModuleFields = await getModuleFields(toModuleName);
        console.log({ fromModuleName, toModuleName });

        const subformOfFromModule = fromModuleFields.flatMap((field) =>
          field.subform ? [field.subform] : []
        );
        const subformOfToModule = toModuleFields.flatMap((field) =>
          field.subform ? [field.subform] : []
        );
        console.log({ subformOfFromModule, subformOfToModule });
        //if both module has subform fields then we can add subform
        if (subformOfToModule.length > 0 && subformOfFromModule.length > 0) {
          setSubformFields({
            to: subformOfFromModule,
            from: subformOfFromModule,
          });
          setShouldSubformAdd(true);
        }

        setFromModuleFields(fromModuleFields);
        setToModuleFields(toModuleFields);

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
        // setMandatoryFields(mandatoryFields);
        setFieldMapping((prev) => [...prev, ...mandatoryFields]);
      })();
    }
  }, [fromModuleName, toModuleName]);

  //any error found while calling zoho apis then show error
  if (error) {
    return <div>{error}</div>;
  }

  //show loader while modules is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  const subform = createRef();
  // console.log({ toModuleFields, fromModuleFields });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        maxWidth: "700px",
        width: "100%",
        margin: "0 auto",
      }}
      p={2}
    >
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<DownloadIcon />}
        sx={{ alignSelf: "flex-end" }}
        disabled={!fromModuleName || !toModuleName}
        onClick={() => {
          console.log({
            mainModule: {
              fieldMapping,
              toModuleName,
              fromModuleName,
            },
          });
          const formattedJson = {
            mainModule: {
              fieldMapping,
              toModuleName,
              fromModuleName,
            },
            subforms: subform.current,
          };
          setFormattedJson(formattedJson);
          console.log(formattedJson);
        }}
      >
        Get JSON
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          const autoMappedFields = handleAutoMapping({
            toModuleFields,
            fromModuleFields,
            fieldMapping,
          });
          setFieldMapping(autoMappedFields);
        }}
        size="small"
      >
        Auto Mapping
      </Button>

      <Box
        sx={{ display: "flex", maxWidth: "700px", width: "100%", gap: "15px" }}
      >
        <h2 style={{ width: "50%" }}>To</h2>
        <h2 style={{ width: "50%" }}>From</h2>
        <Box sx={{ width: "28px" }} />
      </Box>
      <Box
        sx={{ display: "flex", maxWidth: "700px", width: "100%", gap: "15px" }}
      >
        <Box sx={{ flex: 1 }}>
          <SelectModule
            modules={modules}
            fromModuleName={fromModuleName}
            toModuleName={toModuleName}
            setModuleName={setToModuleName}
            label="Select Module Name"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <SelectModule
            modules={modules}
            fromModuleName={fromModuleName}
            toModuleName={toModuleName}
            setModuleName={setFromModuleName}
            label="Select Module Name"
          />
        </Box>
        <Box sx={{ width: "28px" }} />
      </Box>

      {fieldMapping.map((field, index) => (
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
              fields={field.mandatory ? fieldMapping : toModuleFields}
              label="Select Field"
              fieldIndex={index}
              fieldData={field}
              setFieldMapping={(event, value) => {
                // set text to from fields in fieldmapping

                setFieldMapping((prev) =>
                  prev.map((mappedField) => {
                    if (mappedField.id !== field.id) {
                      return mappedField;
                    } else {
                      return {
                        ...mappedField,
                        to: {
                          api_name: value.api_name,
                          data_type: value.data_type,
                          display_label: value.display_label,
                        },
                      };
                    }
                  })
                );
              }}
              fieldMapping={fieldMapping}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <SelectFromModuleFields
              fields={fromModuleFields.filter(
                (moduleField) => moduleField.data_type === field?.to?.data_type
              )}
              fieldData={field}
              allowedTypes={allowedTypes}
              setFieldMapping={(textareaValue) => {
                setFieldMapping((prev) =>
                  prev.map((mappedField) => {
                    if (mappedField.id !== field.id) {
                      return mappedField;
                    } else {
                      return { ...mappedField, from: textareaValue };
                    }
                  })
                );
              }}
            />
          </Box>
          {!field.mandatory ? (
            <Box>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => {
                  const filteredFieldMapping = fieldMapping.filter(
                    (mappedField) => mappedField.id !== field.id
                  );
                  setFieldMapping(filteredFieldMapping);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ width: "28px" }} />
          )}
        </Box>
      ))}

      {toModuleName && fromModuleName && (
        <Box mt={2}>
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              setFieldMapping((prev) => [
                ...prev,
                { id: uuidv4(), mandatory: false, to: null, from: null },
              ])
            }
          >
            Add Field
          </Button>
        </Box>
      )}
      {shouldSubformAdd && (
        <SubForm subformFields={subformFields} ref={subform} />
      )}
      {JSON.stringify(formattedJson)}
    </Box>
  );
}

export default App;
