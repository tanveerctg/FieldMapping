import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function DialogForDelete({
  dialog,
  setDialogOpen,
  text = "Do you want to delete it?",
  deleteItem,
}) {
  return (
    <Dialog
      open={dialog}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{text}</DialogTitle>

      <DialogActions>
        <Button onClick={() => setDialogOpen(false)} size="small">
          Cancel
        </Button>
        <Button onClick={deleteItem} autoFocus variant="contained" size="small">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
