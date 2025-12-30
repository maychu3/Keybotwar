fetch("/api/check")
.then(r => r.json())
.then(d => {
  const box = document.getElementById("box");
  const retry = document.getElementById("retry");

  if (d.expired) {
    box.innerHTML = "❌ Key đã hết hạn";
    retry.style.display = "block";
    retry.onclick = () => location.href = d.bypass;
  } else {
    box.innerHTML = `
      <b>KEY:</b> ${d.key}<br><br>
      <b>Ngày tạo:</b><br>${new Date(d.created).toLocaleString()}<br><br>
      <b>Hết hạn:</b><br>${new Date(d.expire).toLocaleString()}
    `;
  }
});
