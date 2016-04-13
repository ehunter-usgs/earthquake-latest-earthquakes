<?php
if (!isset($TEMPLATE)) {

  $TITLE = 'DYFI List Format';

  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;

  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  // Stuff that goes at the bottom of the page (i.e. <script> tags)
  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="DyfiListFormat.js"></script>
  ';

  include 'template.inc.php';
}
?>

<ul id="dyfi-list-format-example" class="listContent dyfi-list"></ul>