import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { useFirestore } from 'reactfire';

const schema = yup.object().shape({
  name: yup.string().required()
});

function CreateTypeDialog(props) {
  const { formState, register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });
  const { isSubmitting } = formState;
  const anomalyTypesRef = useFirestore()
    .collection('anomalyTypes');

  const onSubmit = async (type) => {
    await anomalyTypesRef.add(type)
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
      <DialogTitle id="form-dialog-title">Créer un type d'anomalie</DialogTitle>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            Pour créer un nouveau type d'anomalie, vous devez saisir son nom, puis appuyer sur « Créer ».
          </DialogContentText>

          <Box mt={3}>
            <TextField autoFocus variant="outlined" label="Nom" fullWidth inputRef={register} error={!!errors.name} helperText={errors.name?.message} required name="name" id="name" />
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

export default CreateTypeDialog;
