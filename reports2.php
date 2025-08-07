<?php
session_name("users_session");
session_start();
$filename = "girls.txt";
$girls = explode("\n", file_get_contents($filename));
$filename = "boys.txt";
$boys = explode("\n", file_get_contents($filename));
?>
<!DOCTYPE html>
<html>
<head>
  <title>Reports</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="reports2.css" />
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script type="text/javascript" src="jquery.ui.touch-punch.js"></script>
  <script type="module" src="reports2.js"></script>
  <script>
  async function askGroq(prompt) {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    document.getElementById("drop-target").textContent = data.response;
  }
  </script>
</head>
<body>

<div class="container">
  <div class="topmenu" id="mnu">
    <a id="idx9" href="#" onclick="app.showSetup()">Setup</a>&nbsp;&nbsp;
	<a id="idx10" href="#" onclick="app.clearBox()">Clear Drop Zone</a>&nbsp;&nbsp;		
	<a id="idx11" href="#" onclick="app.addBob()">Preview</a>&nbsp;&nbsp;                             
	<a id="idx12" href="#" onclick="app.savePreview()">Save Previewed Document</a>&nbsp;&nbsp;
	<a id="idx13" href="#" onclick="app.saveSentences()">Save Updated Categories</a>
  </div><br>
  
<div id="msetup" class="msetup">
  <!-- First row: labels -->
  <div style="width: 15%; height: 30px;">Boys</div>
  <div style="width: 15%; height: 30px;">Girls</div>
  <div style="width: 60%; height: 30px;">
    Categories&nbsp;&nbsp;
    <select name="categs" id="categs" onchange="fillCateg(this.value)">
      <option value="-">-</option>
      <option value="startersx">Starters</option>
      <option value="listeningx">Listening</option>
      <option value="recallx">Recall</option>
      <option value="homeworkx">Homework</option>
      <option value="other1x">Other1</option>
      <option value="other2x">Other2</option>
    </select>
  </div>

  <!-- Second row: content boxes -->
  <div id="myboys" contenteditable="true" class="columnBox" style="width: 15%; border: 2px solid green;"></div>
  <div id="mygirls" contenteditable="true" class="columnBox" style="width: 15%; border: 2px solid green;"></div>

  <div id="cats" style="width: 60%; display: flex; flex-direction: column;">
    <div id="mycategs" contenteditable="true"></div>
    <div id="mysentences" contenteditable="true"></div>
  </div>

  <!-- Third row: buttons -->
  <div style="width: 15%; height: 40px;"><input type="button" value="Save Boys List" onclick="app.setupSaveBoys()"></div>
  <div style="width: 15%; height: 40px;"><input type="button" value="Save Girls List" onclick="app.setupSaveGirls()"></div>
  <div style="width: 60%; height: 40px;">
    <input type="button" value="Add Sentences" onclick="app.appendSentencesToTop()">&nbsp;&nbsp;
    <input type="button" value="Save Current Category" onclick="app.setupSaveCateg()">
  </div>

  <div style="width: 100%; margin-top: 10px;">
    <input type="button" value="Close Setup Window" onclick="app.setupHideSetup()">
  </div>
</div>

<div id="mainLayout">
  <div style="display: flex; align-items: flex-start;">
    <div class="categs" id="categs">
    Girls<br>
    <select name="girls" id="girls"><option value="-">-</option><br>
<?php foreach($girls as $g){
		echo "<option value='".$g."'>$g</option>";
	  }
?>
    </select><br>
	Boys<br>
    <select name="boys" id="boys"><option value="-">-</option><br>
<?php foreach($boys as $b){
		echo "<option value='".$b."'>$b</option>";
	  }
?>
    </select>
    <div class="phraseHeader" id="startersx" style="background-color: #00BB00;" onclick="app.getSentences(this.id)">Starters</div>
    <div class="phraseHeader" id="listeningx" style="background-color: #A04544;" onclick="app.getSentences(this.id)">Listening</div>
    <div class="phraseHeader" id="recallx" style="background-color: #6F41F9;" onclick="app.getSentences(this.id)">Recall</div>
    <div class="phraseHeader" id="homeworkx" style="background-color: #666700;" onclick="app.getSentences(this.id)">Homework</div>
    <div class="phraseHeader" id="other1x" style="background-color: #019393;" onclick="app.getSentences(this.id)">Other</div>
    <div class="phraseHeader" id="other2x" style="background-color: #FF2728;" onclick="app.getSentences(this.id)">Other</div>
</div>
    

    <div id="sentence-container">
      <!-- Sentences will appear here -->
    </div>
  </div>

  <div id="drop-wrapper">
    <div id="drop-target" class="text2" contenteditable="true" data-placeholder="Drop sentences here..."></div>
  </div>
</div>
  
</div>
<div id="c0"></div>
<div id="c1"></div>
<div id="c2"></div>
<div id="c3"></div>
<div id="c4"></div>
<div id="c5"></div>

</body>
</html>