import { Alert, Snackbar } from '@mui/material';

const Notifications = ({ open, setOpen, error, severity }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={severity} variant="outlined">
                {error}
            </Alert>
        </Snackbar >
    )
}

export default Notifications
