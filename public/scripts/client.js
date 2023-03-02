/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

const createTweetElement = function(object) {

  // variables from user object to be used in object
  const profilePicURL = object.user.avatars; 
  const name = object.user.name; 
  const handle = object.user.handle; 
  const content = object.content.text;
  const tweetDate = timeago.format(object.created_at); 

  // new tweet article
  const newArticle = $("<article class='tweetDisplay'>");

  // tweet header elements 
  const newHeader = $("<header class='tweetHeader'>");
  const newHeaderDiv = $("<div>");
  const newTweetProfilePic = $(`<img src=${profilePicURL}>`);
  const newTweetDisplayName = $("<p class='tweetDisplayName'>").text(`${name}`);
  const newTweetHandle = $("<p class='tweetHandle'>").text(`${handle}`);

  newHeaderDiv.append(newTweetProfilePic);
  newHeaderDiv.append(newTweetDisplayName);
  newHeader.append(newHeaderDiv);
  newHeader.append(newTweetHandle);

  // tweet body elements
  const newBodyP = $("<p class='tweetContent'>").text(`${content}`);

  // tweet footer elements
  const newFooter = $("<footer class='tweetFooter'>");
  const newFooterP = $("<p>").text(`${tweetDate}`);
  const newFooterDiv = $("<div>");
  const newIcon1 = $("<i class='fa-solid fa-flag fa-2xs reportButton'></i>")
  const newIcon2 = $("<i class='fa-solid fa-retweet fa-2xs retweetButton'></i>")
  const newIcon3 = $("<i class='fa-solid fa-heart fa-2xs likeButton'></i>")

  newFooterDiv.append(newIcon1);
  newFooterDiv.append(newIcon2);
  newFooterDiv.append(newIcon3);
  newFooter.append(newFooterP);
  newFooter.append(newFooterDiv);

  // adding new elements to article
  newArticle.append(newHeader);
  newArticle.append(newBodyP);
  newArticle.append(newFooter);

  return newArticle;
}

const renderTweets = function(arrayofObj) {
  // loop through array of users
  for (const obj of arrayofObj) {
    const $tweet = createTweetElement(obj);
    // add tweet to top of tweets display
    $('#tweetsContainer').prepend($tweet);
  };
}

const checkIfTweetIsValid = function(input) {
  const tweetText = $(input).val();
  const tweetLength = tweetText.length;

  // if the input is left empty, display error message
  if (tweetText === '' || tweetText === null) {
    $(".error").text("❗️ Please fill out the field");
    $(".error").slideDown();
    return false;
  }
    // if the input exceeds character limt of 140, display error message
  if (tweetLength > 140) {
    $(".error").text("❗️ Please stay within the character limit");
    $(".error").slideDown();
    return false;
  }
  return true;
}

const addTweetToTop = function() {
  // ajay get request to obtain array of users
  $.ajax({
    method: 'GET',
    url: '/tweets'
  }).then((res) => { // res = arrayOfUsers
    const lengthOfArr = res.length; // obtain number of elements in array of users
    const newTweetData = res[lengthOfArr - 1]; // grabs data of the last added element from the array
    const newTweet = createTweetElement(newTweetData); // creates tweet using data
    $('#tweetsContainer').prepend(newTweet); // prepends tweet to tweet container
  }).then(() => {
    $('#tweet-text').val(''); // resets text area to empty
    $('.counter').val('140'); // resets character counter to 140
  })
}


$(document).ready(function() {

  $(".error").hide(); // immediately hides error message after DOM elements load

  $('#newTweetForm').submit(function(event) { // event handler set on new tweet form
    event.preventDefault(); // prevents event from redirecting to /tweets page
    
    const $formData = $(this).serialize();
    
    if (checkIfTweetIsValid($('#tweet-text'))) { // checks if the input provided is valid using checkIfTweetIsValid function
      $(".error").slideUp(); // removes error message if previously shown
      $.ajax({ //ajax post request sending form data to server
        type: 'POST',
        url: '/tweets',
        data: $formData,
        success: function() {
          console.log('POST request success');
        }
      }).then(() => {
        addTweetToTop(); // prepend the tweet to top of the page using addTweetToTop function
      })
    }
  })

  const loadTweets = function() { // function to render all tweets currently in database
    $.ajax({ // ajax get request to obtain array of users from database
      method: 'GET',
      url: '/tweets'
    }).then((res) => { // res = array of users
      renderTweets(res); // uses the render tweets function which uses createTweetElement function to make and prepend new tweet for all users in response array when called
    })
  }

  loadTweets(); // calls loadTweets function to render all tweets to page
});

