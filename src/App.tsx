import React from 'react';
import './App.css';
import { getUser, relevantUserFields } from './getRandomUserAPI';
import Grid from '@mui/material/Grid'
import { Button, Divider, TextField } from '@mui/material';

function App() {
  const [user, setUser] = React.useState<relevantUserFields>(null)

  //const resetUser = setUser(null)

  React.useEffect(() => {
    if (!user) {
      getUser()
        .then(setUser)}}, [user])

  return (
    <div className="App">
      <header className="App-header">
        Candidate Review Page
      </header>
      {(user)
        ? <form className="App-form">
            <h1>Candidate Data</h1>
            <img src={user.picture} alt={'User Avatar'} />
            <Grid container spacing={{ xs: 0, md: 0 }} columns={{ xs: 4, sm: 8, md: 8 }}>
              {/*There is an opportunity here to abstract over these xs/sm/md grid item sizes, out of scope*/}
              <Grid item xs={1}>Name:</Grid>
              <Grid item xs={3}>{`${user.last_name}, ${user.first_name}`}</Grid>
              <Grid item xs={1}>Country:</Grid>
              <Grid item xs={3}>{user.country}</Grid>
              <Grid item xs={1}>Postcode:</Grid>
              <Grid item xs={3}>{user.postcode}</Grid>
              <Grid item xs={1}>Email:</Grid>
              <Grid item xs={3}>{user.email}</Grid>
              <Grid item xs={1}>Phone:</Grid>
              <Grid item xs={3}>{user.phone}</Grid>
              <Grid item xs={1}>Cell:</Grid>
              <Grid item xs={3}>{user.cell}</Grid>
              <Grid item xs={1}>Comments:</Grid>
              <Grid item xs={3} sm={7}><TextField multiline className="App-comments-field" /></Grid>
              <Grid item xs={4} sm={8}><Divider /></Grid>
              <Grid item xs={1}>
                <Button variant='outlined'>Reject</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant='contained'>Approve</Button>
              </Grid>
            </Grid>
          </form>
        : <p>Loading</p>}
    </div>
  );
}

export default App;
