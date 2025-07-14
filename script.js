document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("video-container");

  // Randomize iframe links
  const shuffled = videoLinks.sort(() => 0.5 - Math.random());

  shuffled.forEach(url => {
    const wrapper = document.createElement("div");
    wrapper.className = "iframe-wrapper";

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
  });

  // Chat and Register Buttons
  const chatBtn = document.getElementById("chatBtn");
  const registerBtn = document.getElementById("registerBtn");

  chatBtn.addEventListener("click", () => chatBtn.style.display = "none");
  registerBtn.addEventListener("click", () => registerBtn.style.display = "none");

  // Popup after 4s
  setTimeout(() => {
    document.getElementById("popup").style.display = "flex";
  }, 4000);

  document.getElementById("closePopup").onclick = () => {
    document.getElementById("popup").style.display = "none";
  };
});
