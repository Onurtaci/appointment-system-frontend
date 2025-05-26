import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import type { NoteEditorProps } from "../types/appointment.types";

export const NoteEditor = memo(
  ({ initialValue, onSave, onCancel, isSaving, error }: NoteEditorProps) => {
    const [localValue, setLocalValue] = useState(initialValue);

    useEffect(() => {
      setLocalValue(initialValue);
    }, [initialValue]);

    return (
      <Box sx={{ mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <TextField
          multiline
          rows={4}
          fullWidth
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Enter medical notes here..."
          variant="outlined"
          size="small"
          disabled={isSaving}
          sx={{ mb: 1 }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button size="small" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => onSave(localValue)}
            disabled={isSaving || !localValue.trim()}
            startIcon={isSaving ? <CircularProgress size={16} /> : null}
          >
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </Box>
      </Box>
    );
  }
);

NoteEditor.displayName = "NoteEditor";
