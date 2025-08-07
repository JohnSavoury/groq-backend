
  let ctrlPressed = false;
  let insertionTargetLine = null;
  let ct = "";
  var res = [];
  var A = [];
  let rslt = "";

  // Track Ctrl key state
  $(document).keydown(e => { if (e.ctrlKey) ctrlPressed = true; });
  $(document).keyup(e => { if (!e.ctrlKey) ctrlPressed = false; });
  
window.app = {
  getSentences,
  addBob,
  showSetup,
  clearBox,
  savePreview,
  saveSentences,
  setupSaveBoys,
  setupSaveGirls,
  appendSentencesToTop,
  setupSaveCateg,
  setupHideSetup
};
    
function getSentences(id){
    if(id=="startersx"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c0").innerHTML;
    }
	if(id=="listeningx"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c1").innerHTML;
    }
	if(id=="recallx"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c2").innerHTML;
    }
	if(id=="homeworkx"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c3").innerHTML;
    }
	if(id=="other1x"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c4").innerHTML;
    }
	if(id=="other2x"){
	    document.getElementById("sentence-container").innerHTML = document.getElementById("c5").innerHTML;
    }
	document.querySelectorAll("#sentence-container .wordDrag").forEach(elem => {
		makeDraggable(elem);
	});
}

function loadTextFileIntoDiv(fileName, divId) {
    fetch(fileName)  // Fetch the text file
	.then(response => response.text())  // Convert response to text
	.then(data => {
		const div = document.getElementById(divId);
		const sentences = data.split("\n"); // Split by newline to separate sentences
		div.innerHTML = ''; // Clear existing content in the div

		// Wrap each sentence in a span and append to the div
		sentences.forEach((sentence, index) => {
			if (sentence.trim() !== "") {
				const span = document.createElement("span");
				span.className = "wordDrag"; // Add the "wordDrag" class
				span.textContent = sentence.trim(); // Set the sentence text
				span.id = 's' + (index + 1); // Set a unique id for each sentence (s1, s2, s3, ...)
				span.setAttribute("draggable", "true"); // Make it draggable
				
				// Append the span to the div, followed by a line break
				div.appendChild(span);
				div.appendChild(document.createElement("br"));
			}
		});
	})
	.catch(error => {
		console.error('Error loading file:', error);
	});
}

loadTextFileIntoDiv('c0.txt', 'c0');
loadTextFileIntoDiv('c1.txt', 'c1');
loadTextFileIntoDiv('c2.txt', 'c2');
loadTextFileIntoDiv('c3.txt', 'c3');
loadTextFileIntoDiv('c4.txt', 'c4');
loadTextFileIntoDiv('c5.txt', 'c5');
//=====================================================================================

function makeDraggable(elem, text = null) {
  elem.setAttribute("draggable", "true");
  elem.addEventListener("dragstart", function (e) {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData("text/plain", text ?? elem.textContent.trim());
  });
}

// === Drag over drop target ===
const dropTarget = document.getElementById("drop-target");

dropTarget.addEventListener("dragover", e => {
  e.preventDefault();
  const target = e.target.closest(".dropped-sentence");
  showInsertionLine(target);
});

dropTarget.addEventListener("dragleave", e => {
  hideInsertionLine();
});

// === Drop into drop-target area ===
dropTarget.addEventListener("drop", e => {
  e.preventDefault();
  hideInsertionLine();
  if (!e.dataTransfer) return;

  const text = e.dataTransfer.getData("text/plain").trim();
  if (!text) return;
  
  dropTarget.innerText += '\n'+text;
});

// === Insertion line logic ===
const insertionLine = document.createElement("div");
insertionLine.style.position = "absolute";
insertionLine.style.height = "2px";
insertionLine.style.backgroundColor = "red";
insertionLine.style.pointerEvents = "none";
insertionLine.style.display = "none";
document.body.appendChild(insertionLine);

function showInsertionLine(target) {
  if (!target) return insertionLine.style.display = "none";

  const rect = target.getBoundingClientRect();
  insertionLine.style.left = rect.left + "px";
  insertionLine.style.top = rect.top + "px";
  insertionLine.style.width = rect.width + "px";
  insertionLine.style.display = "block";
}

function hideInsertionLine() {
  insertionLine.style.display = "none";
}

// === Drop onto category buttons ===
const categories = {
  startersx: "c0",
  listeningx: "c1",
  recallx: "c2",
  homeworkx: "c3",
  other1x: "c4",
  other2x: "c5"
};

