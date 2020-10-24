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
import Switch from '@material-ui/core/Switch';
import { useUser, useFirestoreCollectionData, useFirestore } from 'reactfire';

function Users() {
  const currentUser = useUser()
  const usersRef = useFirestore()
    .collection('users');
  const users = useFirestoreCollectionData(usersRef, {
    idField: 'id'
  });

  const handleIsAdminChange = async (user, event) => {
    const isAdmin = event.target.checked;

    await usersRef.doc(user.id).update({
      isAdmin
    })
  };

  return (
    <div>
      <Typography variant="h3" component="h1">
        Utilisateurs
      </Typography>

      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Adresse email</TableCell>
                <TableCell>Administrateur</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell> 
                
                <TableCell>
                  <Switch
                    disabled={user.id === currentUser.uid}
                    checked={user.isAdmin}
                    onChange={event => handleIsAdminChange(user, event)}
                    inputProps={{ 'aria-label': 'Est administrateur' }}
                  />
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

export default Users;
