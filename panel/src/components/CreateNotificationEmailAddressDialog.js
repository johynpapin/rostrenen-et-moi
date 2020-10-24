import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFirestore } from 'reactfire';

const schema = yup.object().shape({
  email: yup.string().email().required()
});

function CreateNotificationEmailAddressDialog(props) {
  const { formState, register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });
  const { isSubmitting } = formState;
  const FieldValue = useFirestore.FieldValue;
  const notificationsRef = useFirestore()
    .collection('settings')
    .doc('notifications');

  const onSubmit = async ({ email }) => {
    await notificationsRef.update({
      emailAddresses: FieldValue.arrayUnion(email)
    })
    props.onClose()
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ajouter une adresse email</DialogTitle>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box>
            <TextField autoFocus variant="outlined" label="Adresse email" type="email" fullWidth inputRef={register} error={!!errors.email} helperText={errors.email?.message} required name="email" id="email" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={props.onClose}>Annuler</Button>
          <LoadingButton type="submit" pending={isSubmitting}>Créer</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateNotificationEmailAddressDialog;
