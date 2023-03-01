import React from 'react'
import './App.css'
import { getUser, relevantUserFields } from './getRandomUserAPI'
import Grid from '@mui/material/Grid'
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// Colors I liked from the OnSiteIQ homepage styles
const onSiteIQWhite = '#fff'
const onSiteIQPurple = '#680adc'
const onSiteIQCharcoal = '#1c1c1c'


function App() {
  const [user, setUser] = React.useState<relevantUserFields>(null)
  const [message, setMessage] = React.useState('')
  // In a real project I would create a type to encapsulate the specific fields and restricted Action values
  //  I expect. This is out of scope.
  const [approveHistory, setApproveHistory] = React.useState<Array<any>>([])

  const resetUser = () => {
    setMessage('')
    setUser(null)
  }

  // Pull a candidate on first render and pull a new one if user becomes null
  React.useEffect(() => {
    if (!user) {
      getUser()
        .then(setUser)
        .catch((e) => {
          // Here I'd want to log in a way that the error gets pushed to alerting/monitoring systems
          console.error(e)
        })}}, [user])

  // Pull from localStorage and parse on first render
  React.useEffect(() => {
    const histString = localStorage.getItem('approveHistory')
    //Case where it's a string containing undefined which does not JSON.parse correctly
    const hist = (!histString || histString === 'undefined')
      ? []
      : JSON.parse(histString)
    setApproveHistory(hist)
  }, [])

  // Add a new entry to history, persist to storage, and reset user to force a new one to be pulled
  const handleCandidate = (action: 'Approve' | 'Reject') => () => {
    const newEntry = {message, user, action}
    const newApproveHistory = approveHistory
      ? approveHistory.concat(newEntry)
      : [newEntry]

    setApproveHistory(newApproveHistory)
    localStorage.setItem('approveHistory', JSON.stringify(newApproveHistory))

    resetUser()
  }

  const removeHistoricalRecord = (id: number) => () => {
    const newApproveHistory = approveHistory.filter((_, i) => i !== id)

    setApproveHistory(newApproveHistory)
    localStorage.setItem('approveHistory', JSON.stringify(newApproveHistory))
  }
  const historyCols: GridColDef[] = [
    {
      field: 'undo',
      headerName: 'Undo',
      width: 100,
      editable: false,
      renderCell: (params) => (
        <Button variant='contained' onClick={removeHistoricalRecord(params.row.id)} sx={{
          color: onSiteIQWhite,
          backgroundColor: onSiteIQPurple,
          ":hover": {
            backgroundColor: onSiteIQCharcoal
          }
        }}>Undo</Button>
      )
    },
    {
      field: 'user',
      headerName: 'User Data',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <div>
          <Typography>{`${params.value.last_name}, ${params.value.first_name}`}</Typography>
          <Typography color="textSecondary">{params.value.country}</Typography>
          <Typography color="textSecondary">{params.value.email}</Typography>
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      editable: false,
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 300,
      editable: false,
    }
      ]

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
              {/*There is an opportunity here to abstract over these xs/sm/md grid item sizes with custom components, out of scope*/}
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
              <Grid item xs={3} sm={7}><TextField onChange={(event) => setMessage(event.target.value)}
                multiline className="App-comments-field" /></Grid>
              <Grid item xs={4} sm={8}><Divider /></Grid>
              <Grid item xs={1}>
                <Button variant='outlined' sx={{
                  backgroundColor: onSiteIQWhite,
                  color: onSiteIQPurple,
                  borderColor: onSiteIQPurple,
                  ":hover": {
                    color: onSiteIQCharcoal,
                    borderColor: onSiteIQCharcoal
                  }
                }} onClick={handleCandidate('Reject')}>Reject</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant='contained' sx={{
                  color: onSiteIQWhite,
                  backgroundColor: onSiteIQPurple,
                  ":hover": {
                    backgroundColor: onSiteIQCharcoal
                  }
                }} onClick={handleCandidate('Approve')}>Approve</Button>
              </Grid>
            </Grid>
            <h1>History</h1>
            <Box sx={{ height: 650, width: '100%' }}>
              <DataGrid
                rowHeight={100}
                rows={approveHistory.map((record, id) => 
                  ({...record, id}))}
                columns={historyCols}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </form>
        : <p>Loading</p>}
    </div>
  );
}

export default App
