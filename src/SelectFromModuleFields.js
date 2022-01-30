import React, { useState, useRef, useEffect } from "react";

import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import getCaretCorordinate from "./getCaretCorordinate";

export default function SelectFromModuleFields({
  fields,
  fieldData,
  setFieldMapping,
  allowedTypes,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [textareaValue, setTextAreaValue] = useState(fieldData.from || "");

  const popOverRef = useRef();
  const textFieldRef = useRef();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // set text to from fields in fieldmapping
    setFieldMapping(textareaValue);
  }, [textareaValue]);

  return (
    <>
      <TextField
        id="outlined-multiline-static"
        placeholder="Select Fields"
        variant="outlined"
        multiline
        rows={1}
        size="small"
        style={{ width: "100%" }}
        disabled={!fieldData.to}
        aria-describedby={id}
        inputRef={textFieldRef}
        value={fieldData.from}
        onChange={(e) => {
          allowedTypes[fieldData?.to?.data_type] &&
            setTextAreaValue(e.target.value);
        }}
        onKeyPress={(event) => {
          const grabKeycodeOfLastLetter = event.which || event.keyCode;
          if (grabKeycodeOfLastLetter === 35) {
            handlePopoverOpen(event);

            //We need to delay to open the popover in order order to calculate the width of the popover
            setTimeout(() => {
              var coordinates = getCaretCorordinate(
                event.target,
                event.target.selectionEnd,
                {
                  debug: true,
                }
              );
              const windowouterWidth = window.outerWidth;

              let popOverWidth =
                popOverRef.current.querySelector(
                  ".MuiPopover-paper"
                ).clientWidth;

              //popOver position
              let left;
              let top =
                (
                  document.documentElement ||
                  document.body.parentNode ||
                  document.body
                ).scrollTop + coordinates.top;
              const isThereRoomForPopoverWidth =
                windowouterWidth > popOverWidth;

              // is there space to show popover then show popover next to the letter otherwise deduct the popover width from left(const)
              if (isThereRoomForPopoverWidth) {
                left =
                  event.target.offsetLeft -
                  event.target.scrollLeft +
                  coordinates.left +
                  14;
              } else {
                left =
                  event.target.offsetLeft -
                  event.target.scrollLeft +
                  coordinates.left +
                  14 -
                  popOverWidth;
              }

              setTop(top);
              setLeft(left);
            }, 10);
          }
        }}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        ref={popOverRef}
        style={{
          position: "absolute",
          top: `${
            window.pageYOffset + 40 ||
            (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop + 40
          }px`,
          left: `${left - 10}px`,
          padding: "20px",
          height: "100%",
        }}
      >
        <Autocomplete
          size="small"
          options={fields}
          // {...(fieldData?.["mandatory"] && { value: fields[fieldIndex] })}
          getOptionLabel={(option) => option.display_label}
          // disabled={fieldData?.["mandatory"]}
          sx={{ width: 300, padding: "10px" }}
          disableClearable={true}
          onChange={(e, value) => {
            // setSelectedField(e.target.textContent);
            console.log({ value: value.api_name });
            var start = textFieldRef.current.selectionStart,
              end = textFieldRef.current.selectionEnd;

            //if data_type is not text
            if (fieldData?.to?.data_type !== "text") {
              const isThereAnyKeyword = /\$\{.+\}/.test(textareaValue);
              console.log({ isThereAnyKeyword });
              let newText;
              // if any keyword found then replace it
              if (isThereAnyKeyword) {
                newText = textareaValue.replace(
                  /\$\{.+\}/,
                  "$" + "{" + value.api_name + "}"
                );
                console.log({ newText });
                setTextAreaValue(newText);
                handlePopoverClose();
                return;
              }
            }

            setTextAreaValue(
              (prevValue) =>
                prevValue.slice(0, start) +
                "$" +
                "{" +
                value.api_name +
                "}" +
                prevValue.slice(end)
            );
            handlePopoverClose();
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Fields" />
          )}
        />
      </Popover>
    </>
  );
}