Object.keys(categories).forEach(catId => {
  const catElem = document.getElementById(catId);
  const targetDivId = categories[catId];
  const targetDiv = document.getElementById(targetDivId);

  // Visual cue on dragover
  catElem.addEventListener("dragover", e => {
    e.preventDefault();
    catElem.style.outline = "2px dashed #fff";
  });

  catElem.addEventListener("dragleave", e => {
    catElem.style.outline = "";
  });

  catElem.addEventListener("drop", e => {
  e.preventDefault();
  catElem.style.outline = "";

  let droppedText = "";

  // Try to get dropped text from dataTransfer first
  if (e.dataTransfer) {
    droppedText = e.dataTransfer.getData("text/plain").trim();
  }

  // Fallback: if droppedText is empty, try using the user's selection
  if (!droppedText) {
    droppedText = window.getSelection().toString().trim();
  }

  if (!droppedText) return;

  // Create a new span for the sentence
  const span = document.createElement("span");
  span.className = "wordDrag";
  span.textContent = droppedText;
  makeDraggable(span, droppedText);

  // Add to category listing
  targetDiv.appendChild(span);
  targetDiv.appendChild(document.createElement("br"));

  const container = document.getElementById("sentence-container");
  const exists = Array.from(container.children).some(el => el.textContent.trim() === droppedText);
  if (!exists) {
    const sentDiv = document.createElement("div");
    sentDiv.className = "sentence wordDrag";
    sentDiv.textContent = droppedText;
    makeDraggable(sentDiv, droppedText);
    container.appendChild(sentDiv);
  }
});
});

//=====================================================================================
function getGender(){
	var mySelect = document.getElementById('girls');
    var selectedText = mySelect.options[mySelect.selectedIndex].text;
	if (selectedText != "-"){
		return true;
	}else{
		mySelect = document.getElementById('boys');
		selectedText = mySelect.options[mySelect.selectedIndex].text;
		return false;
	}
}

function getPGender(){
	var mySelect = document.getElementById('girls');
    var selectedText = mySelect.options[mySelect.selectedIndex].text;
	if (selectedText != "-"){
		return 'female';
	}else{
		mySelect = document.getElementById('boys');
		selectedText = mySelect.options[mySelect.selectedIndex].text;
		return 'male';
	}
}

function getPName(){
	var mySelect = document.getElementById('girls');
    var selectedText = mySelect.options[mySelect.selectedIndex].text;
	if (selectedText != "-"){
		return selectedText;
	}else{
		mySelect = document.getElementById('boys');
		selectedText = mySelect.options[mySelect.selectedIndex].text;
		return selectedText;
	}
}

function clearBox(){
	document.getElementById('drop-target').innerText = '';
}

function showSetup(){
	if(document.getElementById('msetup').style.display == "flex"){
		document.getElementById('msetup').style.display = 'none';
		document.getElementById('mainLayout').style.display = 'block';
	}else{
		document.getElementById('msetup').style.display = "flex";
		document.getElementById('mainLayout').style.display = 'none';
	}
}

function setupHideSetup(){
	document.getElementById('msetup').style.display = "none";
	document.getElementById('mainLayout').style.display = 'block';
}

function fillCateg(vlu){
	if(vlu == "startersx"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c0").innerHTML;
		ct = "c0";
	}
	if(vlu == "listeningx"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c1").innerHTML;
		ct = "c1";
	}
	if(vlu == "recallx"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c2").innerHTML;
		ct = "c2";
	}
	if(vlu == "homeworkx"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c3").innerHTML;
		ct = "c3";
	}
	if(vlu == "other1x"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c4").innerHTML;
		ct = "c4";
	}
	if(vlu == "other2x"){
		document.getElementById("mycategs").innerHTML = document.getElementById("c5").innerHTML;
		ct = "c5";
	}
}

function setupSaveCateg(){
	document.getElementById(ct).innerHTML = document.getElementById("mycategs").innerHTML;
	saveSentences();
}

function appendSentencesToTop() {
  const topDiv = document.getElementById('mycategs');
  const bottomDiv = document.getElementById('mysentences');

  // Get current content
  const bottomText = bottomDiv.innerText.trim();

  if (!bottomText) return;

  // Split into sentences (adjust delimiter as needed)
  const sentences = bottomText.split(/\n+/).filter(s => s.trim() !== '');

  // Count existing spans in top div to determine next ID number
  const existingSpans = topDiv.querySelectorAll('span.wordDrag');
  let idNum = existingSpans.length + 1;

  // Build HTML to append
  let html = '';
  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (sentence) {
      html += '<span class="wordDrag" id="s'+idNum+'" draggable="true">'+sentence+'</span><br>';
    }
  }

  // Append to top div
  topDiv.insertAdjacentHTML('beforeend', html);
}

