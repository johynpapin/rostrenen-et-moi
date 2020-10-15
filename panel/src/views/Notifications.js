import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import LoadingButton from '@material-ui/lab/LoadingButton';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useFirestoreDocData, useFirestore } from 'reactfire';
import CreateNotificationEmailAddressDialog from '../components/CreateNotificationEmailAddressDialog';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

function DeleteNotificationEmailAddress(props) {
  const FieldValue = useFirestore.FieldValue;
  const notificationsRef = useFirestore().collection('settings').doc('notifications');
  const [deleting, setDeleting] = useState(false);

  const deleteNotificationEmailAddress = async () => {
    setDeleting(true);
    await notificationsRef.update({
      emailAddresses: FieldValue.arrayRemove(props.emailAddress)
    });
    setDeleting(false);
  };

  return (
    <LoadingButton color="secondary" variant="outlined" onClick={deleteNotificationEmailAddress} pending={deleting}>Supprimer</LoadingButton>
  );
}

function Notifications() {
  const classes = useStyles();
  const notificationsRef = useFirestore()
    .collection('settings')
    .doc('notifications');
  const notifications = useFirestoreDocData(notificationsRef);
  const emailAddresses = notifications.emailAddresses

  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const handleDialoglose = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h3" component="h1">
        Notifications
      </Typography>

      <Box mt={1}>
        <Typography>
          Un email est envoyé à toutes les adresses listées ici quand une anomalie est créée.
        </Typography>
      </Box>

      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Adresse email</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {emailAddresses.map((emailAddress) => (
              <TableRow key={emailAddress}>
                <TableCell component="th" scope="row">
                  {emailAddress}
                </TableCell>

                <TableCell>
                  <DeleteNotificationEmailAddress emailAddress={emailAddress} />
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={openDialog}>
        <AddIcon />
      </Fab>

      <CreateNotificationEmailAddressDialog open={dialogOpen} onClose={handleDialoglose} />
    </div>
  );
}

export default Notifications;
