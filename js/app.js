$(function () {
  // Fill in your firebase project's information below:
  const firebaseConfig = {
    apiKey: 'your_api_key',
    authDomain: 'your_project_id.firebaseapp.com',
    databaseURL: 'https://your_database_name.firebaseio.com',
    storageBucket: 'your_bucket_name.appspot.com'
  }

  // Initialize firebase application with
  // config object above

  firebase.initializeApp(firebaseConfig)

  // Firebase API - Create a reference to "song" node in
  // your firebase database
  const dbReferenceSongs = firebase.database().ref().child('songs')
  console.log(dbReferenceSongs)

  // -------- **CREATE** ---------

  // listen for submit event on Add New Song form
  $('#song-form').submit((event) => {
    event.preventDefault()
    console.log($('#song-name').val())
    console.log($('#artist-name').val())

    // Firebase API - Add new song using .push()
    dbReferenceSongs.push({
      songName: $('#song-name').val(),
      artistName: $('#artist-name').val()
    })

    clearAddFormFields()
  })

  // -------- **READ** ---------

  // Firebase API - listen for a
  // "child_added" event which
  // will be called for every new child added
  // to our "songs" node
  dbReferenceSongs.on('child_added', (snapshot) => {
    console.log('child_added', snapshot.val())
    console.log('child_added', snapshot.key)

    const songId = snapshot.key
    const songName = snapshot.val().songName
    const artistName = snapshot.val().artistName

    const playlistItemHtml = buildSongItemHtml(songName, artistName)

    $('.songs')
      .append(
        `<div class="song" id="${songId}">
          ${playlistItemHtml}
        </div>`
      )
  })

  // -------- **UPDATE** ---------

  // listen for click event on the "edit" button
  $('body').on('click', 'button.edit-song', (event) => {
    const selectedSongId = $(event.currentTarget).parent().parent().attr('id')
    const selectedSongName = $(event.currentTarget).parent().parent().find('.song-name').text()
    const selectedArtistName = $(event.currentTarget).parent().parent().find('.artist-name').text()

    console.log(selectedSongId)
    console.log(selectedSongName)
    console.log(selectedArtistName)

    const formHtml = buildEditFormHtml(selectedSongId, selectedSongName, selectedArtistName)

    $(event.currentTarget).parent().parent().html(formHtml)
  })

  // listen for click event on the "cancel" (edit) link
  $('body').on('click', '.song .cancel-edit', (event) => {
    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const songName = $(event.currentTarget).parent().find('#update-song-name').val()
    const artistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(songName)
    console.log(artistName)

    const playlistItemHtml = buildSongItemHtml(songName, artistName)

    $(event.currentTarget).parent().parent().html(playlistItemHtml)
  })

  // listen for the submit event for update song form
  $('body').on('submit', '#update-song-form', (event) => {
    event.preventDefault()

    const songId = $(event.currentTarget).parent().find('#song-id').val()
    const updatedSongName = $(event.currentTarget).parent().find('#update-song-name').val()
    const updatedArtistName = $(event.currentTarget).parent().find('#update-artist-name').val()

    console.log(songId)
    console.log(updatedSongName)
    console.log(updatedArtistName)

    // Firebase API - update song using it's ID
    dbReferenceSongs.child(songId).update({
      songName: updatedSongName,
      artistName: updatedArtistName
    })

    const playlistItemHtml = buildSongItemHtml(updatedSongName, updatedArtistName)

    $(event.currentTarget).parent().html(playlistItemHtml)
  })

  // -------- **DELETE** ---------

  // listen for click event on the "delete" button
  $('body').on('click', 'button.delete-song', (event) => {
    const songId = $(event.currentTarget).parent().parent().attr('id')
    console.log(songId)

    // Firebase API - remove song from database using it's ID
    dbReferenceSongs.child(songId).remove()
    $(event.currentTarget).parent().parent().remove()
  })

  // -------- Utility Functions ---------

  // html template for Edit Song Form
  function buildEditFormHtml (songId, songName, artistName) {
    return (
      `
        <form id="update-song-form">
          <p>Update Song</p>
          <input type="text" id="update-song-name" value="${songName}"/>
          <input type="text" id="update-artist-name" value="${artistName}"/>
          <input type="hidden" id="song-id" value="${songId}"/>
          <button>Update Song</button>
          <a href="#" class="cancel-edit"> cancel </a>
        </form>
      `
    )
  }

  // html template for a Song Item
  function buildSongItemHtml (songName, artistName) {
    return (
      `<div class="song-name">${songName}</div>
        <div class="artist-name">${artistName}</div>

        <div class="actions">
          <button class="edit-song">edit</a>
          <button class="delete-song">delete</a>
        </div>`
    )
  }

  // Clear text fields on Add New Song form
  function clearAddFormFields () {
    $('#song-name').val('')
    $('#artist-name').val('')
  }
})
