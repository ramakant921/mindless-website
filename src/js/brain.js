console.log("Never Gonna Give You Up...");

// fetch('http://localhost:3000/spotify/currentTrack', {
//     method: 'GET',
// })
// .then(res => res.json())
// .then(track => {
//     console.log(track);
// });

fetch('http://localhost:3000/github/repos', {
    method: 'GET',
})
.then(res => res.json())
.then(track => {
    console.log(track);
});

fetch('http://localhost:3000/github/forks', {
    method: 'GET',
})
.then(res => res.json())
.then(track => {
    console.log(track);
});

fetch('http://localhost:3000/github/inbox', {
    method: 'GET',
})
.then(res => res.json())
.then(notifications => {
    console.log(notifications);
});
