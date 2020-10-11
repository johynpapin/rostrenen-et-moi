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
import { useFirestoreCollectionData, useFirestore } from 'reactfire';
import CreateTypeDialog from '../components/CreateTypeDialog';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

function DeleteAnomalyType(props) {
  const anomalyTypeRef = useFirestore().collection('anomalyTypes').doc(props.anomalyTypeId);
  const [deleting, setDeleting] = useState();

  const deleteAnomalyType = async () => {
    setDeleting(true);
    await anomalyTypeRef.delete();
    setDeleting(false);
  };

  return (
    <LoadingButton color="secondary" variant="outlined" onClick={deleteAnomalyType} pending={deleting}>Supprimer</LoadingButton>
  );
}

function AnomalyTypes() {
  const classes = useStyles();
  const anomalyTypesRef = useFirestore()
    .collection('anomalyTypes');
  const anomalyTypes = useFirestoreCollectionData(anomalyTypesRef, {
    idField: 'id'
  });
  const [createTypeDialogOpen, setCreateTypeDialogOpen] = useState(false);

  const openCreateTypeDialog = () => {
    setCreateTypeDialogOpen(true);
  };

  const handleCreateTypeDialogClose = () => {
    setCreateTypeDialogOpen(false);
  };

  return (
    <div>
      <Typography variant="h3" component="h1">
        Types d'anomalies
      </Typography>

      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {anomalyTypes.map((anomalyType) => (
              <TableRow key={anomalyType.id}>
                <TableCell component="th" scope="row">
                  {anomalyType.name}
                </TableCell>

                <TableCell>
                  <DeleteAnomalyType anomalyTypeId={anomalyType.id} />
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Fab color="primary" aria-label="add" className={classes.fab} onClick={openCreateTypeDialog}>
        <AddIcon />
      </Fab>

      <CreateTypeDialog open={createTypeDialogOpen} onClose={handleCreateTypeDialogClose} />
    </div>
  );
}

export default AnomalyTypes;
