import React from 'react';
import './App.css';
import { getUser, relevantUserFields } from './getRandomUserAPI';
import Grid from '@mui/material/Grid'
import { Button, Divider, TextField } from '@mui/material';

const onSiteIQWhite = '#fff'
const onSiteIQPurple = '#680adc'

function App() {
  const [user, setUser] = React.useState<relevantUserFields>(null)
  const [approveHistory, setApproveHistory] = React.useState<Array<any>>()

  const resetUser = () => setUser(null)

  React.useEffect(() => {
    if (!user) {
      getUser()
        .then(setUser)}}, [user])

  React.useEffect(() => {
    const histString = localStorage.getItem('approveHistory')
    //Case where it's a string containing undefined which does not JSON.parse correctly
    const hist = (!histString || histString === 'undefined')
      ? []
      : JSON.parse(histString)
    setApproveHistory(hist)
  }, [])

  const handleCandidate = (action: 'Approve' | 'Reject') => () => {

    const newEntry = {message: '', user, action}
    const newApproveHistory = approveHistory
      ? approveHistory.concat(newEntry)
      : [newEntry]

    setApproveHistory(newApproveHistory)
    localStorage.setItem('approveHistory', JSON.stringify(newApproveHistory))

    resetUser()
  }

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
                <Button variant='outlined' sx={{
                  backgroundColor: onSiteIQWhite,
                  color: onSiteIQPurple,
                  borderColor: onSiteIQPurple
                }} onClick={handleCandidate('Reject')}>Reject</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant='contained' sx={{
                  color: onSiteIQWhite,
                  backgroundColor: onSiteIQPurple
                }} onClick={handleCandidate('Approve')}>Approve</Button>
              </Grid>
            </Grid>
            {JSON.stringify(approveHistory)}
          </form>
        : <p>Loading</p>}
    </div>
  );
}

export default App;
