module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {

db.collection('hits').find().toArray((err, result) => {
  if (err) return console.log(err)
  console.log('Signup test',result.filter(x=>x.name===req.user.local.email))
  if(result.filter(x=>x.name===req.user.local.email)[0]===undefined){
    db.collection('hits').insert({
      name: req.user.local.email,
      favs: '',
    })
    setTimeout(()=>{
    db.collection('video').find().toArray((err, result) => {
              if (err) return console.log(err)
              res.render('profile.ejs', {
                user : req.user,
                anime: result.sort((a,b)=>(a.name > b.name) ? 1 : -1)
              })
            })
    },1500)

  }
}
)

db.collection('video').find().toArray((err, result) => {
          if (err) return console.log(err)
          console.log(result[0])
          res.render('profile.ejs', {
            user : req.user,
            anime: result.sort((a,b)=>(a.name > b.name) ? 1 : -1)
          })
        })

    });

    app.get('/manga', isLoggedIn, function(req, res) {


        db.collection('manga').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('manga.ejs', {
            user : req.user,
            manga: result.sort((a,b)=>(a.name > b.name) ? 1 : -1)
          })
        })

    });

    app.get('/favs', isLoggedIn, function(req, res) {

        db.collection('hits').find().toArray((err, result) => {
          if (err) return console.log(err)
          console.log(result.filter(x=>x.name===req.user.local.email)[0].favs)
          res.render('favs.ejs', {
            user : req.user,
            favs: result.filter(x=>x.name===req.user.local.email)[0].favs
          })
        })

    });

    app.put('/collectFavs', isLoggedIn, function(req, res) {

      db.collection('hits').find().toArray((err, result) => {
        if (err) return console.log(err)
console.log(result.filter(x=>x.name===req.user.local.email)[0].favs)
        db.collection('hits')
        .findOneAndUpdate({name: req.user.local.email}, {
          $set: {
            favs: req.body.favs + result.filter(x=>x.name===req.user.local.email)[0].favs
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
        })

      })

      })



    //============Used to collect Data for database============//
  //   app.put('/collectManga', (req, res)=>{
  //     db.collection('manga').insert({
  //               name: req.body.name,
  //               listItem: req.body.listItem
  //             })
  //   }
  // )

//============Used to collect Data for database============//
//============Thought about allowing users to add their favorite anime to the list============//
//============but their are way too many NSFW entries in eacj search query============//
//   app.put('/collectAnime', (req, res)=>{
//     db.collection('video').insert({
//               name: req.body.name,
//               listItem: req.body.listItem
//             })
//   }
// )

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    // app.post('/messages', (req, res) => {
    //   db.collection('hits').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })
    //
    // app.put('/messages', (req, res) => {
    //   db.collection('hits')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })
    //
    // app.put('/nomessages', (req, res) => {
    //   db.collection('hits')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:!req.body.thumbUp?0:req.body.thumbUp-1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })
    //
    // app.delete('/messages', (req, res) => {
    //   db.collection('hits').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
