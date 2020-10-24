import React from 'react';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { useFirestoreCollectionData, useFirestore } from 'reactfire';

function Anomalies() {
  const anomaliesRef = useFirestore()
    .collection('anomalies');
  const anomalies = useFirestoreCollectionData(anomaliesRef, {
    idField: 'id'
  });

  return (
    <div>
      <Typography variant="h3" component="h1">
        Anomalies
      </Typography>

      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {anomalies.map((anomaly) => (
              <TableRow key={anomaly.id}>
                <TableCell component="th" scope="row">
                  {anomaly.anomalyType.name}
                </TableCell> 
                <TableCell>
                  {anomaly.address}
                </TableCell>
                <TableCell>
                  {anomaly.description}
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Anomalies;
