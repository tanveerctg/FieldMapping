import { useEffect, useState } from "react";

//Material Ui
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
//UUID
import { v4 as uuidv4 } from "uuid";

import getAllModules from "./getAllModules";
import getModuleFields from "./getModuleFields";
import SelectModule from "./SelectModule";
import SelectToModuleField from "./SelectToModuleField";
import SelectFromModuleFields from "./SelectFromModuleFields";
import SubForm from "./SubForm";
import handleAutoMapping from "./handleAutoMapping";

import "./App.css";

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
    const filtered = fieldMapping.filter(
      (mappedField) => mappedField.id !== deleteFieldId
    );
    setTimeout(() => {
      setFieldMapping(filtered);
    }, 100);
    console.log({ filtered });
  }, [deleteFieldId]);

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

        //fieldMapping
        // [
        //   {
        //    id:"23123213",
        //    from:"deal_name",
        //    to:{"api_name":"Last_Name","data_type":"text","display_label":"Last Name"},
        //    mandatory:true,
        //   }
        // ]
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

  console.log({ toModuleFields, fromModuleFields });
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
    >
      {/* {JSON.stringify(fieldMapping)} */}
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
      >
        Auto Mapping
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        mb={2}
      >
        <Box sx={{ flex: 1 }}>
          <h2>To</h2>

          <SelectModule
            modules={modules}
            fromModuleName={fromModuleName}
            toModuleName={toModuleName}
            setModuleName={setToModuleName}
            label="Select Module Name"
          />

          {fieldMapping.map((field, index) => (
            <Box mt={2} key={field.id}>
              <SelectToModuleField
                fields={field.mandatory ? fieldMapping : toModuleFields}
                label="Select Field"
                fieldIndex={index}
                fieldData={field}
                setFieldMapping={setFieldMapping}
                fieldMapping={fieldMapping}
              />
            </Box>
          ))}
        </Box>

        <Box ml={2} sx={{ flex: 1 }}>
          <h2>From</h2>
          <Box sx={{ display: "flex" }}>
            <SelectModule
              modules={modules}
              fromModuleName={fromModuleName}
              toModuleName={toModuleName}
              setModuleName={setFromModuleName}
              label="Select Module Name"
            />
            <Box sx={{ width: "36px" }} />
          </Box>
          {fieldMapping.map((field) => (
            <Box
              mt={2}
              sx={{ display: "flex", alignItems: "center" }}
              key={field.id}
            >
              <Box sx={{ flex: 1 }}>
                <SelectFromModuleFields
                  fields={fromModuleFields.filter(
                    (moduleField) =>
                      moduleField.data_type === field?.to?.data_type
                  )}
                  fieldData={field}
                  setFieldMapping={setFieldMapping}
                />
              </Box>
              {!field.mandatory ? (
                <Box ml={1}>
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
                <Box sx={{ width: "36px" }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
      {toModuleName && fromModuleName && (
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
      )}
      {shouldSubformAdd && <SubForm subformFields={subformFields} />}
    </Box>
  );
}

export default App;
