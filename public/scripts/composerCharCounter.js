$(document).ready(function() {
    const $tweetText = $('#tweet-text');

    $tweetText.on('keyup', function() {
      let tweetLength = this.value.length;

      const $counter = $(this).closest('.new-tweet').find('.counter');

      $counter.text(140 - tweetLength);

      if (tweetLength > 140) {
        $counter.addClass('counter-red')
      } else {
        $counter.removeClass('counter-red')
      }
      
    })
});







