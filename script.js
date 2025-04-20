// Update the line-clamp dynamically (existing code from before)
function updateLineClamp() {
    let clampValue = 6; // default
    if (window.innerWidth < 600) {
      clampValue = 3;
    } else if (window.innerWidth < 1200) {
      clampValue = 5;
    } else {
      clampValue = 8;
    }
    document.documentElement.style.setProperty("--line-clamp", clampValue);
  }
  
  updateLineClamp();
  window.addEventListener("resize", updateLineClamp);
  
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.addEventListener("click", function () {
      const rect = this.getBoundingClientRect();
      const clone = this.cloneNode(true);
      // Remove preview class to show full text.
      clone.querySelectorAll("p.preview").forEach((p) => p.classList.remove("preview"));
      clone.style.position = "fixed";
      clone.style.top = rect.top + "px";
      clone.style.left = rect.left + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.classList.add("fullscreen-clone");
      document.body.appendChild(clone);
      // Set the clone to full screen and center it.
      clone.style.top = "0";
      clone.style.left = "50%";
      clone.style.width = "100%";
      clone.style.height = "100vh";
      clone.style.transform = "translateX(-50%)";
  
      // If there's associated audio, add an audio element and play button.
      const audioSrc = this.getAttribute("data-audio");
      if (audioSrc) {
        const audioElem = document.createElement("audio");
        audioElem.src = audioSrc;
        audioElem.style.display = "none";
        clone.appendChild(audioElem);
        
        const playButton = document.createElement("button");
        playButton.className = "play-btn";
        playButton.innerText = "Play";
        playButton.addEventListener("click", function (e) {
          e.stopPropagation();
          if (audioElem.paused) {
            audioElem.play();
            playButton.innerText = "Pause";
          } else {
            audioElem.pause();
            playButton.innerText = "Play";
          }
        });
        clone.appendChild(playButton);
        
        // If the poem text is split into lines (with class "line"),
        // add a timeupdate listener to highlight the active line.
        const lines = clone.querySelectorAll(".line");
        if (lines.length > 0) {
          audioElem.addEventListener("timeupdate", function () {
            const currentTime = audioElem.currentTime;
            lines.forEach((line) => {
              const start = parseFloat(line.getAttribute("data-start"));
              const end = parseFloat(line.getAttribute("data-end"));
              if (currentTime >= start && currentTime < end) {
                line.classList.add("active");
              } else {
                line.classList.remove("active");
              }
            });
          });
        }
      }
  
      // When the clone is clicked, revert instantly and remove it.
      clone.addEventListener("click", function revert() {
        clone.removeEventListener("click", revert);
        clone.style.top = rect.top + "px";
        clone.style.left = rect.left + "px";
        clone.style.width = rect.width + "px";
        clone.style.height = rect.height + "px";
        clone.style.transform = "";
        document.body.removeChild(clone);
      });
    });
  });
  