function setupSaveBoys(){
	const boys = document.getElementById("myboys").innerText.trim();
	fetch("save_boyslist.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            boys: boys
        })
    })
    .then(response => response.text())
    .then(result => {
        alert("Boys saved: " + result);
    })
    .catch(error => {
        console.error("Error saving list:", error);
    });
}

function setupSaveGirls(){
	const girls = document.getElementById("mygirls").innerText.trim();
	fetch("save_girlslist.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            girls: girls
		})
	})
    .then(response => response.text())
    .then(result => {
        alert("Girls saved: " + result);
    })
    .catch(error => {
        console.error("Error saving list:", error);
    });
}

function addBob() {
  const dt = document.getElementById('drop-target');
  const pname = getPName(); //name of pupil      
  const gender = getPGender(); //'female', 'male'
  // Split into sentences
  let sentences = dt.textContent;
  askGroq(sentences+"\n\nName: "+pname+"\nGender: "+gender+"\n\nWrite a teacher's school report for the parents of the pupil in the Name and Gender fields based on the sentences above.");
}

/*function addBob() {
  const dt = document.getElementById('drop-target');
  const pname = getPName(); //name of pupil      
  const isFemale = getGender(); //true = female, false = male
  

  const genderMap = {
    subject: isFemale ? 'she' : 'he',
    object: isFemale ? 'her' : 'him',
    possessiveAdj: isFemale ? 'her' : 'his',
    possessive: isFemale ? 'hers' : 'his',
    noun: isFemale ? 'girl' : 'boy',
  };

  // Split into sentences
  let sentences = dt.textContent.split('.')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let result = [];

  for (let i = 0; i < sentences.length; i++) {
    let s = sentences[i];

    // Every 2nd sentence keeps the actual name (0-based index)
    if (i % 2 === 0) {
      // Replace "Bob" and "Bob's" with person's name
      s = s.replace(/\bBob's\b/g, `${pname}'s`);
      s = s.replace(/\bBob\b/g, pname);
    } else {
      // Contextual replacement:
      // 1. Handle "Bob's" → possessive adjective (his/her)
      s = s.replace(/\bBob's\b/g, genderMap.possessiveAdj);

      // 2. Replace "Bob" based on position and grammar
      s = s.replace(/\bBob\b/g, (match, offset, fullStr) => {
        const before = fullStr.substring(0, offset).trim();
        const after = fullStr.substring(offset + match.length).trim();

        const firstWord = /^[A-Z]/.test(match) && offset === 0;

        // If first word or followed by verb, use subject
        if (firstWord || /^is|was|has|had|fidgets|runs|walks|sits/.test(after)) {
          return genderMap.subject;
        }

        // Otherwise assume object
        return genderMap.object;
      });
    }

    // Replace other pronouns
    s = s.replace(/\bhe\b/gi, genderMap.subject);
    s = s.replace(/\bhim\b/gi, genderMap.object);
    s = s.replace(/\bhis\b/gi, genderMap.possessiveAdj);
    s = s.replace(/\bgirl\b|\bboy\b/gi, genderMap.noun);

    // Capitalize first character
    s = s.charAt(0).toUpperCase() + s.slice(1);

    result.push(s);
  }

  // Set updated text
  dt.textContent = result.join('. ') + '.';
}*/

function savePreview() {
    // Step 1: Get the content of #drop-target
    const content = document.getElementById('drop-target').innerText.trim();
            
	// Step 2: Create a Blob object with the content
	const blob = new Blob([content], { type: 'text/plain' });
	
	// Step 3: Create a link to download the file
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = 'content.txt'; // You can change the filename here
	
	// Step 4: Trigger the download by clicking the link programmatically
	link.click();
}

jQuery(function($){
    $("#mysentence").focusout(function(){
        var element = $(this);        
        if (!element.text().replace(" ", "").length) {
            element.empty();
        }
    });
});

function saveSentences() {
  const divIds = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5']; // All divs you want to save
  const sentences = {};

  // Loop through each div and collect its text content
  divIds.forEach(id => {
    const div = document.getElementById(id);
    const sentencesText = Array.from(div.querySelectorAll('.wordDrag'))
                                .map(span => span.textContent.trim())
                                .join('\n');
    sentences[id] = sentencesText;
  });

  // Send the sentences data to the server using AJAX
  fetch('save_sentences.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sentences) // Send the sentences as a JSON object
  })
  .then(response => response.text())
  .then(result => {
    console.log('Sentences saved:', result);
  })
  .catch(error => {
    console.error('Error saving sentences:', error);
  });
}